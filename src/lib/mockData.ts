import type { Profile, Post, Topic, Ad } from './types';

export const mockProfile: Profile = {
    handle: 'elonmusk',
    name: 'ELON MUSK',
    followers: '1.2M',
    engagement: '4.8%',
    viralRatio: '1 : 15',
    grade: 'A+',
    avatarUrl: 'https://unavatar.io/twitter/elonmusk'
};

export const pinnedPost: Post = {
    id: 'pinned-1',
    content: "If you're building in public, you need this tool. It saved me 100+ hours of manual data fetching. Read the full thread below and get 50% off for the first 100 users.",
    date: '180d ago',
    likes: '550K',
    comments: '40K',
    age: '180d',
    type: 'Pinned, non-organic traffic',
    mainGoal: 'Drive signups / sales over time',
    estimatedClicks: '~1.2% click-through',
    url: '#'
};

export const outliers: Post[] = [
    {
        id: 'out-1',
        content: "Stop building features nobody wants. I wasted 3 months. 0 users. Then I tried a landing page which converted at 40% immediately...",
        date: '2d ago',
        likes: '124K',
        comments: '12K',
        multiplier: '25× vs normal',
        type: 'Organic',
        url: '#'
    },
    {
        id: 'out-2',
        content: "What is the one SaaS tool you cancelled this month? 👇 The answers are gold. I want to know the churn reasons.",
        date: 'Oct 08',
        likes: '45K',
        comments: '8.5K',
        multiplier: 'Reply magnet',
        type: 'Organic',
        url: '#'
    },
    {
        id: 'out-3',
        content: "Unpopular opinion: Most productivity gurus are just unemployed people teaching you how to work. Real work is messy.",
        date: 'Sep 12',
        likes: '28K',
        comments: '4K',
        multiplier: 'Strong opinion',
        type: 'Organic',
        url: '#'
    }
];

export const baselineMetrics = {
    views: '450K',
    likes: '4.2K',
    reposts: '550',
    speed: '2.0%'
};

export const topics: Topic[] = [
    {
        name: 'Contrarian takes',
        description: '“Stop doing X”, “Y is dead”',
        share: '15%',
        performance: { min: '1.5×', avg: '10×', max: '25×', barStart: 30, barWidth: 60 },
        suggestion: { text: 'Do more of this', type: 'positive' }
    },
    {
        name: 'Personal stories',
        description: 'Failures, lessons, behind-the-scenes',
        share: '30%',
        performance: { min: '0.8×', avg: '1.8×', max: '3×', barStart: 10, barWidth: 50 },
        suggestion: { text: 'Keep as is', type: 'neutral' }
    },
    {
        name: 'External links',
        description: 'News, YouTube, blog links',
        share: '20%',
        performance: { min: '0.2×', avg: '0.35×', max: '0.5×', barStart: 5, barWidth: 25 },
        suggestion: { text: 'Post less', type: 'negative' }
    }
];

export const ads: Ad[] = [
    { id: '1', name: 'LaunchKit', description: 'Ship a clean landing page in under an hour.', badge: '-20%', badgeColor: 'emerald', audience: 'For solo founders' },
    { id: '2', name: 'ThreadGhost', description: 'Ghost-write high performing threads.', badge: 'New', badgeColor: 'sky', audience: 'For busy creators' },
    { id: '3', name: 'DM Engine', description: 'Turn replies into warm DMs.', badge: 'Warm only', badgeColor: 'amber', audience: 'No spam sequences' },
    { id: '4', name: 'SponsorDeck', description: 'Auto-generate a clean sponsorship deck.', badge: 'Deck', badgeColor: 'fuchsia', audience: 'For brand deals' },
    { id: '5', name: 'AudienceOS', description: 'Lightweight CRM for high-intent followers.', badge: 'CRM', badgeColor: 'cyan', audience: 'Never lose a lead' },
    { id: '6', name: 'ClipForge', description: 'Turn long-form into X-native clips.', badge: 'Video', badgeColor: 'lime', audience: 'Content repurposing' },
];
