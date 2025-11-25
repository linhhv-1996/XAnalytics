// src/routes/api/analytics/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchTwitterData } from '$lib/server/twitter';
import { calculateEngagement, calculateViralRatio, assignGrade, calculateTypicalPerformance, getOutliers, calculateBestTimeToPost, calculateTopicStats, calculateConsistency, analyzeContentMix } from '$lib/server/analytics-utils';
import { analyzeArchetype, analyzePinnedPost, analyzeTopics } from '$lib/server/gemini';
import type { AnalyticsData } from '$lib/types';


function calculateAge(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) return 'Today';
    return `${days}d ago`;
}

function formatMetric(num: number): string {
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
}


export const GET: RequestHandler = async ({ url }) => {
    const handle = url.searchParams.get('handle');
    if (!handle) return json({ error: 'Handle required' }, { status: 400 });

    try {
        // 1. Lấy dữ liệu thô (Không cache)
        const { profile, tweets, pinnedTweet } = await fetchTwitterData(handle);

        // 2. Tính toán Metrics (Không AI)
        const avgEngagement = calculateEngagement(tweets);
        const viralOneInX = calculateViralRatio(tweets, avgEngagement);
        const grade = assignGrade(avgEngagement, viralOneInX);

        // Format số liệu cho đẹp (1.23%)
        const engagementFormatted = avgEngagement.toFixed(1) + '%';
        const viralRatioFormatted = `1 : ${viralOneInX}`;

        const organicTweets = tweets.filter(t => !t.text.startsWith("RT @") && !t.isReply);

        const organicTexts = tweets
            .filter(t => !t.text.startsWith("RT @") && !t.isReply)
            .map(t => t.text);
        const allTextsForAI = pinnedTweet 
            ? [pinnedTweet.text, ...organicTexts]
            : organicTexts;
            
        const [pinnedAnalysis, aiTopics, archetypeResult] = await Promise.all([
            pinnedTweet ? analyzePinnedPost(pinnedTweet.text) : Promise.resolve({ goal: "N/A", type: "N/A", clickThrough: "N/A" }),
            analyzeTopics(organicTweets.map(t => ({ id: t.id, text: t.text }))),
            analyzeArchetype(allTextsForAI)
        ]);
    

        const performanceMetrics = calculateTypicalPerformance(tweets);

        const outliers = getOutliers(tweets, performanceMetrics.rawMedianViews ?? 0, performanceMetrics.rawMedianLikes ?? 0);


        const bestTime = calculateBestTimeToPost(tweets);


        const topicStats = calculateTopicStats(
            aiTopics, 
            organicTweets, 
            performanceMetrics.rawMedianViews ?? 0
        );


        const consistency = calculateConsistency(tweets);
        const contentMix = analyzeContentMix(tweets);

        
        // 3. Map vào đúng Interface của Frontend
        // Lưu ý: Các phần chưa implement (pinnedPost, outliers...) ta tạm để mock hoặc null
        const responseData: AnalyticsData = {
            profile: {
                handle: `@${profile.handle}`,
                name: profile.name,
                avatarUrl: profile.avatar,
                followers: new Intl.NumberFormat('en-US', { notation: "compact" }).format(profile.followers),
                engagement: engagementFormatted,
                viralRatio: viralRatioFormatted,
                grade: grade
            },
            // --- CÁC PHẦN DƯỚI TẠM THỜI MOCK ĐỂ KHÔNG BỊ LỖI FRONTEND ---
            pinnedPost: pinnedTweet ? {
                text: pinnedTweet.text,
                likes: formatMetric(pinnedTweet.likes),
                comments: formatMetric(pinnedTweet.replies),
                age: calculateAge(pinnedTweet.createdAt),
                goal: pinnedAnalysis.goal,         // Từ AI
                type: pinnedAnalysis.type,         // Từ AI
                clickThrough: pinnedAnalysis.clickThrough, // Từ AI,
                url: pinnedTweet.url,
                view: formatMetric(pinnedTweet.views)
            } : {
                text: "",
                likes: "-", comments: "-", age: "-",
                goal: "-", type: "-", clickThrough: "-", url: "#", view: ""
            },
        outliers: outliers,
        performance: performanceMetrics,
        sponsors: [
            { id: 1, name: 'LaunchKit', initials: 'LK', description: 'Clean landing pages for X products in under an hour.', badgeText: '-20%', badgeColor: 'emerald', tagline: 'For solo builders' },
            { id: 2, name: 'ThreadGhost', initials: 'TG', description: 'Ghost-written X threads from your bullet points.', badgeText: 'New', badgeColor: 'sky', tagline: 'For busy creators' },
            { id: 3, name: 'DM Engine', initials: 'DM', description: 'Turn replies into warm DMs, no spammy sequences.', badgeText: 'Warm only', badgeColor: 'amber', tagline: 'Audience growth' },
            { id: 4, name: 'SponsorDeck', initials: 'SD', description: 'Auto sponsorship deck from your X analytics.', badgeText: 'Deck', badgeColor: 'fuchsia', tagline: 'For brand deals' },
            { id: 5, name: 'AudienceOS', initials: 'AO', description: 'Lightweight CRM for high-intent followers & DMs.', badgeText: 'CRM', badgeColor: 'cyan', tagline: 'Keep warm leads' },
            { id: 6, name: 'ClipForge', initials: 'CF', description: 'Turn long-form into X-native clips with hooks & captions.', badgeText: 'Video', badgeColor: 'lime', tagline: 'Content repurposing' }
        ],
        archetype: archetypeResult,
        formats: [
            { name: 'Threads', multiplier: '2.5× avg', icon: 'fa-layer-group', barWidth: 90, isWinner: true, colorClass: 'bg-emerald-900/40 border-emerald-400/70' },
            { name: 'Image single', multiplier: '1.1× avg', icon: 'fa-regular-image', barWidth: 45, colorClass: 'bg-slate-800 border-slate-500/80' },
            { name: 'Text only', multiplier: '0.8× avg', icon: 'fa-align-left', barWidth: 30, colorClass: 'bg-slate-800 border-slate-500/80' }
        ],
        topics: topicStats,
        bestTime: bestTime,
        consistency: consistency,
        contentMix: contentMix,
        };

        return json(responseData);

    } catch (error: any) {
        console.error("Analytics Error:", error);
        return json({ error: error.message }, { status: 500 });
    }
};
