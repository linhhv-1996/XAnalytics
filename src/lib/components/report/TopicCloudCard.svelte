<script lang="ts">
    // Mock data: Top keywords/hashtags
    export let topics = [
        { tag: '#SaaS', count: 12 },
        { tag: 'Building', count: 8 },
        { tag: '#IndieHacker', count: 7 },
        { tag: 'Growth', count: 5 },
        { tag: 'AI', count: 5 },
        { tag: 'Marketing', count: 4 },
        { tag: 'Revenue', count: 3 },
        { tag: '#BuildInPublic', count: 3 },
        { tag: 'Launch', count: 2 },
        { tag: 'Design', count: 2 }
    ];

    // Helper: Style động dựa trên thứ hạng (Top 3 nổi bật hơn)
    function getTagStyle(index: number) {
        if (index === 0) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-sm py-1.5 px-3'; // Top 1
        if (index < 3) return 'bg-blue-500/15 text-blue-300 border-blue-500/30 text-[11px] py-1 px-2.5'; // Top 2-3
        return 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600 text-[10px] py-1 px-2'; // Còn lại
    }
</script>

<div class="glass-panel rounded-xl p-4 h-full">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-zinc-400 text-[10px] font-bold uppercase flex items-center gap-2">
            <i class="fa-solid fa-hashtag text-[11px] text-zinc-500"></i> Topic Cloud
        </h3>
        <span class="text-[9px] text-zinc-600 font-mono">Top Keywords</span>
    </div>

    <div class="flex flex-wrap gap-2 content-start">
        {#each topics as topic, i}
            <div class="rounded-md border font-mono font-medium transition-all cursor-default hover:scale-105 flex items-center gap-1.5 {getTagStyle(i)}">
                <span>{topic.tag}</span>
                {#if i < 3}
                    <span class="text-[9px] opacity-60 border-l border-white/20 pl-1.5 ml-0.5">{topic.count}</span>
                {/if}
            </div>
        {/each}
    </div>
    
    {#if topics.length === 0}
        <div class="h-32 flex items-center justify-center text-zinc-600 text-xs italic">
            No enough data to analyze topics.
        </div>
    {/if}
</div>
