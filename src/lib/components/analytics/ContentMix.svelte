<script lang="ts">
    export let data: {
        hashtags: { text: string; count: number }[];
        mentions: { handle: string; count: number }[];
        keywords: { text: string; count: number }[];
    };
</script>

<section class="b-card overflow-hidden">
    <div class="px-5 py-3 border-b border-slate-800 bg-slate-950/80 flex items-center gap-2">
        <i class="fa-solid fa-fingerprint text-[13px] text-slate-300"></i>
        <h4 class="text-[13px] font-medium text-slate-50">Content Mix & Network</h4>
    </div>

    <div class="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        
        <div class="p-5">
            <h5 class="text-[10px] uppercase tracking-widest text-slate-500 mb-3 font-mono flex items-center gap-2">
                <i class="fa-solid fa-font text-[10px]"></i> Keywords
            </h5>
            <div class="flex flex-wrap gap-2">
                {#if data.keywords.length === 0}
                    <span class="text-[11px] text-slate-500 italic">No significant data</span>
                {/if}
                {#each data.keywords as item}
                    <span class="inline-flex items-center px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-slate-600 transition cursor-default">
                        {item.text}
                        <span class="ml-1.5 text-[9px] text-slate-500 font-mono">{item.count}</span>
                    </span>
                {/each}
            </div>
        </div>

        <div class="p-5">
            <h5 class="text-[10px] uppercase tracking-widest text-sky-500/80 mb-3 font-mono flex items-center gap-2">
                <i class="fa-solid fa-at text-[10px]"></i> Mentioned
            </h5>
            <ul class="space-y-2">
                {#if data.mentions.length === 0}
                    <li class="text-[11px] text-slate-500 italic">No mentions found</li>
                {/if}
                {#each data.mentions as item}
                    <li class="flex justify-between items-center group cursor-pointer">
                        <a href="https://x.com/{item.handle.replace('@','')}" target="_blank" class="text-[12px] text-sky-400 hover:text-sky-300 font-medium truncate max-w-[120px]">
                            {item.handle}
                        </a>
                        <div class="flex items-center gap-2">
                            <div class="h-[2px] w-8 bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full bg-sky-500/50" style="width: {Math.min(item.count * 10, 100)}%"></div>
                            </div>
                            <span class="text-[10px] text-slate-500 font-mono w-3 text-right">{item.count}</span>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="p-5">
            <h5 class="text-[10px] uppercase tracking-widest text-emerald-500/80 mb-3 font-mono flex items-center gap-2">
                <i class="fa-solid fa-hashtag text-[10px]"></i> Hashtags
            </h5>
            <div class="space-y-2">
                {#if data.hashtags.length === 0}
                    <span class="text-[11px] text-slate-500 italic">No hashtags used</span>
                {/if}
                {#each data.hashtags as item}
                    <div class="flex items-center justify-between text-[12px]">
                        <span class="text-emerald-200/80">#{item.text.replace('#','')}</span>
                        <span class="text-[10px] text-slate-500 font-mono">x{item.count}</span>
                    </div>
                {/each}
            </div>
        </div>

    </div>
</section>
