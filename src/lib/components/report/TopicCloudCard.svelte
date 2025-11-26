<script lang="ts">
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

    function getTagStyle(index: number) {
        if (index === 0) return 'bg-emerald-50 text-emerald-700 border-emerald-200 py-1.5 px-3 font-semibold';
        if (index < 3) return 'bg-sky-50 text-sky-700 border-sky-200 py-1 px-2.5';
        return 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 py-1 px-2';
    }
</script>

<div class="card-soft p-4 h-full">
    <div class="flex items-center justify-between mb-3">
        <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
            <i class="fa-solid fa-hashtag text-[11px] text-slate-400"></i> Topic Cloud
        </h3>
        <span class="text-[9px] text-slate-400 font-mono">Top Keywords</span>
    </div>

    <div class="flex flex-wrap gap-2 content-start">
        {#each topics as topic, i}
            <div class="rounded-md border font-mono transition-all cursor-default hover:scale-105 flex items-center gap-1.5 text-[10px] {getTagStyle(i)}">
                <span>{topic.tag}</span>
                {#if i < 3}
                    <span class="opacity-60 border-l pl-1.5 ml-0.5 border-current">{topic.count}</span>
                {/if}
            </div>
        {/each}
    </div>
</div>
