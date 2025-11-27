<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    export let heatmap: AnalyticsData['habits']['heatmap'] = [];

    // 1. Logic Lọc: Lấy từ ngày đầu tiên có bài viết đến hiện tại
    $: firstActiveIndex = heatmap.findIndex(h => h.count > 0);
    // Nếu tìm thấy post thì cắt từ đó, nếu không thì lấy 14 ngày cuối mặc định
    $: filteredHeatmap = (heatmap && heatmap.length > 0)
        ? (firstActiveIndex !== -1 ? heatmap.slice(firstActiveIndex) : heatmap.slice(-14))
        : [];

    // 2. Tính Max để vẽ chiều cao
    $: maxCount = Math.max(...filteredHeatmap.map(h => h.count), 1);
    $: totalPosts = filteredHeatmap.reduce((acc, h) => acc + h.count, 0);

    // Màu sắc cột
    function getBarColor(level: number) {
        if (level >= 3) return 'bg-emerald-600';
        if (level === 2) return 'bg-emerald-400';
        if (level === 1) return 'bg-emerald-300';
        return 'bg-slate-100 group-hover:bg-slate-200'; // Màu cho ngày 0 bài
    }
</script>

<div class="card-soft p-5">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
            <i class="fa-solid fa-chart-column text-[11px] text-slate-400"></i> Posting Rhythm
        </h3>
        <div class="text-[9px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
            {totalPosts} posts
        </div>
    </div>

    {#if filteredHeatmap.length > 0}
        <div class="flex flex-col justify-end h-28 w-full">
            
            <div class="flex items-end gap-px w-full h-full">
                {#each filteredHeatmap as day}
                    <div class="relative group flex-1 h-full flex items-end">
                        
                        <div 
                            class="w-full rounded-sm transition-all duration-200 {getBarColor(day.level)}"
                            style="height: {day.count > 0 ? Math.max((day.count / maxCount) * 100, 15) : 15}%"
                        ></div>

                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center z-50 pointer-events-none min-w-max">
                            <div class="bg-slate-900 text-white text-[9px] px-2 py-1 rounded shadow-xl font-mono border border-slate-700/50">
                                <div class="font-bold text-emerald-400 text-center">{day.count} posts</div>
                                <div class="text-slate-300 text-[8px] text-center">{day.date}</div>
                            </div>
                            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-900 -mt-[1px]"></div>
                        </div>

                    </div>
                {/each}
            </div>

            <div class="flex justify-between text-[9px] text-slate-400 font-mono mt-1 pt-2 border-t border-slate-100 w-full">
                <span>{filteredHeatmap[0]?.date}</span>
                <span>{filteredHeatmap[filteredHeatmap.length - 1]?.date}</span>
            </div>
        </div>
    {:else}
        <div class="h-28 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-100">
            <span class="text-[10px]">No activity data available</span>
        </div>
    {/if}
</div>
