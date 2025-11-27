<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    
    export let data: AnalyticsData['replyStrategy'];
    export let myHandle: string = "";

    function getInteractionLink(targetHandle: string) {
        const me = myHandle.replace('@', '');
        const you = targetHandle.replace('@', '');
        const query = `(from:${me}) (to:${you})`;
        return `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query`;
    }

    // --- AVATAR CLOUD LOGIC ---
    $: targets = data.topTargets || [];
    $: maxCount = Math.max(...targets.map(t => t.count), 1);
    $: minCount = Math.min(...targets.map(t => t.count), 0);

    function getSize(count: number) {
        const minPx = 34;
        const maxPx = 60; 
        if (maxCount === minCount) return `${maxPx}px`;
        const ratio = (count - minCount) / (maxCount - minCount);
        return `${minPx + (ratio * (maxPx - minPx))}px`;
    }

    function getZIndex(count: number) {
        return Math.floor((count / maxCount) * 10);
    }
</script>

<div class="card-soft p-0 h-full flex overflow-hidden min-h-[250px]"> 
    
    <div class="w-[58%] p-5 flex flex-col justify-between bg-white z-10 relative">
        
        <div class="flex items-center gap-2.5 text-slate-700 mb-4">
            <!-- <div class="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-sm">
                <i class="fa-solid fa-reply-all text-[11px]"></i>
            </div> -->
            <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700"><i class="fa-solid fa-reply-all text-[11px]"></i> 
                Reply Strategy
            </h3>
        </div>

        <div class="flex flex-col items-start mb-6 pl-1">
            <span class="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1">Avg. Reply Length</span>
            
            <div class="flex items-baseline gap-1.5">
                <span class="text-4xl font-black text-slate-800 tracking-tight leading-none">
                    {data.avgLength}
                </span>
                <span class="text-[13px] text-slate-400 font-medium">chars</span>
            </div>
            
            <div class="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden max-w-[160px]">
                <div class="h-full bg-slate-700 rounded-full" style="width: {Math.min((data.avgLength / 280) * 100, 100)}%"></div>
            </div>
        </div>

        <div class="space-y-3 pr-2">
            <div class="group">
                <div class="flex justify-between items-end text-[11px] mb-1.5">
                    <span class="text-slate-500 font-medium group-hover:text-emerald-600 transition-colors">High Value (> 80 chars)</span>
                    <span class="font-mono font-bold text-slate-700">{data.metrics.valueScore}%</span>
                </div>
                <div class="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div class="h-full bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.4)]" style="width: {data.metrics.valueScore}%"></div>
                </div>
            </div>

            <div class="group">
                <div class="flex justify-between items-end text-[11px] mb-1.5">
                    <span class="text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Conversational (40-80 chars)</span>
                    <span class="font-mono font-bold text-slate-700">{data.metrics.neutralScore}%</span>
                </div>
                <div class="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div class="h-full bg-slate-400 rounded-full" style="width: {data.metrics.neutralScore}%"></div>
                </div>
            </div>

            <div class="group">
                <div class="flex justify-between items-end text-[11px] mb-1.5">
                    <span class="text-slate-500 font-medium group-hover:text-rose-500 transition-colors">Low Effort (&lt; 40 chars)</span>
                    <span class="font-mono font-bold text-slate-700">{data.metrics.spamScore}%</span>
                </div>
                <div class="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div class="h-full bg-rose-400 rounded-full" style="width: {data.metrics.spamScore}%"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="w-[42%] bg-slate-50 border-l border-slate-100 flex flex-col relative shadow-inner">
        <div class="absolute top-4 w-full text-center z-0 pointer-events-none">
             <span class="text-[9px] text-slate-400 uppercase tracking-wider font-bold opacity-60">Core Network</span>
        </div>

        <div class="flex-1 flex flex-wrap justify-center items-center content-center gap-[-6px] p-3 pt-8">
            {#if targets.length > 0}
                {#each targets as target}
                    <a href={getInteractionLink(target.handle)} target="_blank" rel="noopener noreferrer" 
                       class="group relative transition-transform duration-300 hover:scale-110 hover:z-50"
                       style="z-index: {getZIndex(target.count)}; margin: -3px;" 
                       title="@{target.handle}: {target.count} replies">
                        
                        <div class="rounded-full border-[2px] border-white shadow-sm bg-slate-200 overflow-hidden 
                                    group-hover:border-emerald-400 group-hover:shadow-md transition-all"
                             style="width: {getSize(target.count)}; height: {getSize(target.count)};">
                            <img src={target.avatar} alt={target.handle} class="w-full h-full object-cover" loading="lazy">
                        </div>
                    </a>
                {/each}
            {:else}
                <span class="text-[11px] text-slate-300 italic">No data</span>
            {/if}
        </div>
    </div>
</div>
