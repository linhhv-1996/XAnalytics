<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let baseline: AnalyticsData['baseline'];

    function formatNumber(num: number) {
        return new Intl.NumberFormat('en-US', { notation: "compact" }).format(num);
    }
</script>

<div class="glass-panel rounded-xl p-4">
    <div class="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800/50">
        <div class="flex items-center gap-2">
            <i class="fa-solid fa-scale-balanced text-zinc-400 text-[11px]"></i>
            <h3 class="text-zinc-300 text-[11px] font-bold uppercase tracking-wider">
                Baseline Performance
            </h3>
        </div>
        <span class="text-[9px] text-zinc-600 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">
            Median (Typical)
        </span>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div>
            <div class="text-zinc-500 text-[10px] uppercase mb-1 font-medium">Typical Views</div>
            <div class="text-lg font-bold text-white font-mono">{formatNumber(baseline.views)}</div>
            <div class="w-full bg-zinc-800/50 h-1 mt-2 rounded-full overflow-hidden relative group" title="Consistency Score">
                <div class="bg-blue-500 h-full rounded-full transition-all duration-500" style="width: {baseline.viewsScore}%"></div>
            </div>
        </div>

        <div>
            <div class="text-zinc-500 text-[10px] uppercase mb-1 font-medium">Typical Likes</div>
            <div class="text-lg font-bold text-white font-mono">{formatNumber(baseline.likes)}</div>
            <div class="w-full bg-zinc-800/50 h-1 mt-2 rounded-full overflow-hidden">
                <div class="bg-pink-500 h-full rounded-full transition-all duration-500" style="width: {baseline.likesScore}%"></div>
            </div>
        </div>

        <div>
            <div class="text-zinc-500 text-[10px] uppercase mb-1 font-medium">Engagement</div>
            <div class="text-lg font-bold text-emerald-400 font-mono">{baseline.engagement}%</div>
            <div class="w-full bg-zinc-800/50 h-1 mt-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" style="width: {baseline.engagementScore}%"></div>
            </div>
        </div>

        <div>
            <div class="text-zinc-500 text-[10px] uppercase mb-1 font-medium">Viral Odds</div>
            <div class="text-lg font-bold text-yellow-400 font-mono">{baseline.viralRate}%</div>
            <div class="w-full bg-zinc-800/50 h-1 mt-2 rounded-full overflow-hidden">
                <div class="bg-yellow-500 h-full rounded-full transition-all duration-500" style="width: {baseline.viralScore}%"></div>
            </div>
        </div>
    </div>
</div>
