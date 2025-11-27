<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let topics: AnalyticsData['topics']['list'] = [];
    export let handle: string = "";

    // 1. Tìm Max/Min để tính toán tỉ lệ scale
    $: maxCount = Math.max(...topics.map(t => t.count), 1);
    $: minCount = Math.min(...topics.map(t => t.count), 0);

    function getSearchLink(keyword: string) {
        const cleanHandle = handle.replace('@', '');
        const cleanKeyword = keyword.replace('#', '');
        const query = `${cleanKeyword} (from:${cleanHandle})`;
        return `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=top`;
    }

    // 2. Hàm tính Size chữ dựa trên tần suất (Linear Scale)
    // Min size: 12px, Max size: 24px
    function getSize(count: number) {
        if (topics.length === 0 || maxCount === minCount) return '13px';
        
        const minPx = 10;
        const maxPx = 20;
        const size = minPx + ((count - minCount) / (maxCount - minCount)) * (maxPx - minPx);
        return `${size.toFixed(1)}px`;
    }

    // 3. Hàm tính độ đậm nhạt (Visual Hierarchy)
    function getStyle(count: number, index: number) {
        // Top 1: Đen tuyền, đậm nhất
        if (index === 0) return 'text-slate-900 font-black border-b-2 border-slate-900';
        
        const ratio = (count - minCount) / (maxCount - minCount);
        
        // Phân cấp dựa trên tỉ lệ % so với max
        if (ratio > 0.7) return 'text-slate-800 font-bold border-b border-slate-300';
        if (ratio > 0.4) return 'text-slate-600 font-semibold border-b border-slate-100';
        return 'text-slate-400 font-medium';
    }
</script>

<div class="card-soft p-5 h-full flex flex-col justify-between">
    <div class="flex items-center justify-between mb-5">
        <div class="flex items-center justify-between mb-0">
        <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
            <i class="fa-solid fa-tags text-[11px] text-slate-400"></i> Frequent Keywords
        </h3>
    </div>
    </div>

    {#if topics.length > 0}
        <div class="flex flex-wrap items-baseline gap-x-4 gap-y-3 content-start">
            {#each topics as topic, i}
                <a 
                    href={getSearchLink(topic.text)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="group relative inline-flex items-center transition-all duration-200 hover:text-emerald-600 hover:border-emerald-500 leading-none {getStyle(topic.count, i)}"
                    style="font-size: {getSize(topic.count)};"
                >
                    {#if topic.type === 'hashtag'}
                        <span class="opacity-30 mr-[1px] text-[0.8em] font-normal">#</span>
                    {/if}
                    
                    {topic.text.replace('#', '')}

                    <span class="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono whitespace-nowrap z-10">
                        {topic.count}
                    </span>
                </a>
            {/each}
        </div>
    {:else}
        <div class="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[120px]">
            <i class="fa-regular fa-comment-dots text-2xl mb-2 opacity-20"></i>
            <span class="text-[11px]">No clear topics found</span>
        </div>
    {/if}
</div>
