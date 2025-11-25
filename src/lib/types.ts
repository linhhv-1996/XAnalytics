export interface Profile {
    handle: string;
    name: string;
    avatarUrl: string;
    followers: string;
    engagement: string;
    viralRatio: string;
    grade: string;
}

export interface PinnedPost {
    text: string;
    likes: string;
    comments: string;
    age: string;
    goal: string;
    type: string;
    clickThrough: string;
    url: string;
    view: string;
}

export interface OutlierPost {
    id: string;
    text: string;
    view: string;
    likes: string;
    comments: string;
    timeAgo: string;
    performance: string;
    tagColor: 'blue' | 'purple' | 'green' | 'default';
    url: string;
}

export interface PerformanceMetrics {
    avgViews: string;
    avgLikes: string;
    avgReposts: string;
    speedOfEngagement: string;
}

export interface Sponsor {
    id: number;
    name: string;
    description: string;
    badgeText: string;
    badgeColor: 'emerald' | 'sky' | 'amber' | 'fuchsia' | 'cyan' | 'lime';
    tagline: string;
    initials: string;
}

export interface FormatStat {
    name: string;
    multiplier: string;
    icon: string;
    barWidth: number; // percentage
    isWinner?: boolean;
    colorClass: string;
}

export interface BestTimeResult {
    time: string;
    timezone: string;
    days: string;
}

export interface AnalyticsData {
    profile: Profile;
    pinnedPost: PinnedPost;
    outliers: OutlierPost[];
    performance: PerformanceMetrics;
    sponsors: Sponsor[];
    archetype: ArchetypeResult;
    formats: FormatStat[];
    topics: TopicStat[];
    bestTime: BestTimeResult;
    consistency: {
        totalDays: number;
        activeDays: number;
        postsPerDay: string;
        heatmap: { date: string; count: number; level: number }[];
        streak: number;
    };
    contentMix: {
        hashtags: { text: string; count: number }[];
        mentions: { handle: string; count: number }[];
        keywords: { text: string; count: number }[];
    };
}


export interface AnalyzedTopic {
    name: string;
    description: string;
    tweetIds: string[];
}

export interface TopicStat {
    name: string;
    description: string;
    share: string;
    reachMin: string;
    reachAvg: string;
    reachMax: string;
    suggestion: string;
    suggestionType: 'good' | 'neutral' | 'bad';
    barStart: number;
    barWidth: number;
    barColor: string;
}


export interface ArchetypeResult {
    name: string;
    match_score: number;
    aggression: number;
    polarization: number;
    description: string;
}

export interface ConsistencyMetrics {
    totalDays: number;
    activeDays: number;
    postsPerDay: string;
    heatmap: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
    streak: number;
}

export interface ContentMix {
    hashtags: { text: string; count: number }[];
    mentions: { handle: string; count: number }[]; // Cái này là "Lite Network"
    keywords: { text: string; count: number }[];
}

