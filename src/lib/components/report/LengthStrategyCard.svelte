<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    export let data: AnalyticsData['contentStrategy']['length'];

    function getScoreColor(score: number) {
        if (score >= 1.2) return 'text-emerald-600';
        if (score >= 0.8) return 'text-slate-500';
        return 'text-rose-500';
    }
</script>

<div class="card-soft p-4">
    <h3 class="text-[11px] font-semibold uppercase mb-3 flex items-center gap-2 tracking-[0.14em] text-slate-700">
        <i class="fa-solid fa-ruler-horizontal text-[11px] text-slate-400"></i> Length Strategy
    </h3>
    
    <div class="space-y-3">
        <div class="flex items-center justify-between text-[10px] text-slate-600">
            <span>Short (&lt;140c)</span>
            <div class="flex flex-col items-end">
                <span class="font-mono {getScoreColor(data.short.score)}">{data.short.score}x Avg</span>
            </div>
        </div>

        <div class="flex items-center justify-between text-[10px] text-slate-600">
            <span>Medium</span>
            <div class="flex flex-col items-end">
                <span class="font-mono {getScoreColor(data.medium.score)}">{data.medium.score}x Avg</span>
            </div>
        </div>

        <div class="flex items-center justify-between text-[10px] text-slate-600">
            <span>Long / Threads</span>
            <div class="flex flex-col items-end">
                <span class="font-mono {getScoreColor(data.long.score)}">{data.long.score}x Avg</span>
            </div>
        </div>

        <!-- <p class="text-[9px] text-slate-500 italic mt-auto pt-2 border-t border-slate-100">
            {data.bestType} formats perform best.
        </p> -->
    </div>
</div>
