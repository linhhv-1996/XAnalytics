<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let topics: AnalyticsData['topics']['list'] = [];
    export let handle: string = ""; // [!code ++] Nhận handle để tạo link search

    // Hàm tạo link search chuẩn X
    function getSearchLink(keyword: string) {
        const cleanHandle = handle.replace('@', ''); // Xóa @ nếu thừa
        const cleanKeyword = keyword.replace('#', '');
        // Query: keyword (from:username)
        const query = `${cleanKeyword} (from:${cleanHandle})`;
        return `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=top`;
    }

    // Style phân cấp: Top 1 nổi nhất, Top 3 vừa vừa, còn lại base
    function getTagStyle(index: number) {
        if (index === 0) return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100';
        if (index < 3) return 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100';
        return 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-700';
    }
</script>

<div class="card-soft p-4 h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
            <i class="fa-solid fa-quote-right text-[11px] text-slate-400"></i> Top Tweeted Keywords
        </h3>
        <span class="text-[9px] text-slate-400 font-mono">Frequency</span>
    </div>

    {#if topics.length > 0}
        <div class="flex flex-wrap gap-2 content-start">
            {#each topics as topic, i}
                <a 
                    href={getSearchLink(topic.text)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all duration-200 {getTagStyle(i)}"
                    title="Search usage of '{topic.text}' by @{handle}"
                >
                    <span class="text-[11px] font-medium leading-none">
                        {#if topic.type === 'hashtag'}
                            <span class="opacity-60 mr-[1px]">#</span>
                        {/if}
                        {topic.text.replace('#', '')}
                    </span>

                    <span class="flex items-center justify-center h-4 min-w-[16px] px-1 rounded text-[9px] font-mono font-bold leading-none
                        {i === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700'} transition-colors">
                        {topic.count}
                    </span>
                </a>
            {/each}
        </div>
    {:else}
        <div class="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[100px]">
            <span class="text-[11px]">No keywords found</span>
        </div>
    {/if}
</div>
