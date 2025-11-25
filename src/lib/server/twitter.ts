// src/lib/server/twitter.ts
import { RAPIDAPI_KEY } from '$env/static/private';
import type { Tweet, TwitterProfile, RawTwitterData, TweetType } from '$lib/types';

const API_HOST = 'twitter241.p.rapidapi.com';

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
    const MAX_BATCHES = 2; // Lấy khoảng 40-50 bài

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
        } catch (e) {
            console.error('Fetch error:', e);
            break;
        }
    }

    return { profile, tweets: allTweetsRaw, pinnedTweet: pinnedTweetRaw };
}
