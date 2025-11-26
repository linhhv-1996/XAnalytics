// src/lib/types.ts

export type TweetType = 'single' | 'thread' | 'retweet' | 'reply';

export interface Tweet {
    id: string;
    type: TweetType;
    text: string;
    createdAt: string; // ISO string
    
    // Metrics (Raw data)
    views: number;
    likes: number;
    retweets: number;
    replies: number;
    bookmarks: number;
    
    // Structure & Media
    isReply: boolean;
    hasMedia: boolean;
    mediaType: 'image' | 'video' | 'mixed' | 'none';
    
    // Entities (Để phân tích deep)
    url: string;
    outboundLinks: string[]; // Link dẫn ra ngoài
    hashtags: string[];
    mentions: string[];
    
    // Thread info
    threadChildren: Tweet[]; // Các tweet con (self-replies)
}

export interface TwitterProfile {
    id: string;
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
}

// Kết quả trả về từ Fetcher
export interface RawTwitterData {
    profile: TwitterProfile;
    tweets: Tweet[];
    pinnedTweet: Tweet | null;
}

// Kết quả trả về từ Analyzer (Insight)
export interface AnalyticsData {
    profile: {
        handle: string;
        bio: string;
        name: string;
        avatarUrl: string;
        banner: string;
        followers: string;
        engagement: string;
        viralRatio: string;
        grade: string;
        following: string;
        tweetsCount: string;
    };
    
    // Insight thống kê (Thay thế cho AI text)
    overview: {
        totalEngagement: number;
        avgEngagementRate: number;
        viralRate: number;
    };
    
    contentStrategy: {
        threadRatio: number;
        visualRatio: number;
        promoRatio: number;

        // [!code ++] Thêm dữ liệu chi tiết cho UI mới
        monetization: {
            valueCount: number;
            promoCount: number;
            valueRatio: number; // %
            promoRatio: number; // %
            frequency: string;  // VD: "Sells every 4 posts"
        };
        length: {
            short: { count: number; avgViews: number; score: number };
            medium: { count: number; avgViews: number; score: number };
            long: { count: number; avgViews: number; score: number };
            bestType: 'Short' | 'Medium' | 'Long' | 'Mixed';
        };
    };
    
    funnel: {
        viewToLike: number;
        viewToReply: number;
        viewToFan: number;
    };

    // Top content cụ thể
    topContent: {
        mostViral: Tweet | null;
        mostDiscussion: Tweet | null;
        hiddenGem: Tweet | null;
        list: {
            text: string;
            views: string;
            likes: string;
            replies: string;
            date: string;
            url: string;
        }[];
    };

    // Các field cũ nếu ông muốn giữ tương thích (optional)
    pinnedPost?: any;
    outliers?: any[];
    performance?: any;
    consistency?: any;
    bestTime?: any;

    network: {
        topMentions: { handle: string; count: number }[]; // Top bạn bè
    };
    topics: {
        topHashtags: { tag: string; count: number }[];    // Top chủ đề
    };
    traffic: {
        topDomains: { domain: string; count: number }[];  // Nơi dẫn link
    };
    habits: {
        bestHour: string;
        bestHourMetric: string;
        postingSchedule: number[];
        heatmap: {          // [!code ++] Thêm trường này
            date: string;   // Format: "Nov 25"
            fullDate: string; // Format: "2025-11-25"
            count: number;
            level: 0 | 1 | 2 | 3; // Mức độ đậm nhạt
        }[];
        hourlyPerf: {
            hour: number;      // 0-23
            avgViews: number;  // Trung bình view
            postCount: number; // Số bài đăng (để tham khảo)
            score: number;     // Điểm chuẩn hóa 0-100 để vẽ height cột
        }[];
    };

    baseline: {
        views: number;      // Median Views
        likes: number;      // Median Likes
        engagement: number; // Median Engagement Rate
        viralRate: number;  // Giữ nguyên logic cũ
        
        // Để vẽ thanh bar % (So sánh Median với Max)
        viewsScore: number; 
        likesScore: number;
        engagementScore: number;
        viralScore: number; 
    };

    signal: {
        title: string;
        type: string;      // "Breakout Post", "Pinned Strategy", "Top Signal"
        text: string;
        createdAt: string; // "Dec 07, 2023"
        likes: string;     // "42k"
        replies: string;   // "4.9k"
        views: string;
        multiplier: string; // "4.2x" (So với baseline)
        url: string;
        hasMedia: boolean;
        mediaType: 'image' | 'video' | 'mixed' | 'none';
    } | null;
}
