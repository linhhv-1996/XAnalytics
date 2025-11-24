import { RAPIDAPI_KEY } from '$env/static/private';

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

export interface Tweet {
    id: string;
    text: string;
    createdAt: string;
    views: number;
    likes: number;
    retweets: number;
    replies: number;
    bookmarks: number;
    isReply: boolean;
    hasMedia: boolean;
    url: string;
}

export interface TwitterData {
    profile: TwitterProfile;
    tweets: Tweet[];
    pinnedTweet: Tweet | null;
    recentTweetTexts: string[]; // Text thuần để gửi cho AI
    metrics: {
        percentVisuals: number;
        avgEngagementRate: number;
    };
}

// --- HELPERS ---

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

function cleanTweet(t: any): Tweet | null {
    if (!t) return null;
    
    // Xử lý dữ liệu lồng nhau của Twitter API
    const legacy = t.legacy || t.tweet?.legacy;
    const views = Number(t.views?.count || t.tweet?.views?.count || 0);
    const rest_id = t.rest_id || t.tweet?.rest_id || "";
    const screenName = t.core?.user_results?.result?.legacy?.screen_name || "user"; // Fallback nếu cần

    if (!legacy) return null;

    return {
        id: rest_id,
        text: legacy.full_text || "",
        createdAt: legacy.created_at,
        views: views,
        likes: legacy.favorite_count || 0,
        retweets: legacy.retweet_count || 0,
        replies: legacy.reply_count || 0,
        bookmarks: legacy.bookmark_count || 0,
        isReply: !!legacy.in_reply_to_status_id_str,
        hasMedia: !!legacy.entities?.media?.length,
        url: `https://x.com/${screenName}/status/${rest_id}`
    };
}

function calculateAvgEngagementRate(tweets: Tweet[]): number {
    if (!tweets || tweets.length === 0) return 0;
    
    let totalEngagements = 0;
    let totalViews = 0;

    for (const tweet of tweets) {
        totalEngagements += (tweet.likes + tweet.replies + tweet.retweets + tweet.bookmarks);
        totalViews += tweet.views;
    }

    if (totalViews === 0) return 0;
    const rate = (totalEngagements / totalViews) * 100; // Đổi ra % luôn
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

    if (!userRaw) {
        throw new Error('User not found or Profile is private');
    }

    const profile = cleanProfile(userRaw);

    // 2. Get User Tweets
    const tweetsUrl = `https://${API_HOST}/user-tweets?user=${profile.id}&count=30`;
    const tweetsResponse = await fetch(tweetsUrl, options);
    
    if (!tweetsResponse.ok) {
         // Có thể user tồn tại nhưng ko lấy được tweet (private/suspended), vẫn return profile
         console.warn(`Could not fetch tweets for ${cleanHandle}`);
         return {
            profile,
            tweets: [],
            pinnedTweet: null,
            recentTweetTexts: [],
            metrics: { percentVisuals: 0, avgEngagementRate: 0 }
         };
    }

    const tweetsData = await tweetsResponse.json();

    // 3. Parse Timeline Instructions (Logic phức tạp của Twitter)
    let pinnedTweetRaw = null;
    let regularTweetsRaw: any[] = [];

    const instructions = tweetsData.result?.timeline?.instructions || [];

    instructions.forEach((inst: any) => {
        if (inst.type === 'TimelinePinEntry') {
            pinnedTweetRaw = inst.entry?.content?.itemContent?.tweet_results?.result;
        } else if (inst.type === 'TimelineAddEntries') {
            regularTweetsRaw = inst.entries
                .filter((e: any) => e.content?.itemContent?.itemType === 'TimelineTweet')
                .map((e: any) => e.content.itemContent.tweet_results.result);
        }
    });

    // 4. Clean & Format Data
    const tweets = regularTweetsRaw.map(cleanTweet).filter((t): t is Tweet => t !== null);
    const pinnedTweet = cleanTweet(pinnedTweetRaw);

    const reguTweets =  tweets
        .filter(t => !t.text.startsWith("RT @"));

    // 5. Calculate Metrics
    const percentVisuals = tweets.length > 0 
        ? Math.round((tweets.filter(t => t.hasMedia).length / tweets.length) * 100) 
        : 0;
    
    const avgEngagementRate = calculateAvgEngagementRate(tweets);

    const recentTweetTexts = tweets
        .filter(t => !t.text.startsWith("RT @"))
        .slice(0, 30)
        .map(t => t.text);

    return {
        profile,
        tweets: reguTweets,
        pinnedTweet,
        recentTweetTexts,
        metrics: {
            percentVisuals,
            avgEngagementRate
        }
    };
}
