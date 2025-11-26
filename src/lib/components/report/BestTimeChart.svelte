<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let habits: AnalyticsData['habits'];

    // Format view count cho tooltip (e.g. 1200 -> 1.2k)
    function formatView(num: number) {
        return new Intl.NumberFormat('en-US', { notation: "compact" }).format(num);
    }
</script>

<div class="glass-panel rounded-xl p-4">
    <h3 class="text-zinc-400 text-[10px] font-bold uppercase mb-1.5 flex justify-between items-center">
        <span>⏰ Best Time to Post</span>
        <i class="fa-regular fa-clock text-[11px]"></i>
    </h3>
    
    <div class="text-center my-3">
        {#if habits.bestHour !== "N/A"}
            <div class="text-xl font-bold text-white font-mono">{habits.bestHour} (UTC)</div>
            <div class="text-[10px] text-zinc-500">{habits.bestHourMetric}</div>
        {:else}
            <div class="text-sm text-zinc-500 py-2">Not enough data</div>
        {/if}
    </div>
    
    <div class="relative h-24 w-full mt-4">
        <div class="flex items-end gap-[2px] h-full w-full px-1">
            {#each habits.hourlyPerf as h}
                <div class="flex-1 h-full flex flex-col justify-end group relative">
                    <div 
                        class="w-full rounded-sm transition-all duration-300 {h.score === 100 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-zinc-800 hover:bg-zinc-700'}"
                        style="height: {h.score}%"
                    ></div>

                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-20 pointer-events-none">
                        <div class="bg-zinc-900 text-white text-[9px] px-2 py-1 rounded border border-zinc-700 whitespace-nowrap shadow-xl font-mono">
                            <div class="font-bold text-emerald-400">{h.hour}:00 (UTC)</div>
                            <div>{formatView(h.avgViews)} views</div>
                            <div class="text-zinc-500 text-[8px]">{h.postCount} posts</div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
    
    <div class="flex justify-between text-[9px] text-zinc-600 mt-2 font-mono uppercase px-1">
        <span>00h</span>
        <span>06h</span>
        <span>12h</span>
        <span>18h</span>
        <span>23h</span>
    </div>
</div>
