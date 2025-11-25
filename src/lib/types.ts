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
    };
    
    funnel: {
        viewToLike: number;
        viewToReply: number;
    };

    // Top content cụ thể
    topContent: {
        mostViral: Tweet | null;
        mostDiscussion: Tweet | null;
        hiddenGem: Tweet | null;
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
        bestHour: string;  // VD: "9 PM"
        postingSchedule: number[]; // Mảng 24 giờ (số lượng bài mỗi giờ)
    };
}
