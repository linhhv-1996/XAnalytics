// src/lib/server/twitter.ts
import { RAPIDAPI_KEY } from '$env/static/private';
import type { Tweet, TwitterProfile, RawTwitterData, TweetType, ReplyContext, ReplyTweet } from '$lib/types';
import { logData } from './debug';

const API_HOST = 'twitter241.p.rapidapi.com';

const GLOBAL_IGNORE_LIST = new Set([
    'elonmusk', 'barackobama', 'justinbieber', 'katyperry', 'rihanna', 
    'cristiano', 'taylorswift13', 'realdonaldtrump', 'ladygaga', 'narendramodi',
    'nasa', 'mrbeast', 'youtube', 'cnn', 'espn', 'twitter', 'x', 'instagram',
    'potus', 'vp', 'nytimes', 'bbcbreaking', 'billgates'
]);


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- CLEANER FUNCTIONS ---

function cleanProfile(raw: any): TwitterProfile {
    return {
        id: raw.rest_id || "",
        name: raw?.core?.name || "",
        handle: raw?.core?.screen_name || "",
        bio: raw.legacy.description || "",
        avatar: raw.avatar.image_url ?? "",
        banner: raw.legacy.profile_banner_url || null,
        followers: raw.legacy.followers_count || 0,
        following: raw.legacy.friends_count || 0,
        tweetsCount: raw.legacy.statuses_count || 0,
        isVerified: raw.is_blue_verified || false,
        website: raw.legacy.entities?.url?.urls?.[0]?.expanded_url || "",
        joined: raw.core.created_at,
        location: raw.location?.location || ""
    };
}

function cleanTweet(t: any, isChild: boolean = false): Tweet | null {
    if (!t) return null;

    // Check Retweet
    const isRetweet = !!t.legacy?.retweeted_status_result;
    const legacy = t.legacy || t.tweet?.legacy;

    if (!legacy) return null;

    const rest_id = t.rest_id || t.tweet?.rest_id || "";
    const core = t.core || t.tweet?.core;
    const screenName = core?.user_results?.result?.legacy?.screen_name || "user";

    // Metrics
    const views = Number(t.views?.count || t.tweet?.views?.count || 0);

    // Entities processing
    const entities = legacy.entities || {};
    const urls = (entities.urls || []).map((u: any) => u.expanded_url);
    const hashtags = (entities.hashtags || []).map((h: any) => h.text);
    const userMentions = (entities.user_mentions || []).map((m: any) => m.screen_name);

    // Media logic
    const media = entities.media || [];
    let mediaType: Tweet['mediaType'] = 'none';
    if (media.length > 0) {
        const hasVideo = media.some((m: any) => m.type === 'video' || m.type === 'animated_gif');
        const hasImage = media.some((m: any) => m.type === 'photo');
        mediaType = (hasVideo && hasImage) ? 'mixed' : (hasVideo ? 'video' : 'image');
    }

    let type: TweetType = 'single';
    if (isRetweet) type = 'retweet';
    else if (isChild) type = 'reply';

    return {
        id: rest_id,
        type,
        text: legacy.full_text || "",
        createdAt: legacy.created_at,
        views,
        likes: legacy.favorite_count || 0,
        retweets: legacy.retweet_count || 0,
        replies: legacy.reply_count || 0,
        bookmarks: legacy.bookmark_count || 0,
        isReply: !!legacy.in_reply_to_status_id_str,
        hasMedia: media.length > 0,
        mediaType,
        url: `https://x.com/${screenName}/status/${rest_id}`,
        outboundLinks: urls,
        hashtags,
        mentions: userMentions,
        threadChildren: []
    };
}

/**
 * Hàm parse JSON từ endpoint "Get User Replies"
 * @param jsonResponse cục JSON to đùng từ API
 */
function parseUserReplies(jsonResponse: any): ReplyTweet[] {
    const instructions = jsonResponse?.result?.timeline?.instructions || [];
    const addEntries = instructions.find((i: any) => i.type === 'TimelineAddEntries');

    if (!addEntries) return [];

    const replies: ReplyTweet[] = [];

    addEntries.entries.forEach((entry: any) => {
        // Chỉ xử lý các entry là Module hội thoại (Conversation)
        if (entry.content?.entryType === 'TimelineTimelineModule') {
            const items = entry.content.items;

            // Cấu trúc chuẩn: [0] = Bài gốc (Parent), [1] = Bài reply (Child - User's tweet)
            // Đôi khi conversation dài hơn 2, nhưng bài reply của user thường là cái cuối cùng trong list trả về hoặc cái thứ 2.
            // Theo JSON mẫu của mày thì nó là cái thứ 2 (index 1).
            if (items && items.length >= 2) {
                const targetRaw = items[0].item?.itemContent?.tweet_results?.result;
                const replyRaw = items[1].item?.itemContent?.tweet_results?.result;

                // Kiểm tra dữ liệu hợp lệ (tránh null/undefined do tweet bị xóa)
                if (targetRaw && replyRaw && replyRaw.legacy && targetRaw.legacy) {

                    // 1. Lấy thông tin bài gốc (Context)
                    const targetCore = targetRaw.core?.user_results?.result?.legacy;
                    const replyTo: ReplyContext = {
                        id: targetRaw.rest_id,
                        text: targetRaw.legacy.full_text,
                        createdAt: targetRaw.legacy.created_at,
                        authorHandle: targetCore?.screen_name || 'unknown',
                        authorAvatar: targetCore?.profile_image_url_https || ''
                    };

                    // 2. Lấy thông tin bài Reply (Hành vi user)
                    const replyLegacy = replyRaw.legacy;
                    const reply: ReplyTweet = {
                        id: replyRaw.rest_id,
                        text: replyLegacy.full_text,
                        createdAt: replyLegacy.created_at, // Format: "Wed Nov 26 07:38:53 +0000 2025"

                        likes: replyLegacy.favorite_count || 0,
                        replies: replyLegacy.reply_count || 0,
                        retweets: replyLegacy.retweet_count || 0,
                        views: Number(replyRaw.views?.count || 0),

                        replyTo: replyTo
                    };

                    replies.push(reply);
                }
            }
        }
    });

    return replies;
}

// --- MAIN FETCHER ---

export async function fetchTwitterData(handle: string): Promise<RawTwitterData> {
    const cleanHandle = handle.toLowerCase().trim();
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': API_HOST
        }
    };

    // 1. Get User Info
    const userRes = await fetch(`https://${API_HOST}/user?username=${cleanHandle}`, options);
    if (!userRes.ok) throw new Error('Failed to fetch user');
    const userData = await userRes.json();
    const userRaw = userData.result?.data?.user?.result;
    if (!userRaw) throw new Error('User not found');

    const profile = cleanProfile(userRaw);

    // 2. Get Tweets
    let allTweetsRaw: Tweet[] = [];
    let pinnedTweetRaw: Tweet | null = null;
    let cursor: string | undefined;
    const MAX_BATCHES = 4; // Lấy khoảng 40-50 bài

    for (let i = 0; i < MAX_BATCHES; i++) {
        try {
            const cursorParam = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
            const res = await fetch(`https://${API_HOST}/user-tweets?user=${profile.id}&count=20${cursorParam}`, options);
            if (!res.ok) break;

            const data = await res.json();
            const instructions = data.result?.timeline?.instructions || [];

            let nextCursor: string | undefined;

            instructions.forEach((inst: any) => {
                if (inst.type === 'TimelinePinEntry') {
                    if (i === 0) {
                        const raw = inst.entry?.content?.itemContent?.tweet_results?.result;
                        pinnedTweetRaw = cleanTweet(raw);
                        if (pinnedTweetRaw) pinnedTweetRaw.type = 'single';
                    }
                } else if (inst.type === 'TimelineAddEntries') {
                    // Regular Tweets
                    inst.entries.filter((e: any) => e.entryId.startsWith('tweet-')).forEach((e: any) => {
                        const cleaned = cleanTweet(e?.content?.itemContent?.tweet_results?.result);
                        if (cleaned) allTweetsRaw.push(cleaned);
                    });

                    // Thread / Conversation
                    inst.entries.filter((e: any) => e.entryId.startsWith('profile-conversation-')).forEach((e: any) => {
                        const items = e.content?.items || [];
                        if (items.length > 0) {
                            const root = cleanTweet(items[0]?.item?.itemContent?.tweet_results?.result);
                            if (root) {
                                // Get children
                                const children = items.slice(1).map((it: any) =>
                                    cleanTweet(it.item?.itemContent?.tweet_results?.result, true)
                                ).filter((t: any) => t !== null && t.id !== root.id);

                                root.threadChildren = children;
                                if (children.length > 0) root.type = 'thread';
                                allTweetsRaw.push(root);
                            }
                        }
                    });

                    // Cursor
                    const c = inst.entries.find((e: any) => e.entryId.startsWith('cursor-bottom'));
                    if (c) nextCursor = c.content?.value || c.content?.itemContent?.value;
                }
            });

            if (!nextCursor) break;
            cursor = nextCursor;

            if (i < MAX_BATCHES - 1) {
                await sleep(500); 
            }

        } catch (e) {
            console.error('Fetch error:', e);
            break;
        }
    }

    // 3. Get Reply
    const replies = await fetch(`https://${API_HOST}/user-replies?user=${profile.id}`, options);
    if (!replies.ok) throw new Error('Failed to fetch user');
    const replyRaw = await replies.json();
    if (!replyRaw) throw new Error('User replies not found');

    const cleanReplies = parseUserReplies(replyRaw);

    return { profile, tweets: allTweetsRaw, pinnedTweet: pinnedTweetRaw, reply: cleanReplies };
}


export async function fetchVipConnections(userName: string) {
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': API_HOST
        }
    };

    try {
        // 1. Lấy danh sách ID đang follow (Lấy 200 thằng thôi cho nhanh)
        // API: Get User Following IDs
        const idsRes = await fetch(`https://${API_HOST}/following-ids?username=${userName}&count=100`, options);
        if (!idsRes.ok) return [];

        const idsData = await idsRes.json();
        const allIds = idsData.ids || [];

        if (allIds.length === 0) return [];

        // 2. Chia nhỏ mảng ID (Max 100 ID/request theo limit an toàn)
        const chunks = [];
        for (let i = 0; i < allIds.length; i += 100) {
            chunks.push(allIds.slice(i, i + 100));
        }

        // 3. Gọi API song song để lấy thông tin chi tiết
        let detailedUsers: any[] = [];

        for (const chunk of chunks) {
            const idsStr = chunk.join(',');
            try {
                // Gọi API
                const res = await fetch(`https://${API_HOST}/get-users?users=${idsStr}`, options);
                const data = await res.json();

                // Gom dữ liệu
                // (Lưu ý: check kỹ cấu trúc JSON trả về của API này, thường là result.data.users)
                const users = data.result?.data?.users || []; // Hoặc data.users tùy endpoint

                users.forEach((u: any) => {
                    const r = u.result;
                    if (!r || !r.legacy) return;

                    detailedUsers.push({
                        handle: r.legacy.screen_name,
                        name: r.legacy.name,
                        avatar: r.legacy.profile_image_url_https,
                        description: r.legacy.description,
                        followers: r.legacy.followers_count,
                        isVerified: r.is_blue_verified === true || r.legacy.verified === true
                    });
                });

            } catch (e) {
                console.error(`Lỗi fetch chunk: ${e}`);
            }

            await sleep(500);
        }

        // 5. Lọc VIP & Sắp xếp
        // Tiêu chí VIP: Có tích xanh HOẶC trên 50k follow
        const vips = detailedUsers
            .filter(u => {
                // Rule 1: Phải là VIP (Tích xanh hoặc > 50k follow)
                const isRealVIP = (u.isVerified && u.followers > 10000) || (u.followers > 50000);
                
                // Rule 2: Loại bỏ bọn "Quốc dân" (Elon, Trump, MrBeast...)
                const isNotGlobal = !GLOBAL_IGNORE_LIST.has(u.handle.toLowerCase());
                
                // Rule 3 (Optional): Loại bỏ luôn bọn > 50 Triệu follow (thường là Celeb, ko phải Niche)
                const isNotMegaCeleb = u.followers < 20000000;

                return isRealVIP && isNotGlobal && isNotMegaCeleb;
            })
            .sort((a, b) => b.followers - a.followers)
            .slice(0, 9);

        return vips;

    } catch (e) {
        console.error("Error fetching VIPs:", e);
        return [];
    }
}
