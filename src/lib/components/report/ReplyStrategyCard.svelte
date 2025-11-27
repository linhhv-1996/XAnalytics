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

    // [!code fix] Điều chỉnh lại size: Bé nhất 30px, Lớn nhất 54px (đỡ choán chỗ)
    function getSize(count: number) {
        const minPx = 30;
        const maxPx = 54;
        if (maxCount === minCount) return `${maxPx}px`;
        const ratio = (count - minCount) / (maxCount - minCount);
        return `${minPx + (ratio * (maxPx - minPx))}px`;
    }

    function getZIndex(count: number) {
        return Math.floor((count / maxCount) * 30);
    }
</script>

<div class="card-soft p-0 h-full flex flex-col sm:flex-row overflow-hidden min-h-[280px]"> 
    
    <div class="w-full sm:w-[55%] p-5 sm:p-6 flex flex-col justify-between bg-white z-10 relative border-b sm:border-b-0 sm:border-r border-slate-100">
        
        <div class="flex items-center gap-2.5 text-slate-700 mb-4 sm:mb-0">
            <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
                <i class="fa-solid fa-reply-all text-[11px] text-slate-400"></i> Reply Strategy
            </h3>
        </div>

        <div class="flex flex-col items-start mb-6 sm:mb-8 pl-1">
            <span class="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Avg. Reply Length</span>
            <div class="flex items-baseline gap-1.5">
                <span class="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight leading-none">
                    {data.avgLength}
                </span>
                <span class="text-[13px] text-slate-400 font-medium">chars</span>
            </div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden max-w-[140px]">
                <div class="h-full bg-slate-700 rounded-full" style="width: {Math.min((data.avgLength / 280) * 100, 100)}%"></div>
            </div>
        </div>

        <div class="space-y-3.5 pr-2">
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

    <div class="w-full sm:w-[45%] bg-slate-50 flex flex-col relative shadow-[inset_0_2px_6px_rgba(0,0,0,0.02)] min-h-[220px] sm:min-h-auto overflow-visible">
        <div class="absolute top-4 w-full text-center z-0 pointer-events-none">
             <span class="text-[9px] text-slate-400 uppercase tracking-wider font-bold opacity-60">Core Network</span>
        </div>

        <div class="flex-1 flex flex-wrap justify-center items-center content-center p-6 pt-8 gap-1">
            {#if targets.length > 0}
                {#each targets as target}
                    <a href={getInteractionLink(target.handle)} target="_blank" rel="noopener noreferrer" 
                       class="group relative transition-all duration-300 ease-out hover:scale-125 hover:z-[100] shrink-0"
                       style="z-index: {getZIndex(target.count)}; margin: -1px;" 
                    >
                        <div class="rounded-full border-2 border-white shadow-sm bg-white overflow-hidden group-hover:border-emerald-400 group-hover:shadow-xl transition-colors"
                             style="width: {getSize(target.count)}; height: {getSize(target.count)};">
                            <img src={target.avatar.replace('_normal', '_400x400')} alt={target.handle} class="w-full h-full object-cover" loading="lazy">
                        </div>

                        <!-- <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-[100] pointer-events-none">
                            <div class="bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-slate-700/50 flex flex-col items-center">
                                <span class="font-bold">@{target.handle}</span>
                                <span class="text-[9px] text-emerald-400 font-mono">{target.count} replies</span>
                            </div>
                            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-900 -mt-[1px]"></div>
                        </div> -->
                    </a>
                {/each}
            {:else}
                <div class="flex flex-col items-center gap-2 opacity-50">
                    <i class="fa-regular fa-comments text-2xl text-slate-300"></i>
                    <span class="text-[11px] text-slate-400 italic">No significant interactions</span>
                </div>
            {/if}
        </div>
    </div>
</div>
