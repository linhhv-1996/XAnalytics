// src/lib/server/analytics.ts
import type { Tweet, AnalyticsData } from '$lib/types';

function calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}


export function analyzeProfile(tweets: Tweet[], pinnedTweet: Tweet | null, profileRaw: any): AnalyticsData {
    // 1. Lọc Data
    const originalTweets = tweets.filter(t => t.type !== 'retweet');
    const totalViews = originalTweets.reduce((acc, t) => acc + t.views, 0);

    // Heat map
    const heatmap: { date: string; fullDate: string; count: number; level: 0 | 1 | 2 | 3; }[] = [];
    const today = new Date();

    for (let i = 34; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);

        const isoDate = d.toISOString().split('T')[0]; // YYYY-MM-DD
        const displayDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d); // "Nov 25"

        heatmap.push({
            date: displayDate,
            fullDate: isoDate,
            count: 0,
            level: 0 as 0 | 1 | 2 | 3
        });
    }

    tweets.forEach(t => {
        const tDate = new Date(t.createdAt);
        // Chuyển về YYYY-MM-DD để so sánh string cho chuẩn
        const tIso = tDate.toISOString().split('T')[0];

        const day = heatmap.find(h => h.fullDate === tIso);
        if (day) {
            day.count += 1;
        }
    });

    heatmap.forEach(day => {
        if (day.count === 0) day.level = 0;
        else if (day.count === 1) day.level = 1;
        else if (day.count <= 3) day.level = 2;
        else day.level = 3;
    });

    // Heatmap

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
    const viralScore = Math.min(viralRate * 5, 100);

    // 3. Phân tích Chiến lược (Content Strategy)
    const threadCount = originalTweets.filter(t => t.type === 'thread').length;
    const visualCount = originalTweets.filter(t => t.hasMedia).length;

    // Logic check Promo: Có link trong bài gốc HOẶC link trong bài reply đầu tiên
    const promoCount = originalTweets.filter(t =>
        (t.outboundLinks.length > 0) ||
        (t.threadChildren.length > 0 && t.threadChildren[0].outboundLinks.length > 0)
    ).length;

    const totalCount = originalTweets.length || 1;


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
    originalTweets.forEach(t => {
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
            } catch (e) { }
        });
    });
    const topDomains = Object.entries(domainMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([domain, count]) => ({ domain, count }));

    // D. Posting Habits (Giờ đăng bài)
    const hoursData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        totalViews: 0,
        postCount: 0,
        avgViews: 0
    }));

    // 2. Aggregate dữ liệu
    originalTweets.forEach(t => {
        const date = new Date(t.createdAt);
        const hour = date.getUTCHours();

        hoursData[hour].totalViews += t.views;
        hoursData[hour].postCount += 1;
    });

    // 3. Tính trung bình và tìm Max
    let maxAvg = 0;
    let bestHour = -1;

    hoursData.forEach(h => {
        if (h.postCount > 0) {
            h.avgViews = Math.round(h.totalViews / h.postCount);
            if (h.avgViews > maxAvg) {
                maxAvg = h.avgViews;
                bestHour = h.hour;
            }
        }
    });

    // 4. Chuẩn hóa score (0-100) để vẽ biểu đồ
    const hourlyPerf = hoursData.map(h => ({
        hour: h.hour,
        avgViews: h.avgViews,
        postCount: h.postCount,
        // Nếu maxAvg = 0 thì score = 0, ngược lại tính % chiều cao
        score: maxAvg > 0 ? Math.round((h.avgViews / maxAvg) * 100) : 0
    }));

    // Format text hiển thị
    const bestHourStr = bestHour !== -1
        ? `${bestHour}:00`
        : "N/A";

    const bestHourMetricStr = maxAvg > 0
        ? `${formatNumber(maxAvg)} avg views`
        : "No data";


    // Base line 
    //--- LOGIC MỚI: BASELINE PERFORMANCE (MEDIAN) ---

    // 1. Tập hợp dữ liệu
    const viewCounts = originalTweets.map(t => t.views);
    const likeCounts = originalTweets.map(t => t.likes);
    const engagementRates = originalTweets.map(t => {
        if (t.views === 0) return 0;
        return ((t.likes + t.replies + t.retweets + t.bookmarks) / t.views) * 100;
    });

    // 2. Tính Median (Baseline)
    const medianViews = calculateMedian(viewCounts);
    const medianLikes = calculateMedian(likeCounts);
    const medianEngagement = calculateMedian(engagementRates);

    // 3. Tìm Max (Peak) để tính Score cho thanh Bar
    const maxViews = Math.max(...viewCounts, 1); // Tránh chia cho 0
    const maxLikes = Math.max(...likeCounts, 1);
    const maxEngagement = Math.max(...engagementRates, 1);

    // 4. Tính Score (Độ dài thanh bar = Median / Max)
    // Score càng cao chứng tỏ phong độ càng ổn định (gần với đỉnh)
    const viewsScore = Math.round((medianViews / maxViews) * 100);
    const likesScore = Math.round((medianLikes / maxLikes) * 100);
    const engagementScore = Math.round((medianEngagement / maxEngagement) * 100);


    // 5. Funnel (Dựa trên Original Tweets)
    const totalLikes = originalTweets.reduce((acc, t) => acc + t.likes, 0);
    const totalReplies = originalTweets.reduce((acc, t) => acc + t.replies, 0);
    const totalBookmarks = originalTweets.reduce((acc, t) => acc + t.bookmarks, 0);


    // --- LOGIC MỚI: SIGNAL SNAPSHOT (Có Fallback) ---
    let signal = null;
    let title = "Signal Snapshot";

    // 1. Xác định bài viết mục tiêu (Target Tweet)
    let targetTweet: Tweet | null = null;
    let signalType = "Pin Tweet";

    if (pinnedTweet) {
        title = "Pin Tweet";
        // Trường hợp 1: Có Pinned Tweet -> Dùng luôn
        targetTweet = pinnedTweet;
    } else if (sortedByView.length > 0) {
        // Trường hợp 2: Không có Pinned -> Fallback lấy bài View cao nhất (Top Signal)
        targetTweet = sortedByView[0];
        signalType = "Top Signal"; // Đổi tên label để user biết đây không phải bài ghim
    }

    // 2. Tính toán chỉ số Signal
    if (targetTweet) {
        const baselineViews = medianViews || 1; // Tránh chia cho 0
        const multiplierRaw = targetTweet.views / baselineViews;

        // Trường hợp 3: Override Label nếu bài viết quá Viral (gấp 3 lần baseline)
        // Bất kể là Pinned hay Top Signal, nếu viral khủng thì gọi là Breakout
        if (multiplierRaw > 3) {
            signalType = "Breakout Post";
        }

        signal = {
            title: title,
            type: signalType,
            text: targetTweet.text,
            // Format ngày tháng: "Dec 07, 2023"
            createdAt: new Date(targetTweet.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            }),
            likes: formatNumber(targetTweet.likes),
            replies: formatNumber(targetTweet.replies),
            views: formatNumber(targetTweet.views),
            // Hiển thị multiplier: "4.2x"
            multiplier: `${multiplierRaw.toFixed(1)}×`,
            url: targetTweet.url,
            hasMedia: targetTweet.hasMedia,
            mediaType: targetTweet.mediaType
        };
    }


    /// [!code ++] Map dữ liệu cho Top List
    const topList = sortedByView.slice(0, 3).map(t => ({
        text: t.text,
        views: formatNumber(t.views),
        likes: formatNumber(t.likes),
        replies: formatNumber(t.replies),
        date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        url: t.url
    }));


    // --- LOGIC MỚI: MONETIZATION MIX ---

    const valueCount = totalCount - promoCount;
    
    const promoRatio = Math.round((promoCount / totalCount) * 100);
    const valueRatio = 100 - promoRatio;
    
    // Tần suất bán: Tổng bài / Số bài bán
    const freqNum = promoCount > 0 ? Math.round(totalCount / promoCount) : 0;
    const frequency = promoCount === 0 
        ? "Rarely sells" 
        : freqNum === 1 
            ? "Sells in every post" 
            : `Sells every ~${freqNum} posts`;


    // --- LOGIC MỚI: LENGTH STRATEGY ---
    const buckets = {
        short: { count: 0, totalViews: 0, avgViews: 0, score: 0 },
        medium: { count: 0, totalViews: 0, avgViews: 0, score: 0 },
        long: { count: 0, totalViews: 0, avgViews: 0, score: 0 }
    };

    originalTweets.forEach(t => {
        const len = t.text.length;
        let type: 'short' | 'medium' | 'long' = 'medium';
        
        // [!code change] Logic kiểm tra Thread "xịn" (Content Thread)
        let isRealThread = false;
        
        if (t.type === 'thread' && t.threadChildren && t.threadChildren.length > 0) {
            // Kiểm tra xem có ít nhất 1 child là "Content" không
            isRealThread = t.threadChildren.some(child => {
                const hasLink = child.outboundLinks && child.outboundLinks.length > 0;
                const isLongText = child.text.length > 100;
                
                // Là Content nếu: (Không có link) HOẶC (Có link nhưng viết dài)
                return !hasLink || isLongText;
            });
        }

        // Phân loại
        if (isRealThread || len > 280) {
            type = 'long';
        } else if (len < 140) {
            type = 'short'; // < 140 ký tự
        }
        // Còn lại là medium (140 - 280 và không phải thread xịn)
        
        buckets[type].count++;
        buckets[type].totalViews += t.views;
    });

    // Tính trung bình view cho từng loại
    (['short', 'medium', 'long'] as const).forEach(k => {
        if (buckets[k].count > 0) {
            buckets[k].avgViews = Math.round(buckets[k].totalViews / buckets[k].count);
        }
    });

    // Tìm loại tốt nhất & Tính Score (So sánh với Baseline Views để ra multiplier)
    // Dùng medianViews (đã tính ở bước Baseline) làm mốc chuẩn (= 1.0x)
    // Giả sử medianViews đã có: const medianViews = calculateMedian(viewCounts);

    const base = medianViews || 1;

    let bestType: 'Short' | 'Medium' | 'Long' | 'Mixed' = 'Mixed';
    let maxVal = 0;

    (['short', 'medium', 'long'] as const).forEach(k => {
        // Score = Multiplier (Ví dụ: 1.5x)
        buckets[k].score = parseFloat((buckets[k].avgViews / base).toFixed(1));
        if (buckets[k].avgViews > maxVal) {
            maxVal = buckets[k].avgViews;
            bestType = k.charAt(0).toUpperCase() + k.slice(1) as any;
        }
    });

    // 6. Trả về format đúng chuẩn AnalyticsData
    return {
        profile: {
            handle: `@${profileRaw.handle}`,
            name: profileRaw.name,
            bio: profileRaw.bio,
            avatarUrl: profileRaw.avatar,
            banner: profileRaw.banner,
            followers: formatNumber(profileRaw.followers),
            following: formatNumber(profileRaw.following),
            tweetsCount: formatNumber(profileRaw.tweetsCount),
            engagement: `${avgEngagementRate}%`,
            viralRatio: `1:${Math.round(100 / viralRate) || 0}`,
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
            // Data mới
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
