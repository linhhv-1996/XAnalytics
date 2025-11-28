// src/lib/server/twitter.ts
import { RAPIDAPI_KEY } from '$env/static/private';
import type { Tweet, TwitterProfile, RawTwitterData, TweetType, ReplyContext, ReplyTweet } from '$lib/types';

const API_HOST = 'twitter241.p.rapidapi.com';

const GLOBAL_IGNORE_LIST = new Set([
    'elonmusk', 'barackobama', 'justinbieber', 'katyperry', 'rihanna', 
    'cristiano', 'taylorswift13', 'realdonaldtrump', 'ladygaga', 'narendramodi',
    'nasa', 'mrbeast', 'youtube', 'cnn', 'espn', 'twitter', 'x', 'instagram',
    'potus', 'vp', 'nytimes', 'bbcbreaking', 'billgates'
]);


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_REPLY_BATCHES = 10;
const MAX_BATCHES = 1;

const fetchOptions = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': API_HOST
    }
};


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
function parseUserReplies(jsonResponse: any, currentUserId: string): ReplyTweet[] {
    const instructions = jsonResponse?.result?.timeline?.instructions || [];
    const addEntries = instructions.find((i: any) => i.type === 'TimelineAddEntries');

    if (!addEntries) return [];

    const replies: ReplyTweet[] = [];

    addEntries.entries.forEach((entry: any) => {
        // Chỉ xử lý Module hội thoại
        if (entry.content?.entryType === 'TimelineTimelineModule') {
            const items = entry.content.items;

            // Cần ít nhất 2 item: [Context, MyReply]
            if (items && items.length >= 2) {
                
                // 1. LẤY CONTEXT TWEET (Bài ngữ cảnh - Item đầu tiên trong cụm)
                const contextItem = items[0].item?.itemContent?.tweet_results?.result;
                if (!contextItem) return;

                const contextLegacy = contextItem.legacy;
                if (!contextLegacy) return;

                const contextAuthorId = contextItem.core?.user_results?.result?.rest_id || contextLegacy.user_id_str;
                const contextReplyToUserId = contextLegacy.in_reply_to_user_id_str;

                // --- BỘ LỌC QUAN TRỌNG (FILTER LOGIC) ---
                
                // Rule 1: Nếu Context là bài của chính mình -> BỎ (Self-thread, seeding)
                if (contextAuthorId === currentUserId) return;

                // Rule 2: [FIX MỚI] Nếu Context là bài của người khác, NHƯNG nó đang reply mình
                // -> Nghĩa là mình đang trả lời comment trong nhà mình (Inbound) -> BỎ
                if (contextReplyToUserId === currentUserId) return;


                // 2. TÌM BÀI REPLY CỦA MÌNH (Outbound)
                const myItem = items.find((it: any) => {
                    const res = it.item?.itemContent?.tweet_results?.result;
                    const authorId = res?.core?.user_results?.result?.rest_id || res?.legacy?.user_id_str;
                    
                    // Là bài của mình VÀ không phải là bài context (đề phòng trùng)
                    return authorId === currentUserId && res?.rest_id !== contextItem.rest_id;
                });

                if (!myItem) return;

                const replyRaw = myItem.item.itemContent.tweet_results.result;
                const replyLegacy = replyRaw?.legacy;
                
                if (replyLegacy) {
                    // Lấy User Info của người mình reply trực tiếp để hiển thị
                    const targetUser = contextItem.core?.user_results?.result?.legacy || {};
                    
                    // Lấy Outbound Links
                    const entities = replyLegacy.entities || {};
                    const urls = (entities.urls || []).map((u: any) => u.expanded_url);

                    const reply: ReplyTweet = {
                        id: replyRaw.rest_id,
                        text: replyLegacy.full_text || "",
                        createdAt: replyLegacy.created_at,
                        outboundLinks: urls,

                        likes: replyLegacy.favorite_count || 0,
                        replies: replyLegacy.reply_count || 0,
                        retweets: replyLegacy.retweet_count || 0,
                        views: Number(replyRaw.views?.count || 0),

                        replyTo: {
                            id: contextItem.rest_id,
                            text: contextLegacy.full_text || "",
                            createdAt: contextLegacy.created_at || "",
                            authorHandle: targetUser.screen_name || 'unknown',
                            authorAvatar: targetUser.profile_image_url_https || ''
                        }
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

    // 1. Get User Info
    const userRes = await fetch(`https://${API_HOST}/user?username=${cleanHandle}`, fetchOptions);
    if (!userRes.ok) throw new Error('Failed to fetch user');
    const userData = await userRes.json();
    const userRaw = userData.result?.data?.user?.result;
    if (!userRaw) throw new Error('User not found');

    const profile = cleanProfile(userRaw);

    // 2. Get Tweets
    let allTweetsRaw: Tweet[] = [];
    let pinnedTweetRaw: Tweet | null = null;
    let cursor: string | undefined;

    for (let i = 0; i < MAX_BATCHES; i++) {
        try {
            const cursorParam = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
            const res = await fetch(`https://${API_HOST}/user-tweets?user=${profile.id}&count=20${cursorParam}`, fetchOptions);
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

    // 3. Get Reply (Updated: Loop to get ~100 items & Sleep)
    let allReplies: ReplyTweet[] = [];
    let replyCursor: string | undefined;

    for (let i = 0; i < MAX_REPLY_BATCHES; i++) {
        try {
            const cursorParam = replyCursor ? `&cursor=${encodeURIComponent(replyCursor)}` : '';
            const res = await fetch(`https://${API_HOST}/user-replies?user=${profile.id}&count=20${cursorParam}`, fetchOptions);
            
            if (!res.ok) {
                console.warn(`[API] Failed to fetch replies batch ${i + 1}`);
                break;
            }

            const data = await res.json();
            
            // Parse ngay batch này
            const batchReplies = parseUserReplies(data, profile.id);
            allReplies = [...allReplies, ...batchReplies];

            // Tìm Next Cursor để lật trang
            const instructions = data.result?.timeline?.instructions || [];
            let nextCursor: string | undefined;

            // Logic tìm cursor trong TimelineAddEntries (giống logic lấy Tweets)
            const addEntries = instructions.find((inst: any) => inst.type === 'TimelineAddEntries');
            if (addEntries && addEntries.entries) {
                const c = addEntries.entries.find((e: any) => e.entryId.startsWith('cursor-bottom'));
                if (c) nextCursor = c.content?.value || c.content?.itemContent?.value;
            }

            // Nếu không có cursor mới hoặc trùng cũ -> Hết data
            if (!nextCursor || nextCursor === replyCursor) break;
            replyCursor = nextCursor;

            if (i < MAX_REPLY_BATCHES - 1) {
                await sleep(500); 
            }

        } catch (e) {
            console.error('[API] Error fetching replies loop:', e);
            break;
        }
    }

    return { profile, tweets: allTweetsRaw, pinnedTweet: pinnedTweetRaw, reply: allReplies };
}


export async function fetchVipConnections(userName: string) {
    try {
        // 1. Lấy danh sách ID đang follow (Lấy 200 thằng thôi cho nhanh)
        // API: Get User Following IDs
        const idsRes = await fetch(`https://${API_HOST}/following-ids?username=${userName}&count=200`, fetchOptions);
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
                const res = await fetch(`https://${API_HOST}/get-users?users=${idsStr}`, fetchOptions);
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


/**
 * Lấy danh sách ID mà user đang follow.
 * Cố gắng lấy 1000 ID (2 request x 500).
 */
async function getFollowingIds(handle: string, maxCount: number = 1000): Promise<Set<string>> {
    let ids = new Set<string>();
    let cursor: string | undefined;
    const batchSize = 500; // API limit mỗi lần gọi

    // Loop tối đa 2 lần để lấy 1000 IDs
    for (let i = 0; i < Math.ceil(maxCount / batchSize); i++) {
        try {
            const cursorParam = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
            const url = `https://${API_HOST}/following-ids?username=${handle}&count=${batchSize}${cursorParam}`;
            
            const res = await fetch(url, fetchOptions);
            if (!res.ok) break;

            const data = await res.json();
            const newIds = data.ids || [];
            
            if (newIds.length === 0) break;

            newIds.forEach((id: string) => ids.add(id));

            // Lấy cursor cho trang sau
            cursor = data.next_cursor_str;
            if (!cursor || cursor === "0") break;

            // Nghỉ một chút để đỡ bị rate limit
            if (i < 1) await sleep(500);

        } catch (e) {
            console.error(`[API] Error fetching following for ${handle}:`, e);
            break;
        }
    }

    return ids;
}


/**
 * Lấy thông tin chi tiết của một danh sách User ID (để hiển thị avatar/tên)
 */
async function getUsersDetails(ids: string[]) {
    if (ids.length === 0) return [];
    
    // Chỉ lấy thông tin 12 người chung đầu tiên để hiển thị cho đỡ tốn quota
    const topIds = ids.slice(0, 12); 
    const idsStr = topIds.join(',');
    
    try {
        const res = await fetch(`https://${API_HOST}/get-users?users=${idsStr}`, fetchOptions);
        const data = await res.json();
        
        // Cấu trúc response có thể khác nhau tùy endpoint, cần check kỹ
        const users = data.result?.data?.users || data.users || []; 

        return users.map((u: any) => {
            const r = u.result || u;
            const legacy = r.legacy;
            if (!legacy) return null;

            return {
                handle: legacy.screen_name,
                name: legacy.name,
                avatar: legacy.profile_image_url_https,
                followers: legacy.followers_count,
                isVerified: r.is_blue_verified === true || legacy.verified === true
            };
        }).filter((u: any) => u !== null);

    } catch (e) {
        console.error("[API] Error fetching user details:", e);
        return [];
    }
}


/**
 * Hàm phân tích mối quan hệ (Mutuals)
 */
export async function analyzeRelationship(handleA: string, handleB: string) {
    // 1. Chạy song song lấy ID của cả 2 (Mỗi người 1000 ID)
    const [setA, setB] = await Promise.all([
        getFollowingIds(handleA, 1000),
        getFollowingIds(handleB, 1000)
    ]);

    if (setA.size === 0 || setB.size === 0) {
        throw new Error("Could not fetch following list (Account might be private or API limited)");
    }

    // 2. Tìm ID trùng nhau (Intersection)
    const commonIds: string[] = [];
    setA.forEach(id => {
        if (setB.has(id)) {
            commonIds.push(id);
        }
    });

    // 3. Tính toán độ trùng lặp
    // Công thức: (Số lượng chung / Tập nhỏ nhất) * 100
    // Dùng tập nhỏ nhất để % trông cao hơn, tạo cảm giác "connected" hơn.
    const minSize = Math.min(setA.size, setB.size);
    const overlapPercent = minSize > 0 ? Math.round((commonIds.length / minSize) * 100) : 0;

    // 4. Lấy chi tiết user chung (để hiển thị Avatar)
    const commonVips = await getUsersDetails(commonIds);

    // Sort VIPs: Ưu tiên hiển thị người nhiều follow (nếu API trả về có followers)
    commonVips.sort((a: { followers: number; }, b: { followers: number; }) => b.followers - a.followers);

    return {
        overlapPercent,
        totalCommon: commonIds.length,
        commonVips,
        scannedCountA: setA.size,
        scannedCountB: setB.size
    };
}


