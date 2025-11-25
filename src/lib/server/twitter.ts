import { RAPIDAPI_KEY } from '$env/static/private';
import { logData } from './debug';

const API_HOST = 'twitter241.p.rapidapi.com';

// --- TYPES ---
export interface TwitterProfile {
    name: string;
    handle: string;
    bio: string;
    avatar: string;
    banner: string | null;
    followers: number;
    following: number;
    tweetsCount: number;
    isVerified: boolean;
    website: string;
    joined: string;
    location: string;
    id: string;
}

export type TweetType = 'single' | 'thread' | 'retweet' | 'reply';

export interface Tweet {
    id: string;
    type: TweetType; // Phân loại sơ bộ
    text: string;
    createdAt: string;
    
    // Metrics
    views: number;
    likes: number;
    retweets: number;
    replies: number;
    bookmarks: number;
    
    // Media & Structure
    isReply: boolean;
    hasMedia: boolean;
    mediaType: 'image' | 'video' | 'mixed' | 'none'; // Thêm để phân tích sâu hơn
    
    // Content Analysis Data (Quan trọng cho tool phân tích)
    url: string;
    outboundLinks: string[]; // Link dẫn ra ngoài (quan trọng để check link-in-comment)
    hashtags: string[];
    mentions: string[];
    
    // Thread logic
    threadChildren: Tweet[]; // Chứa các reply của chính chủ (nếu có)
}

export interface TwitterData {
    profile: TwitterProfile;
    tweets: Tweet[];
    pinnedTweet: Tweet | null;
    recentTweetTexts: string[];
    metrics: {
        percentVisuals: number;
        avgEngagementRate: number;
        threadRatio: number; // Tỷ lệ bài viết dạng chuỗi
    };
}

// --- HELPERS ---

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function cleanProfile(raw: any): TwitterProfile {
    return {
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
        location: raw.location?.location || "",
        id: raw.rest_id || ""
    };
}

/**
 * Hàm làm sạch dữ liệu Tweet, trích xuất kỹ các entities
 */
function cleanTweet(t: any, isChild: boolean = false): Tweet | null {
    if (!t) return null;
    
    // 1. Kiểm tra xem có phải Retweet không (Bài RT thường nằm trong result.tweet)
    const isRetweet = !!t.legacy?.retweeted_status_result;
    
    // Nếu là RT, data thật nằm ở level ngoài, nhưng content gốc nằm trong retweeted_status_result
    // Tool phân tích thường quan tâm metrics của bài gốc
    const legacy = t.legacy || t.tweet?.legacy;
    
    if (!legacy) return null;

    const rest_id = t.rest_id || t.tweet?.rest_id || "";
    const core = t.core || t.tweet?.core;
    const screenName = core?.user_results?.result?.legacy?.screen_name || "user";
    const views = Number(t.views?.count || t.tweet?.views?.count || 0);

    // Xử lý Entities (Lấy link, tag, mention)
    const entities = legacy.entities || {};
    const urls = (entities.urls || []).map((u: any) => u.expanded_url);
    const hashtags = (entities.hashtags || []).map((h: any) => h.text);
    const userMentions = (entities.user_mentions || []).map((m: any) => m.screen_name);
    
    // Check media type
    const media = entities.media || [];
    let mediaType: Tweet['mediaType'] = 'none';
    if (media.length > 0) {
        const hasVideo = media.some((m: any) => m.type === 'video' || m.type === 'animated_gif');
        const hasImage = media.some((m: any) => m.type === 'photo');
        if (hasVideo && hasImage) mediaType = 'mixed';
        else if (hasVideo) mediaType = 'video';
        else mediaType = 'image';
    }

    // Determine Type (Sơ bộ)
    let type: TweetType = 'single';
    if (isRetweet) type = 'retweet';
    else if (isChild) type = 'reply';
    // Type 'thread' sẽ được set ở logic gom nhóm bên ngoài

    return {
        id: rest_id,
        type: type,
        text: legacy.full_text || "",
        createdAt: legacy.created_at,
        
        views: views,
        likes: legacy.favorite_count || 0,
        retweets: legacy.retweet_count || 0,
        replies: legacy.reply_count || 0,
        bookmarks: legacy.bookmark_count || 0,
        
        isReply: !!legacy.in_reply_to_status_id_str,
        hasMedia: media.length > 0,
        mediaType: mediaType,
        
        url: `https://x.com/${screenName}/status/${rest_id}`,
        outboundLinks: urls,
        hashtags: hashtags,
        mentions: userMentions,
        
        threadChildren: [] // Mặc định rỗng, sẽ được fill nếu là bài gốc của thread
    };
}

function calculateAvgEngagementRate(tweets: Tweet[]): number {
    if (!tweets || tweets.length === 0) return 0;
    
    // Chỉ tính bài gốc (Single hoặc Thread Root), bỏ qua RT
    const targetTweets = tweets.filter(t => t.type !== 'retweet');
    if (targetTweets.length === 0) return 0;

    let totalEngagements = 0;
    let totalViews = 0;

    for (const tweet of targetTweets) {
        totalEngagements += (tweet.likes + tweet.replies + tweet.retweets + tweet.bookmarks);
        totalViews += tweet.views;
    }

    if (totalViews === 0) return 0;
    const rate = (totalEngagements / totalViews) * 100;
    return parseFloat(rate.toFixed(2));
}

// --- MAIN FUNCTION ---

export async function fetchTwitterData(handle: string): Promise<TwitterData> {
    const cleanHandle = handle.toLowerCase().trim();
    
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': API_HOST
        }
    };

    // 1. Get User Info
    const userUrl = `https://${API_HOST}/user?username=${cleanHandle}`;
    const userResponse = await fetch(userUrl, options);
    
    if (!userResponse.ok) {
        throw new Error(`RapidAPI Error: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const userRaw = userData.result?.data?.user?.result;

    if (!userRaw) throw new Error('User not found or Profile is private');

    const profile = cleanProfile(userRaw);

    // 2. Get User Tweets
    let allTweetsRaw: any[] = [];
    let pinnedTweetRaw = null;
    let cursor: string | undefined = undefined;
    const MAX_BATCHES = 1; // Tăng lên 2 batch để lấy khoảng 40 tweet phân tích cho sướng

    console.log(`Fetching tweets for ${cleanHandle}...`);

    for (let i = 0; i < MAX_BATCHES; i++) {
        try {
            const cursorParam = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
            const tweetsUrl = `https://${API_HOST}/user-tweets?user=${profile.id}&count=20${cursorParam}`;
            
            const res = await fetch(tweetsUrl, options);
            if (!res.ok) break;

            const data = await res.json();
            const instructions = data.result?.timeline?.instructions || [];
            
            let batchTweets: any[] = []; // Chứa Tweet đã clean
            let nextCursor: string | undefined = undefined;

            instructions.forEach((inst: any) => {
                if (inst.type === 'TimelinePinEntry') {
                    if (i === 0) pinnedTweetRaw = inst.entry?.content?.itemContent?.tweet_results?.result;
                } else if (inst.type === 'TimelineAddEntries') {

                    // A. Xử lý Tweet đơn (tweet-)
                    inst.entries.filter((e: any) => e.entryId.startsWith('tweet-')).forEach((e: any) => {
                        const raw = e?.content?.itemContent?.tweet_results?.result;
                        const cleaned = cleanTweet(raw);
                        if (cleaned) batchTweets.push(cleaned);
                    });
                    
                    // B. Xử lý Thread / Conversation Module (profile-conversation-)
                    // Logic: Lấy bài đầu làm Root, bài sau làm Children (nếu cùng user)
                    inst.entries.filter((e: any) => e.entryId.startsWith('profile-conversation-')).forEach((e: any) => {
                        const items = e.content?.items || [];
                        if (items.length === 0) return;

                        // Item đầu tiên là Root Tweet
                        const rootRaw = items[0]?.item?.itemContent?.tweet_results?.result;
                        const rootCleaned = cleanTweet(rootRaw);

                        if (rootCleaned) {
                            // Các item sau là replies (có thể là của user hoặc người khác)
                            // Ta chỉ lấy self-replies để xác định thread/link trick
                            const childrenRaw = items.slice(1);
                            const childrenCleaned = childrenRaw.map((it: any) => {
                                const rawChild = it.item?.itemContent?.tweet_results?.result;
                                return cleanTweet(rawChild, true); // true = isChild
                            }).filter((t: Tweet | null) => t !== null && t.id !== rootCleaned.id); // Loại bỏ null và trùng
                            
                            // Gắn vào root
                            rootCleaned.threadChildren = childrenCleaned;
                            
                            // Cập nhật Type dựa trên cấu trúc con
                            if (childrenCleaned.length > 0) {
                                rootCleaned.type = 'thread'; // Tạm gọi là thread, phân tích link tính sau
                            }

                            batchTweets.push(rootCleaned);
                        }
                    });

                    // Tìm Cursor
                    const cursorEntry = inst.entries.find((e: any) => e.entryId.startsWith('cursor-bottom'));
                    if (cursorEntry) nextCursor = cursorEntry.content?.value || cursorEntry.content?.itemContent?.value;
                }
            });

            if (batchTweets.length === 0) break;
            
            // Loại bỏ các tweet trùng lặp (đề phòng API trả về trùng)
            batchTweets.forEach(t => {
                if (!allTweetsRaw.some(existing => existing.id === t.id)) {
                    allTweetsRaw.push(t);
                }
            });

            cursor = nextCursor;
            if (!cursor) break;
            if (i < MAX_BATCHES - 1) await sleep(1000); 

        } catch (e) {
            console.error(`Error fetching batch ${i + 1}:`, e);
            break;
        }
    }

    // 4. Final Processing
    const pinnedTweet = cleanTweet(pinnedTweetRaw);
    if (pinnedTweet) pinnedTweet.type = 'single'; // Reset type cho pinned

    // Lọc bỏ các bài Retweet rác nếu cần, hoặc giữ lại để tính metrics
    // Ở đây ta giữ lại nhưng đánh dấu rõ ràng
    const validTweets = allTweetsRaw;

    logData('tweets-final.json', validTweets);

    // 5. Calculate Metrics
    const percentVisuals = validTweets.length > 0 
        ? Math.round((validTweets.filter(t => t.hasMedia).length / validTweets.length) * 100) 
        : 0;
    
    const threadCount = validTweets.filter(t => t.type === 'thread').length;
    const threadRatio = validTweets.length > 0 
        ? Math.round((threadCount / validTweets.length) * 100) 
        : 0;

    const avgEngagementRate = calculateAvgEngagementRate(validTweets);

    const recentTweetTexts = validTweets
        .slice(0, 30)
        .map(t => {
            // Format text gửi cho AI: [Type] Content (Children info)
            let suffix = "";
            if (t.type === 'thread') {
                const childLinks = t.threadChildren.flatMap((c: { outboundLinks: any; }) => c.outboundLinks).join(", ");
                suffix = `\n[Reply/Link Info: ${t.threadChildren.length} replies, Links: ${childLinks}]`;
            }
            return `[${t.type.toUpperCase()}] ${t.text}${suffix}`;
        });

    return {
        profile,
        tweets: validTweets,
        pinnedTweet,
        recentTweetTexts,
        metrics: {
            percentVisuals,
            avgEngagementRate,
            threadRatio
        }
    };
}

