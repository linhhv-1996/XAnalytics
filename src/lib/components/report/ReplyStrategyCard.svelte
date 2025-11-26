<script lang="ts">
    const mockData = {
        replyCount: 20,
        avgLength: 142,
        archetype: "Value Builder",
        metrics: { valueScore: 85, spamScore: 5 },
        topTargets: [
            { handle: 'elonmusk', count: 5, avatar: 'https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg' },
            { handle: 'levelsio', count: 3, avatar: 'https://pbs.twimg.com/profile_images/1745930436746371072/P22q8pX__400x400.jpg' },
            { handle: 'dagorenouf', count: 2, avatar: 'https://pbs.twimg.com/profile_images/1609865775275245569/k1jX-yX__400x400.jpg' }
        ]
    };
    let data = mockData;

    function getArchetypeConfig(type: string) {
        switch (type) {
            case 'Value Builder': return { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: 'fa-solid fa-gem' };
            case 'Link Spammer': return { color: 'text-rose-700 bg-rose-50 border-rose-200', icon: 'fa-solid fa-link' };
            case 'NPC / Bot': return { color: 'text-slate-700 bg-slate-100 border-slate-200', icon: 'fa-solid fa-robot' };
            default: return { color: 'text-sky-700 bg-sky-50 border-sky-200', icon: 'fa-solid fa-comments' };
        }
    }
    $: config = getArchetypeConfig(data.archetype);
</script>

<div class="card-soft p-4 flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
            <i class="fa-solid fa-reply-all text-[11px] text-slate-400"></i> Reply Strategy
        </h3>
        <span class="text-[9px] text-slate-400 font-mono">Last {data.replyCount} replies</span>
    </div>

    <div class="text-center mb-5 py-3 rounded-lg border border-slate-200 bg-slate-50/50">
        <div class="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Detected Persona</div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold font-mono {config.color}">
            <i class="{config.icon}"></i>
            {data.archetype}
        </div>
        <p class="text-[10px] text-slate-500 mt-2 px-2 leading-relaxed">
            Avg. length: <span class="text-slate-700 font-mono font-bold">{data.avgLength} chars</span> / reply
        </p>
    </div>

    <div class="space-y-3.5">
        <div>
            <div class="flex justify-between text-[10px] mb-1">
                <span class="text-slate-500">Value Added</span>
                <span class="text-emerald-600 font-mono font-bold">{data.metrics.valueScore}%</span>
            </div>
            <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" style="width: {data.metrics.valueScore}%"></div>
            </div>
        </div>

        <div>
            <div class="flex justify-between text-[10px] mb-1">
                <span class="text-slate-500">Spam / Low Effort</span>
                <span class="text-rose-500 font-mono font-bold">{data.metrics.spamScore}%</span>
            </div>
            <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-rose-500 rounded-full transition-all duration-500" style="width: {data.metrics.spamScore}%"></div>
            </div>
        </div>
    </div>

    {#if data.topTargets && data.topTargets.length > 0}
        <div class="mt-auto pt-5 border-t border-slate-100">
            <div class="flex justify-between items-center mb-3">
                <span class="text-[10px] text-slate-500 uppercase tracking-wider">Often Replies To</span>
                <i class="fa-solid fa-user-group text-slate-400 text-[10px]"></i>
            </div>
            
            <div class="space-y-2.5">
                {#each data.topTargets as target}
                    <div class="flex items-center justify-between group cursor-default">
                        <div class="flex items-center gap-2.5 overflow-hidden">
                            <div class="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 relative">
                                <img src={target.avatar} alt={target.handle} class="w-full h-full object-cover">
                            </div>
                            <span class="text-[11px] text-slate-600 font-mono truncate group-hover:text-emerald-600 transition-colors">
                                @{target.handle}
                            </span>
                        </div>
                        <span class="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                            {target.count}x
                        </span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
