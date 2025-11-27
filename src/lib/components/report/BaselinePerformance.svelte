<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    export let baseline: AnalyticsData['baseline'];
    function formatNumber(num: number) {
        return new Intl.NumberFormat('en-US', { notation: "compact" }).format(num);
    }
</script>

<div class="card-soft p-4">
    <div class="flex items-center justify-between mb-3 pb-2">
        <div class="flex items-center gap-2">
            <i class="fa-solid fa-scale-balanced text-slate-400 text-[11px]"></i>
            <h3 class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                Baseline Performance
            </h3>
        </div>
        <span class="text-[9px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
            Median (Typical)
        </span>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
            <div class="text-slate-500 text-[11px] uppercase mb-1 font-medium">Typical Views</div>
            <div class="text-lg font-bold text-slate-900 font-mono">{formatNumber(baseline.views)}</div>
            <div class="w-full bg-slate-100 h-1.5 mt-2 rounded-full overflow-hidden">
                <div class="bg-sky-500 h-full rounded-full" style="width: {baseline.viewsScore}%"></div>
            </div>
        </div>

        <div>
            <div class="text-slate-500 text-[11px] uppercase mb-1 font-medium">Typical Likes</div>
            <div class="text-lg font-bold text-slate-900 font-mono">{formatNumber(baseline.likes)}</div>
            <div class="w-full bg-slate-100 h-1.5 mt-2 rounded-full overflow-hidden">
                <div class="bg-pink-500 h-full rounded-full" style="width: {baseline.likesScore}%"></div>
            </div>
        </div>

        <div>
            <div class="text-slate-500 text-[11px] uppercase mb-1 font-medium">Engagement</div>
            <div class="text-lg font-bold text-emerald-600 font-mono">{baseline.engagement}%</div>
            <div class="w-full bg-slate-100 h-1.5 mt-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full" style="width: {baseline.engagementScore}%"></div>
            </div>
        </div>

        <div>
            <div class="text-slate-500 text-[11px] uppercase mb-1 font-medium">Viral Odds</div>
            <div class="text-lg font-bold text-amber-500 font-mono">{baseline.viralRate}%</div>
            <div class="w-full bg-slate-100 h-1.5 mt-2 rounded-full overflow-hidden">
                <div class="bg-amber-400 h-full rounded-full" style="width: {baseline.viralScore}%"></div>
            </div>
        </div>
    </div>
</div>
