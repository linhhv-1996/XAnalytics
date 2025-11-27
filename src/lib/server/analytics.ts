// src/lib/server/analytics.ts
import type { Tweet, AnalyticsData, TwitterProfile, ReplyTweet, AITopic } from '$lib/types';

const STOP_WORDS = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 
    'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 
    'just', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 
    'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 
    'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'been', 'has',
    'https', 'http', 'com', 'www', 'status' // Bỏ thêm mấy từ rác của link
]);

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


// [!code update] Hàm analyzeReplyStrategy đã lược bỏ BIG_ACCOUNTS
function analyzeReplyStrategy(replies: any[], originalHandle: string) {
    // Guard clause
    if (!replies || replies.length === 0) {
        return {
            replyCount: 0,
            avgLength: 0,
            archetype: "N/A",
            metrics: { spamScore: 0, valueScore: 0, neutralScore: 0 }, // [!code ++] Thêm neutralScore
            topTargets: []
        };
    }

    let shortReplies = 0;      // < 40 ký tự (Tăng ngưỡng lên chút)
    let valueReplies = 0;      // > 80 ký tự (Chuẩn cao hơn cho Value)
    let neutralReplies = 0;    // 40 - 80 ký tự
    let linkReplies = 0;       // Có link
    let totalLen = 0;
    
    const replyTargetMap: Record<string, { count: number; avatar: string; handle: string }> = {};

    replies.forEach(t => {
        const text = t.text || "";
        const len = text.length;
        totalLen += len;

        if (t.outboundLinks && t.outboundLinks.length > 0) linkReplies++;

        // [!code fix] Logic phân loại mới: Phủ kín 100% trường hợp
        if (len < 40) {
            shortReplies++;
        } else if (len >= 80) {
            valueReplies++;
        } else {
            neutralReplies++;
        }

        // Phân tích đối tượng (giữ nguyên)
        const target = t.replyTo; 
        if (target && target.authorHandle) {
            const handle = target.authorHandle;
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

    const count = replies.length;
    const avgLength = Math.round(totalLen / count);
    
    const topTargets = Object.values(replyTargetMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

    // Định danh tính cách
    let archetype = "Conversationalist"; 
    const linkRatio = linkReplies / count;
    const shortRatio = shortReplies / count;
    const valueRatio = valueReplies / count;

    if (linkRatio > 0.2) archetype = "Plugger / Spammer"; // > 20% reply có link
    else if (shortRatio > 0.6) archetype = "NPC / Bot";   // > 60% reply ngắn
    else if (valueRatio > 0.4) archetype = "Value Builder"; // > 40% reply dài
    else archetype = "Supporter"; // Chủ yếu là neutral

    return {
        replyCount: count,
        avgLength,
        archetype,
        metrics: {
            spamScore: Math.round((shortReplies / count) * 100),
            valueScore: Math.round((valueReplies / count) * 100),
            neutralScore: Math.round((neutralReplies / count) * 100)
        },
        topTargets 
    };
}



// [!code fix] Đổi type profileRaw từ any -> TwitterProfile
export function analyzeProfile(
    tweets: Tweet[], 
    pinnedTweet: Tweet | null, 
    replies: ReplyTweet[], 
    profileRaw: TwitterProfile
): AnalyticsData {
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

    /// --- REPLY ---
    const replyStrategy = analyzeReplyStrategy(replies, profileRaw.handle);

    // --- TOPIC CLOUD LOGIC (Hybrid) ---
    // --- KEYWORD EXTRACTION (MANUAL & ACCURATE) ---
    const tagMapCloud: Record<string, number> = {};
    const keywordMap: Record<string, number> = {};

    originalTweets.forEach(t => {
        // 1. Đếm Hashtag (Giữ nguyên)
        t.hashtags.forEach(tag => {
            tagMapCloud[tag] = (tagMapCloud[tag] || 0) + 1;
        });

        // 2. Đếm Keyword từ text
        if (t.text) {
            const cleanText = t.text
                .toLowerCase()
                .replace(/https?:\/\/\S+/g, '') // Bỏ link
                .replace(/@\w+/g, '')           // Bỏ mention
                .replace(/#\w+/g, '')           // Bỏ hashtag
                .replace(/[^\w\s]/g, '');       // Bỏ ký tự đặc biệt

            const words = cleanText.split(/\s+/);
            
            words.forEach(w => {
                // Chỉ lấy từ > 3 ký tự và không nằm trong stop words
                if (w.length > 3 && !STOP_WORDS.has(w) && isNaN(Number(w))) {
                    const capitalized = w.charAt(0).toUpperCase() + w.slice(1);
                    keywordMap[capitalized] = (keywordMap[capitalized] || 0) + 1;
                }
            });
        }
    });

    // 3. Merge & Sort
    const hashtagsArr = Object.entries(tagMapCloud)
        .map(([tag, count]) => ({ text: `#${tag}`, count, type: 'hashtag' as const }));

    const keywordsArr = Object.entries(keywordMap)
        .map(([text, count]) => ({ text, count, type: 'keyword' as const }));

    // Lấy Top 15 từ xuất hiện nhiều nhất
    const topicList = [...hashtagsArr, ...keywordsArr]
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);
        


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
        topics: { list: topicList },
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
        replyStrategy: replyStrategy,
    };
}



