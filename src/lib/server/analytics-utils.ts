// src/lib/server/analytics-utils.ts
import type { AnalyzedTopic, BestTimeResult, ConsistencyMetrics, ContentMix, OutlierPost, TopicStat } from '$lib/types';
import type { Tweet } from './twitter';

// 1. Tính Engagement Rate trung bình
// Công thức: (Likes + Reposts + Replies) / Views
export function calculateEngagement(tweets: Tweet[]): number {
    if (!tweets.length) return 0;
    
    let totalEngagements = 0;
    let totalViews = 0;

    for (const t of tweets) {
        if (t.views > 0) {
            totalEngagements += (t.likes + t.retweets + t.replies + t.bookmarks);
            totalViews += t.views;
        }
    }

    if (totalViews === 0) return 0;
    return (totalEngagements / totalViews) * 100; // Ra %
}

// 2. Tính Viral Ratio (Tần suất ra bài hit)
// Bài hit = Engagement cao gấp 2 lần trung bình (baseline)
export function calculateViralRatio(tweets: Tweet[], avgEngagement: number): number {
    if (!tweets.length) return 0;

    const baseline = avgEngagement || 1;
    let viralCount = 0;

    for (const t of tweets) {
        if (t.views > 0) {
            const postEngagement = ((t.likes + t.retweets + t.replies) / t.views) * 100;
            if (postEngagement > (baseline * 2)) {
                viralCount++;
            }
        }
    }

    // Nếu không có bài nào viral -> Ratio là 1 : (Tổng số bài)
    if (viralCount === 0) return tweets.length;
    
    // Ví dụ: 20 bài, 2 bài viral -> Ratio 1 : 10
    return Math.round(tweets.length / viralCount);
}

function getMedian(values: number[]): number {
    if (values.length === 0) return 0;
    
    // Sắp xếp tăng dần
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    // Nếu lẻ -> lấy số giữa
    // Nếu chẵn -> trung bình cộng 2 số giữa
    return sorted.length % 2 !== 0 
        ? sorted[mid] 
        : (sorted[mid - 1] + sorted[mid]) / 2;
}


// Helper format số gọn (1200 -> 1.2K)
function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US', { 
        notation: "compact", 
        maximumFractionDigits: 1 
    }).format(num);
}

export interface PerformanceMetrics {
    avgViews: string;
    avgLikes: string;
    avgReposts: string;
    speedOfEngagement: string;
    rawMedianViews?: number;
    rawMedianLikes?: number;
}

export function calculateTypicalPerformance(
    allTweets: Tweet[],
): PerformanceMetrics {
    if (!allTweets || allTweets.length === 0) {
        return { avgViews: "0", avgLikes: "0", avgReposts: "0", speedOfEngagement: "0%" };
    }

    // 1. LỌC DỮ LIỆU (DATA CLEANING)
    const validTweets = allTweets.filter(t => {
        // - Bỏ Reply (tùy chọn, thường analytics chỉ tính bài post chính)
        if (t.isReply) return false;
        return true;
    });

    // Lấy tối đa 30 bài organic gần nhất
    // const recentTweets = validTweets.slice(0, 30);
    const recentTweets = validTweets;
    
    if (recentTweets.length === 0) {
        return { avgViews: "0", avgLikes: "0", avgReposts: "0", speedOfEngagement: "0%" };
    }

    // 2. TÍNH MEDIAN (TRUNG VỊ) CHO TỪNG CHỈ SỐ
    // Map ra các mảng số liệu riêng biệt
    const viewsArr = recentTweets.map(t => t.views);
    const likesArr = recentTweets.map(t => t.likes);
    const repostsArr = recentTweets.map(t => t.retweets); // RapidAPI trả về retweets

    const medianViews = getMedian(viewsArr);
    const medianLikes = getMedian(likesArr);
    const medianReposts = getMedian(repostsArr);

    // 3. TÍNH SPEED OF ENGAGEMENT (Dựa trên Median)
    // Speed thể hiện: Một bài viết "điển hình" thì tỷ lệ tương tác là bao nhiêu?
    let speed = 0;
    if (medianViews > 0) {
        // Cộng tổng các median tương tác chia cho median view
        const typicalEngagements = medianLikes + medianReposts; // Có thể cộng thêm replies nếu muốn
        speed = (typicalEngagements / medianViews) * 100;
    }

    return {
        avgViews: formatNumber(medianViews),
        avgLikes: formatNumber(medianLikes),
        avgReposts: formatNumber(medianReposts),
        speedOfEngagement: speed.toFixed(1) + "%",
        rawMedianViews: medianViews,
        rawMedianLikes: medianLikes
    };
}


// 3. Chấm điểm (Heuristic đơn giản)
export function assignGrade(engagement: number, viralRatio: number): string {
    // Logic chấm điểm "gắt" một chút
    if (engagement > 5.0 || (engagement > 3.0 && viralRatio <= 10)) return 'A+';
    if (engagement > 3.0) return 'A';
    if (engagement > 1.5) return 'B';
    if (engagement > 0.8) return 'C';
    return 'D';
}


/// Outlier

function calculateTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    const date = new Date(dateStr);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
}

export function getOutliers(allTweets: Tweet[], medianViews: number, medianLikes: number): OutlierPost[] {
    if (!allTweets.length) return [];

    // 1. Data Cleaning
    // Lọc bài Organic (Bỏ Pin, RT, Reply)
    const organicTweets = allTweets.filter(t => !t.text.startsWith("RT @") && !t.isReply);

    // [!code ++] 2. Thiết lập ngưỡng sàn (Threshold) dựa trên Median
    // Tránh trường hợp user like trung bình 10k, mà bài 5 like cũng được coi là outlier.
    // Quy định: Bài viết phải đạt ít nhất 10% likes trung bình hoặc tối thiểu 5 likes.
    const minLikesThreshold = Math.max(5, medianLikes * 0.1);
    const baselineViews = medianViews > 0 ? medianViews : 1000;

    const scoredTweets = organicTweets.map(t => {
        let score = 0;
        let tag = "";
        let color: OutlierPost['tagColor'] = 'default';

        // A. Hệ số Viral (Multiplier) dựa trên VIEW
        const multiplier = t.views / baselineViews;

        // B. Tính toán các tỷ lệ tương tác
        // Chỉ tính tỷ lệ nếu lượng like vượt qua ngưỡng sàn (đây là chỗ dùng medianLikes)
        const isSignificant = t.likes >= minLikesThreshold;
        
        const replyRatio = t.likes > 0 ? t.replies / t.likes : 0;
        const shareRatio = t.likes > 0 ? t.retweets / t.likes : 0;

        // C. Logic Gắn Tag (Đã được siết chặt bằng isSignificant)
        
        // Case 1: Reply Magnet (Tỷ lệ Rep/Like > 8%)
        const isReplyMagnet = isSignificant && replyRatio > 0.08;

        // Case 2: Strong Opinion (Tỷ lệ Share/Like > 20%)
        const isStrongOpinion = isSignificant && shareRatio > 0.20;

        // --- CHẤM ĐIỂM ƯU TIÊN HIỂN THỊ ---
        
        if (isReplyMagnet) {
            tag = "Reply magnet";
            color = 'purple';
            // Score cao để ưu tiên hiện bài này
            score = multiplier * 1.3; 
        } else if (isStrongOpinion) {
            tag = "Strong opinion";
            color = 'green';
            score = multiplier * 1.2;
        } else if (multiplier >= 1.5) {
            // Chỉ gọi là Viral nếu views gấp 1.5 lần trung bình
            const formattedMult = multiplier > 10 ? Math.round(multiplier) : multiplier.toFixed(1);
            tag = `${formattedMult}× vs normal`;
            color = 'blue';
            score = multiplier;
        } else {
            tag = "Organic";
            color = 'default';
            score = multiplier; // Điểm thấp, sẽ bị sort xuống dưới
        }

        return { tweet: t, score, tag, color };
    });

    // 3. Sắp xếp & Lấy Top 3
    // Lọc bỏ những bài điểm thấp (score < 1.2 nghĩa là view chỉ xêm xêm hoặc thấp hơn trung bình, ko có gì đặc sắc)
    const topOutliers = scoredTweets
        .filter(item => item.score >= 1.2) 
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return topOutliers.map(item => ({
        id: item.tweet.id,
        text: item.tweet.text,
        view: new Intl.NumberFormat('en-US', { notation: "compact" }).format(item.tweet.views),
        likes: new Intl.NumberFormat('en-US', { notation: "compact" }).format(item.tweet.likes),
        comments: new Intl.NumberFormat('en-US', { notation: "compact" }).format(item.tweet.replies),
        timeAgo: calculateTimeAgo(item.tweet.createdAt),
        performance: item.tag,
        tagColor: item.color,
        url: item.tweet.url || `https://x.com/user/status/${item.tweet.id}`
    }));
}



/// Best time to post (their data)

const DAYS_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function calculateBestTimeToPost(tweets: Tweet[]): BestTimeResult {
    if (!tweets || tweets.length < 5) {
        return { time: "N/A", timezone: "UTC", days: "Not enough data" };
    }

    // Chỉ tính Organic Tweets để chính xác
    const organicTweets = tweets.filter(t => !t.text.startsWith("RT @") && !t.isReply);

    // Init buckets
    const hourScores: { totalViews: number; count: number }[] = Array(24).fill(null).map(() => ({ totalViews: 0, count: 0 }));
    const dayScores: { totalViews: number; count: number }[] = Array(7).fill(null).map(() => ({ totalViews: 0, count: 0 }));

    // Fill buckets
    organicTweets.forEach(t => {
        const date = new Date(t.createdAt);
        const hour = date.getUTCHours(); // Dùng UTC để chuẩn hóa server
        const day = date.getUTCDay();

        // Cộng views vào bucket giờ
        hourScores[hour].totalViews += t.views;
        hourScores[hour].count += 1;

        // Cộng views vào bucket ngày
        dayScores[day].totalViews += t.views;
        dayScores[day].count += 1;
    });

    // --- TÌM GIỜ TỐT NHẤT ---
    let bestHour = -1;
    let maxHourAvg = -1;

    hourScores.forEach((h, index) => {
        if (h.count > 0) {
            const avg = h.totalViews / h.count;
            if (avg > maxHourAvg) {
                maxHourAvg = avg;
                bestHour = index;
            }
        }
    });

    // Format giờ: 9 -> "09:00", 14 -> "14:00"
    const timeString = bestHour !== -1 
        ? `${bestHour.toString().padStart(2, '0')}:00` 
        : "N/A";

    // --- TÌM NGÀY TỐT NHẤT (Lấy top 2 ngày) ---
    const dayAvgs = dayScores.map((d, index) => ({
        day: DAYS_MAP[index],
        avg: d.count > 0 ? d.totalViews / d.count : 0
    }));

    // Sort giảm dần theo Avg Views
    dayAvgs.sort((a, b) => b.avg - a.avg);

    // Lấy top 1 hoặc 2 ngày tốt nhất
    const bestDays = dayAvgs.filter(d => d.avg > 0).slice(0, 2).map(d => d.day);
    const daysString = bestDays.length > 0 ? bestDays.join(" & ") : "N/A";

    return {
        time: timeString,
        timezone: "UTC",
        days: daysString
    };
}


// Topics that work (and don’t)

export function calculateTopicStats(
    aiTopics: AnalyzedTopic[], 
    allTweets: Tweet[], 
    medianViews: number
): TopicStat[] {
    if (!aiTopics.length || !allTweets.length) return [];

    const baseline = medianViews > 0 ? medianViews : 1000;
    
    // Map nhanh ID -> Tweet
    const tweetMap = new Map(allTweets.map(t => [t.id, t]));

    // 1. TÍNH TOÁN DỮ LIỆU THÔ (RAW DATA)
    // Lưu tạm vào mảng trung gian để chuẩn hóa % sau
    let rawStats = aiTopics.map(topic => {
        // Lấy danh sách tweet thuộc topic
        const topicTweets = topic.tweetIds
            .map(id => tweetMap.get(id))
            .filter((t): t is Tweet => t !== undefined);

        if (topicTweets.length === 0) return null;

        // Tính Reach Multipliers
        const multipliers = topicTweets.map(t => t.views / baseline);
        const min = Math.min(...multipliers);
        const max = Math.max(...multipliers);
        const avg = multipliers.reduce((sum, val) => sum + val, 0) / multipliers.length;

        return {
            topic,
            count: topicTweets.length, // Lưu số lượng bài
            min, max, avg
        };
    }).filter(item => item !== null);

    if (rawStats.length === 0) return [];

    // [!code ++] 2. LOGIC CHUẨN HÓA % (NORMALIZATION)
    // Tổng số bài đã được phân loại (Bỏ qua các bài AI ko nhận diện được)
    const totalCategorized = rawStats.reduce((sum, item) => sum + item!.count, 0);

    // Tính % và xử lý làm tròn để tổng luôn là 100%
    let currentSumPercent = 0;
    let statsWithPercent = rawStats.map(item => {
        const rawPercent = (item!.count / totalCategorized) * 100;
        const roundedPercent = Math.round(rawPercent);
        currentSumPercent += roundedPercent;
        
        return {
            ...item,
            sharePercent: roundedPercent
        };
    });

    // Fix lỗi làm tròn (Ví dụ tổng ra 99% hoặc 101%)
    const diff = 100 - currentSumPercent;
    if (diff !== 0) {
        // Cộng/Trừ phần dư vào nhóm có tỷ trọng lớn nhất (để ít bị lộ nhất)
        // Tìm index của nhóm có share lớn nhất
        const maxIndex = statsWithPercent.reduce((iMax, x, i, arr) => x.sharePercent > arr[iMax].sharePercent ? i : iMax, 0);
        statsWithPercent[maxIndex].sharePercent += diff;
    }

    // 3. MAP SANG FORMAT UI
    const GRAPH_SCALE = 5.0; 

    return statsWithPercent.map(item => {
        let suggestion = "Keep as is";
        let type: TopicStat['suggestionType'] = 'neutral';
        let color = "bg-slate-400/50";

        if (item!.avg >= 1.3) {
            suggestion = "Do more of this";
            type = 'good';
            color = "bg-sky-400/50";
        } else if (item!.avg <= 0.7) {
            suggestion = "Post less";
            type = 'bad';
            color = "bg-slate-500/40";
        }

        const barStart = Math.min((item!.min / GRAPH_SCALE) * 100, 100);
        const barEnd = Math.min((item!.max / GRAPH_SCALE) * 100, 100);
        const barWidth = Math.max(barEnd - barStart, 2);

        return {
            name: item!.topic.name,
            description: item!.topic.description,
            share: `${item!.sharePercent}%`, // [!code ++] Dùng số đã chuẩn hóa
            shareRaw: item!.sharePercent,    // Lưu lại để sort
            reachMin: `${item!.min.toFixed(1)}× min`,
            reachAvg: `${item!.avg.toFixed(1)}× avg`,
            reachMax: `${item!.max.toFixed(1)}× max`,
            suggestion,
            suggestionType: type,
            barStart,
            barWidth,
            barColor: color
        };
    }).sort((a, b) => (b.shareRaw || 0) - (a.shareRaw || 0)); // Sort theo tỷ trọng (Share) giảm dần cho đẹp
}




export function calculateConsistency(tweets: Tweet[]): ConsistencyMetrics {
    if (!tweets.length) return { totalDays: 30, activeDays: 0, postsPerDay: "0", heatmap: [], streak: 0 };

    // Map số bài theo ngày
    const counts: Record<string, number> = {};
    tweets.forEach(t => {
        const dateStr = new Date(t.createdAt).toISOString().split('T')[0];
        counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    // [!code changed] Cấu hình 30 ngày
    const RANGE = 30; 
    const heatmap = [];
    const today = new Date();
    
    let currentStreak = 0;
    let checkStreak = true;
    let activeDaysInRange = 0; // Biến đếm mới cho đúng range 30 ngày

    // Loop ngược từ hôm nay về quá khứ 30 ngày
    for (let i = 0; i < RANGE; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = counts[dateStr] || 0;

        // Đếm ngày active trong range này
        if (count > 0) activeDaysInRange++;

        // Tính Streak
        if (i > 0) { // Bỏ qua hôm nay khi tính streak quá khứ
             if (checkStreak && count > 0) currentStreak++;
             else if (count === 0) checkStreak = false;
        }

        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count > 0) level = 1;
        if (count > 1) level = 2;
        if (count > 3) level = 3;
        if (count > 5) level = 4;

        heatmap.unshift({ date: dateStr, count, level });
    }

    const postsPerDay = (tweets.length / RANGE).toFixed(1);

    return {
        totalDays: RANGE,
        activeDays: activeDaysInRange,
        postsPerDay,
        heatmap,
        streak: currentStreak
    };
}


// --- 5. KEYWORD CLOUD & MENTIONS (Spy nội dung) ---
// Stopwords đơn giản (Tiếng Anh phổ biến trên X tech/biz)
const STOP_WORDS = new Set([
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "is", "are", "was", "were", "been", "has", "had", "why", "https", "http", "via"
]);

export function analyzeContentMix(tweets: Tweet[]): ContentMix {
    const hashtagsMap: Record<string, number> = {};
    const mentionsMap: Record<string, number> = {};
    const wordsMap: Record<string, number> = {};

    tweets.forEach(t => {
        // 1. Lấy Hashtags & Mentions bằng Regex
        const text = t.text.toLowerCase();
        
        // Regex Hashtag (#word)
        const foundHashtags = text.match(/#[a-z0-9_]+/g) || [];
        foundHashtags.forEach(tag => {
            hashtagsMap[tag] = (hashtagsMap[tag] || 0) + 1;
        });

        // Regex Mention (@handle)
        const foundMentions = text.match(/@[a-z0-9_]+/g) || [];
        foundMentions.forEach(mention => {
            // Bỏ qua chính user đó (nếu họ tự reply mình) - Cần xử lý ở UI hoặc chấp nhận
            mentionsMap[mention] = (mentionsMap[mention] || 0) + 1;
        });

        // 2. Tách từ (Keyword)
        // Loại bỏ url, ký tự đặc biệt, chỉ lấy chữ
        const cleanText = text
            .replace(/https?:\/\/\S+/g, '') // Bỏ Link
            .replace(/[^\w\s]/g, '') // Bỏ dấu câu
            .replace(/\s+/g, ' '); // Gộp khoảng trắng

        const words = cleanText.split(' ');
        words.forEach(w => {
            if (w.length > 3 && !STOP_WORDS.has(w) && !w.startsWith('http')) {
                wordsMap[w] = (wordsMap[w] || 0) + 1;
            }
        });
    });

    // Helper sort và lấy top 10
    const getTop = (map: Record<string, number>) => {
        return Object.entries(map)
            .map(([text, count]) => ({ text, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    };

    // Riêng mention thì map text -> handle
    const mentions = Object.entries(mentionsMap)
        .map(([handle, count]) => ({ handle, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

    return {
        hashtags: getTop(hashtagsMap),
        keywords: getTop(wordsMap),
        mentions: mentions
    };
}

