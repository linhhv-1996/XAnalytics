// src/lib/server/analytics.ts
import type { Tweet, AnalyticsData, TwitterProfile } from '$lib/types';

function calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

function formatNumber(num: number) {
    return new Intl.NumberFormat('en-US', { notation: "compact" }).format(num);
}

function calculateGrade(er: number) {
    if (er > 3) return "A+";
    if (er > 2) return "A";
    if (er > 1) return "B";
    return "C";
}

// [!code fix] Đổi type profileRaw từ any -> TwitterProfile
export function analyzeProfile(tweets: Tweet[], pinnedTweet: Tweet | null, profileRaw: TwitterProfile): AnalyticsData {
    // 1. Lọc Data
    const originalTweets = tweets.filter(t => t.type !== 'retweet');
    const totalViews = originalTweets.reduce((acc, t) => acc + t.views, 0);
    const totalCount = originalTweets.length || 1;

    // --- HEATMAP LOGIC ---
    // Sử dụng UTC để đồng bộ dữ liệu
    const heatmap: { date: string; fullDate: string; count: number; level: 0 | 1 | 2 | 3; }[] = [];
    const today = new Date();

    for (let i = 34; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const isoDate = d.toISOString().split('T')[0]; // YYYY-MM-DD
        const displayDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d); 

        heatmap.push({
            date: displayDate,
            fullDate: isoDate,
            count: 0,
            level: 0
        });
    }

    // Map để tra cứu heatmap nhanh hơn thay vì find() trong vòng lặp
    const heatmapMap = new Map(heatmap.map(h => [h.fullDate, h]));

    tweets.forEach(t => {
        const tDate = new Date(t.createdAt);
        const tIso = tDate.toISOString().split('T')[0];
        const day = heatmapMap.get(tIso);
        if (day) day.count += 1;
    });

    heatmap.forEach(day => {
        if (day.count === 0) day.level = 0;
        else if (day.count === 1) day.level = 1;
        else if (day.count <= 3) day.level = 2;
        else day.level = 3;
    });

    // --- METRICS CƠ BẢN ---
    const totalEngagements = originalTweets.reduce((acc, t) =>
        acc + (t.likes + t.replies + t.retweets + t.bookmarks), 0);

    const avgEngagementRate = totalViews > 0
        ? parseFloat(((totalEngagements / totalViews) * 100).toFixed(2))
        : 0;

    // Viral Rate
    const avgViews = totalViews / totalCount;
    const viralPosts = originalTweets.filter(t => t.views > avgViews * 2);
    const viralRate = parseFloat(((viralPosts.length / totalCount) * 100).toFixed(1));
    const viralScore = Math.min(viralRate * 5, 100);

    // --- STRATEGY ANALYSIS ---
    const threadCount = originalTweets.filter(t => t.type === 'thread').length;
    const visualCount = originalTweets.filter(t => t.hasMedia).length;

    const promoCount = originalTweets.filter(t =>
        (t.outboundLinks.length > 0) ||
        (t.threadChildren.length > 0 && t.threadChildren[0].outboundLinks.length > 0)
    ).length;

    // --- SORTING & TOP CONTENT ---
    const sortedByView = [...originalTweets].sort((a, b) => b.views - a.views);
    const sortedByReply = [...originalTweets].sort((a, b) => b.replies - a.replies);

    // [!code fix] Sửa logic Hidden Gem: Tránh chia cho 0 và hạ threshold view cho acc nhỏ
    const hiddenGemThreshold = Math.max(avgViews * 0.2, 50); // Tối thiểu 50 view hoặc 20% avg
    const hiddenGems = originalTweets
        .filter(t => t.views < avgViews && t.views > hiddenGemThreshold)
        .sort((a, b) => {
            const rateA = a.views > 0 ? (a.likes / a.views) : 0;
            const rateB = b.views > 0 ? (b.likes / b.views) : 0;
            return rateB - rateA;
        });

    // --- DEEP DIVE ANALYSIS (GỘP LOOP) ---
    const mentionMap: Record<string, number> = {};
    const tagMap: Record<string, number> = {};
    const domainMap: Record<string, number> = {};
    
    // Posting Habits Data
    const hoursData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        totalViews: 0,
        postCount: 0,
        avgViews: 0
    }));

    // [!code fix] Gộp 4 vòng lặp thành 1 để tối ưu
    originalTweets.forEach(t => {
        // A. Network
        t.mentions.forEach(handle => {
            if (handle.toLowerCase() !== profileRaw.handle.toLowerCase()) {
                mentionMap[handle] = (mentionMap[handle] || 0) + 1;
            }
        });

        // B. Hashtags
        t.hashtags.forEach(tag => {
            tagMap[tag] = (tagMap[tag] || 0) + 1;
        });

        // C. Traffic
        const allLinks = [...t.outboundLinks, ...(t.threadChildren?.flatMap(c => c.outboundLinks) || [])];
        allLinks.forEach(link => {
            try {
                const hostname = new URL(link).hostname.replace('www.', '');
                let cleanDomain = hostname;
                if (hostname.includes('youtube') || hostname.includes('youtu.be')) cleanDomain = 'YouTube';
                else if (hostname.includes('gumroad')) cleanDomain = 'Gumroad';
                else if (hostname.includes('beehiiv') || hostname.includes('substack')) cleanDomain = 'Newsletter';
                else if (hostname.includes('twitter') || hostname.includes('x.com')) return; 
                
                domainMap[cleanDomain] = (domainMap[cleanDomain] || 0) + 1;
            } catch (e) { }
        });

        // D. Posting Habits
        const date = new Date(t.createdAt);
        const hour = date.getUTCHours(); // Sử dụng UTC cho nhất quán
        hoursData[hour].totalViews += t.views;
        hoursData[hour].postCount += 1;
    });

    // Process Maps to Arrays
    const topMentions = Object.entries(mentionMap)
        .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([handle, count]) => ({ handle, count }));
    const topHashtags = Object.entries(tagMap)
        .sort((a, b) => b[1] - a[1]).slice(0, 8).map(([tag, count]) => ({ tag, count }));
    const topDomains = Object.entries(domainMap)
        .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([domain, count]) => ({ domain, count }));

    // Process Hours
    let maxAvgHourViews = 0;
    let bestHour = -1;

    hoursData.forEach(h => {
        if (h.postCount > 0) {
            h.avgViews = Math.round(h.totalViews / h.postCount);
            if (h.avgViews > maxAvgHourViews) {
                maxAvgHourViews = h.avgViews;
                bestHour = h.hour;
            }
        }
    });

    const hourlyPerf = hoursData.map(h => ({
        hour: h.hour,
        avgViews: h.avgViews,
        postCount: h.postCount,
        score: maxAvgHourViews > 0 ? Math.round((h.avgViews / maxAvgHourViews) * 100) : 0
    }));

    const bestHourStr = bestHour !== -1 ? `${bestHour}:00` : "N/A";
    const bestHourMetricStr = maxAvgHourViews > 0 ? `${formatNumber(maxAvgHourViews)} avg views` : "No data";

    // --- BASELINE PERFORMANCE (MEDIAN) ---
    const viewCounts = originalTweets.map(t => t.views);
    const likeCounts = originalTweets.map(t => t.likes);
    const engagementRates = originalTweets.map(t => {
        if (t.views === 0) return 0;
        return ((t.likes + t.replies + t.retweets + t.bookmarks) / t.views) * 100;
    });

    const medianViews = calculateMedian(viewCounts);
    const medianLikes = calculateMedian(likeCounts);
    const medianEngagement = calculateMedian(engagementRates);

    const maxViews = Math.max(...viewCounts, 1);
    const maxLikes = Math.max(...likeCounts, 1);
    const maxEngagement = Math.max(...engagementRates, 1);

    const viewsScore = Math.round((medianViews / maxViews) * 100);
    const likesScore = Math.round((medianLikes / maxLikes) * 100);
    const engagementScore = Math.round((medianEngagement / maxEngagement) * 100);

    // --- FUNNEL ---
    const totalLikes = originalTweets.reduce((acc, t) => acc + t.likes, 0);
    const totalReplies = originalTweets.reduce((acc, t) => acc + t.replies, 0);
    const totalBookmarks = originalTweets.reduce((acc, t) => acc + t.bookmarks, 0);

    // --- SIGNAL SNAPSHOT ---
    let signal = null;
    let title = "Signal Snapshot";
    let targetTweet: Tweet | null = null;
    let signalType = "Pin Tweet";

    if (pinnedTweet) {
        title = "Pin Tweet";
        targetTweet = pinnedTweet;
    } else if (sortedByView.length > 0) {
        targetTweet = sortedByView[0];
        signalType = "Top Signal";
    }

    if (targetTweet) {
        const baselineViews = medianViews || 1; 
        const multiplierRaw = targetTweet.views / baselineViews;

        if (multiplierRaw > 3) signalType = "Breakout Post";

        signal = {
            title: title,
            type: signalType,
            text: targetTweet.text,
            createdAt: new Date(targetTweet.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            }),
            likes: formatNumber(targetTweet.likes),
            replies: formatNumber(targetTweet.replies),
            views: formatNumber(targetTweet.views),
            multiplier: `${multiplierRaw.toFixed(1)}×`,
            url: targetTweet.url,
            hasMedia: targetTweet.hasMedia,
            mediaType: targetTweet.mediaType
        };
    }

    // --- TOP LIST ---
    const topList = sortedByView.slice(0, 3).map(t => ({
        text: t.text,
        views: formatNumber(t.views),
        likes: formatNumber(t.likes),
        replies: formatNumber(t.replies),
        date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        url: t.url
    }));

    // --- MONETIZATION ---
    const valueCount = totalCount - promoCount;
    const promoRatio = Math.round((promoCount / totalCount) * 100);
    const valueRatio = 100 - promoRatio;
    const freqNum = promoCount > 0 ? Math.round(totalCount / promoCount) : 0;
    const frequency = promoCount === 0 
        ? "Rarely sells" 
        : freqNum === 1 
            ? "Sells in every post" 
            : `Sells every ~${freqNum} posts`;

    // --- LENGTH STRATEGY ---
    const buckets = {
        short: { count: 0, totalViews: 0, avgViews: 0, score: 0 },
        medium: { count: 0, totalViews: 0, avgViews: 0, score: 0 },
        long: { count: 0, totalViews: 0, avgViews: 0, score: 0 }
    };

    originalTweets.forEach(t => {
        const len = t.text.length;
        let type: 'short' | 'medium' | 'long' = 'medium';
        
        let isRealThread = false;
        if (t.type === 'thread' && t.threadChildren && t.threadChildren.length > 0) {
            isRealThread = t.threadChildren.some(child => {
                const hasLink = child.outboundLinks && child.outboundLinks.length > 0;
                const isLongText = child.text.length > 100;
                return !hasLink || isLongText;
            });
        }

        if (isRealThread || len > 280) type = 'long';
        else if (len < 140) type = 'short';
        
        buckets[type].count++;
        buckets[type].totalViews += t.views;
    });

    const base = medianViews || 1;
    let bestType: 'Short' | 'Medium' | 'Long' | 'Mixed' = 'Mixed';
    let maxTypeVal = 0;

    (['short', 'medium', 'long'] as const).forEach(k => {
        if (buckets[k].count > 0) {
            buckets[k].avgViews = Math.round(buckets[k].totalViews / buckets[k].count);
        }
        buckets[k].score = parseFloat((buckets[k].avgViews / base).toFixed(1));
        
        if (buckets[k].avgViews > maxTypeVal) {
            maxTypeVal = buckets[k].avgViews;
            bestType = k.charAt(0).toUpperCase() + k.slice(1) as any;
        }
    });

    // Nếu tất cả đều 0 view thì giữ Mixed
    if (maxTypeVal === 0) bestType = 'Mixed';

    return {
        profile: {
            handle: `@${profileRaw.handle}`,
            name: profileRaw.name,
            bio: profileRaw.bio,
            avatarUrl: profileRaw.avatar,
            banner: profileRaw.banner || "", // Fix null
            followers: formatNumber(profileRaw.followers),
            following: formatNumber(profileRaw.following),
            tweetsCount: formatNumber(profileRaw.tweetsCount),
            engagement: `${avgEngagementRate}%`,
            viralRatio: `1:${Math.round(100 / (viralRate || 1))}`, // Fix divide by 0
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
            promoRatio: Math.round((promoCount / totalCount) * 100),
            monetization: {
                valueCount,
                promoCount,
                valueRatio,
                promoRatio,
                frequency
            },
            length: {
                short: buckets.short,
                medium: buckets.medium,
                long: buckets.long,
                bestType
            }
        },
        funnel: {
            viewToLike: totalViews > 0 ? parseFloat(((totalLikes / totalViews) * 100).toFixed(2)) : 0,
            viewToReply: totalViews > 0 ? parseFloat(((totalReplies / totalViews) * 100).toFixed(2)) : 0,
            viewToFan: totalViews > 0
                ? parseFloat((((totalReplies + totalBookmarks) / totalViews) * 100).toFixed(2))
                : 0
        },
        topContent: {
            mostViral: sortedByView[0] || null,
            mostDiscussion: sortedByReply[0] || null,
            hiddenGem: hiddenGems[0] || null,
            list: topList
        },
        network: { topMentions },
        topics: { topHashtags },
        traffic: { topDomains },
        habits: {
            bestHour: bestHourStr,
            bestHourMetric: bestHourMetricStr,
            postingSchedule: [],
            heatmap: heatmap,
            hourlyPerf: hourlyPerf
        },
        baseline: {
            views: medianViews,
            likes: medianLikes,
            engagement: parseFloat(medianEngagement.toFixed(2)),
            viralRate: viralRate,
            viewsScore: viewsScore || 5,
            likesScore: likesScore || 5,
            engagementScore: engagementScore || 5,
            viralScore: viralScore || 5
        },
        signal: signal,
    };
}


// [!code update] Hàm analyzeReplyStrategy đã lược bỏ BIG_ACCOUNTS
export function analyzeReplyStrategy(replies: any[], originalHandle: string) {
    // Guard clause
    if (!replies || replies.length === 0) {
        return {
            replyCount: 0,
            avgLength: 0,
            archetype: "N/A",
            metrics: { spamScore: 0, valueScore: 0 },
            topTargets: []
        };
    }

    let shortReplies = 0;      // < 30 ký tự
    let valueReplies = 0;      // > 50 ký tự
    let linkReplies = 0;       // Có link
    let totalLen = 0;
    
    // Map đếm tần suất reply
    const replyTargetMap: Record<string, { count: number; avatar: string; handle: string }> = {};

    replies.forEach(t => {
        const text = t.text || "";
        const len = text.length;
        totalLen += len;

        // 1. Phân loại chất lượng
        if (len < 30 && !t.hasMedia) shortReplies++;
        else if (len > 50) valueReplies++;

        if (t.outboundLinks && t.outboundLinks.length > 0) linkReplies++;

        // 2. Phân tích đối tượng (Vẫn dùng originalHandle để lọc self-reply)
        const target = t.replyTo; 
        if (target && target.authorHandle) {
            const handle = target.authorHandle;

            // Bỏ qua nếu tự reply chính mình
            if (handle.toLowerCase() !== originalHandle.toLowerCase()) {
                if (!replyTargetMap[handle]) {
                    replyTargetMap[handle] = { 
                        count: 0, 
                        avatar: target.authorAvatar || "", 
                        handle: handle 
                    };
                }
                replyTargetMap[handle].count++;
            }
        }
    });

    // Tổng hợp
    const count = replies.length;
    const avgLength = Math.round(totalLen / count);
    
    // Top 3 người hay tương tác
    const topTargets = Object.values(replyTargetMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    // Định danh tính cách (Archetype)
    let archetype = "Conversationalist"; // Mặc định
    
    const spamRatio = (shortReplies + linkReplies * 2) / count;
    const valueRatio = valueReplies / count;

    if (linkReplies > 3) archetype = "Link Spammer";
    else if (spamRatio > 0.6) archetype = "NPC / Bot"; // >60% là reply ngắn/nhạt
    else if (valueRatio > 0.5) archetype = "Value Builder"; // >50% reply có tâm

    return {
        replyCount: count,
        avgLength,
        archetype,
        metrics: {
            spamScore: Math.min(Math.round(spamRatio * 100), 100),
            valueScore: Math.min(Math.round(valueRatio * 100), 100),
        },
        topTargets 
    };
}

