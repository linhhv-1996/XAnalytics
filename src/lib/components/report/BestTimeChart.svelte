<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    export let habits: AnalyticsData['habits'];
    function formatView(num: number) {
        return new Intl.NumberFormat('en-US', { notation: "compact" }).format(num);
    }
</script>

<div class="card-soft p-4 flex flex-col h-full">
    <h3 class="text-[11px] font-semibold uppercase mb-1.5 flex justify-between items-center tracking-[0.14em] text-slate-700">
        <span>⏰ Best Time to Post</span>
        <i class="fa-regular fa-clock text-[11px] text-slate-400"></i>
    </h3>
    
    <div class="text-center my-3">
        {#if habits.bestHour !== "N/A"}
            <div class="text-xl font-bold text-slate-900 font-mono">{habits.bestHour} (UTC)</div>
            <div class="text-[11px] text-slate-500">{habits.bestHourMetric}</div>
        {:else}
            <div class="text-sm text-slate-400 py-2">Not enough data</div>
        {/if}
    </div>
    
    <div class="relative h-28 w-full mt-auto">
        <div class="flex items-end gap-[2px] h-full w-full px-1">
            {#each habits.hourlyPerf as h}
                <div class="flex-1 h-full flex flex-col justify-end group relative">
                    <div 
                        class="w-full rounded-sm transition-all duration-300 {h.score === 100 ? 'bg-emerald-500' : 'bg-slate-200 hover:bg-slate-300'}"
                        style="height: {Math.max(h.score, 5)}%"
                    ></div>
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-20 pointer-events-none">
                        <div class="bg-slate-800 text-white text-[9px] px-2 py-1 rounded border border-slate-700 whitespace-nowrap shadow-xl font-mono">
                            <div class="font-bold text-emerald-300">{h.hour}:00 (UTC)</div>
                            <div>{formatView(h.avgViews)} views</div>
                            <div class="text-slate-400 text-[8px]">{h.postCount} posts</div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
    
    <div class="flex justify-between text-[9px] text-slate-400 mt-2 font-mono uppercase px-1">
        <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
    </div>
</div>
