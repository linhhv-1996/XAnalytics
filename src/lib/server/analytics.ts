// src/lib/server/analytics.ts
import type { Tweet, AnalyticsData } from '$lib/types';

export function analyzeProfile(tweets: Tweet[], profileRaw: any): AnalyticsData {
    // 1. Lọc Data
    const originalTweets = tweets.filter(t => t.type !== 'retweet');
    const totalViews = originalTweets.reduce((acc, t) => acc + t.views, 0);
    
    // 2. Tính toán Metrics cơ bản
    const totalEngagements = originalTweets.reduce((acc, t) => 
        acc + (t.likes + t.replies + t.retweets + t.bookmarks), 0);
    
    const avgEngagementRate = totalViews > 0 
        ? parseFloat(((totalEngagements / totalViews) * 100).toFixed(2)) 
        : 0;

    // Viral Rate: Bài viết có view > 2 lần trung bình
    const avgViews = totalViews / (originalTweets.length || 1);
    const viralPosts = originalTweets.filter(t => t.views > avgViews * 2);
    const viralRate = parseFloat(((viralPosts.length / (originalTweets.length || 1)) * 100).toFixed(1));

    // 3. Phân tích Chiến lược (Content Strategy)
    const threadCount = originalTweets.filter(t => t.type === 'thread').length;
    const visualCount = originalTweets.filter(t => t.hasMedia).length;
    
    // Logic check Promo: Có link trong bài gốc HOẶC link trong bài reply đầu tiên
    const promoCount = originalTweets.filter(t => 
        (t.outboundLinks.length > 0) || 
        (t.threadChildren.length > 0 && t.threadChildren[0].outboundLinks.length > 0)
    ).length;

    const totalCount = originalTweets.length || 1;

    // 4. Phân tích Phễu (Funnel)
    const totalLikes = originalTweets.reduce((acc, t) => acc + t.likes, 0);
    const totalReplies = originalTweets.reduce((acc, t) => acc + t.replies, 0);

    // 5. Tìm Top Content (High Impact)
    const sortedByView = [...originalTweets].sort((a, b) => b.views - a.views);
    const sortedByReply = [...originalTweets].sort((a, b) => b.replies - a.replies);
    
    // Hidden Gem: View thấp (< Avg) nhưng Like/View cao
    const hiddenGems = originalTweets.filter(t => t.views < avgViews && t.views > 500).sort((a, b) => {
        return (b.likes / b.views) - (a.likes / a.views);
    });


    // --- LOGIC MỚI: DEEP DIVE ANALYSIS ---

    // A. Network Analysis (Hay tag ai?)
    const mentionMap: Record<string, number> = {};
    tweets.forEach(t => {
        t.mentions.forEach(handle => {
            // Bỏ qua tag chính mình
            if (handle.toLowerCase() !== profileRaw.handle.toLowerCase()) {
                mentionMap[handle] = (mentionMap[handle] || 0) + 1;
            }
        });
    });
    const topMentions = Object.entries(mentionMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([handle, count]) => ({ handle, count }));

    // B. Hashtag Analysis (Chủ đề gì?)
    const tagMap: Record<string, number> = {};
    originalTweets.forEach(t => {
        t.hashtags.forEach(tag => {
            tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
    });
    const topHashtags = Object.entries(tagMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag, count]) => ({ tag, count }));

    // C. Traffic Source (Link đi đâu?)
    const domainMap: Record<string, number> = {};
    originalTweets.forEach(t => {
        const allLinks = [...t.outboundLinks, ...(t.threadChildren?.flatMap(c => c.outboundLinks) || [])];
        allLinks.forEach(link => {
            try {
                const hostname = new URL(link).hostname.replace('www.', '');
                // Gom nhóm các domain phổ biến
                let cleanDomain = hostname;
                if (hostname.includes('youtube') || hostname.includes('youtu.be')) cleanDomain = 'YouTube';
                else if (hostname.includes('gumroad')) cleanDomain = 'Gumroad';
                else if (hostname.includes('beehiiv') || hostname.includes('substack')) cleanDomain = 'Newsletter';
                else if (hostname.includes('twitter') || hostname.includes('x.com')) return; // Bỏ link nội bộ
                
                domainMap[cleanDomain] = (domainMap[cleanDomain] || 0) + 1;
            } catch (e) {}
        });
    });
    const topDomains = Object.entries(domainMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([domain, count]) => ({ domain, count }));

    // D. Posting Habits (Giờ đăng bài)
    const hourCounts = new Array(24).fill(0);
    tweets.forEach(t => {
        const date = new Date(t.createdAt);
        const hour = date.getHours(); // Giờ theo máy chủ/UTC -> Cần convert sang user local ở frontend nếu muốn chuẩn
        hourCounts[hour]++;
    });
    const bestHourIndex = hourCounts.indexOf(Math.max(...hourCounts));
    const bestHourStr = `${bestHourIndex}:00 ${bestHourIndex >= 12 ? 'PM' : 'AM'}`;



    // 6. Trả về format đúng chuẩn AnalyticsData
    return {
        profile: {
            handle: `@${profileRaw.handle}`,
            name: profileRaw.name,
            avatarUrl: profileRaw.avatar,
            followers: formatNumber(profileRaw.followers),
            engagement: `${avgEngagementRate}%`,
            viralRatio: `1:${Math.round(100/viralRate) || 0}`,
            grade: calculateGrade(avgEngagementRate)
        },
        overview: {
            totalEngagement: totalEngagements,
            avgEngagementRate,
            viralRate
        },
        contentStrategy: {
            threadRatio: Math.round((threadCount / totalCount) * 100),
            visualRatio: Math.round((visualCount / totalCount) * 100),
            promoRatio: Math.round((promoCount / totalCount) * 100)
        },
        funnel: {
            viewToLike: totalViews > 0 ? parseFloat(((totalLikes / totalViews) * 100).toFixed(2)) : 0,
            viewToReply: totalViews > 0 ? parseFloat(((totalReplies / totalViews) * 100).toFixed(2)) : 0
        },
        topContent: {
            mostViral: sortedByView[0] || null,
            mostDiscussion: sortedByReply[0] || null,
            hiddenGem: hiddenGems[0] || null
        },

        network: { topMentions },
        topics: { topHashtags },
        traffic: { topDomains },
        habits: { 
            bestHour: bestHourStr,
            postingSchedule: hourCounts 
        }
    };
}

// Utils nhỏ
function formatNumber(num: number) {
    return new Intl.NumberFormat('en-US', { notation: "compact" }).format(num);
}

function calculateGrade(er: number) {
    if (er > 3) return "A+";
    if (er > 2) return "A";
    if (er > 1) return "B";
    return "C";
}
