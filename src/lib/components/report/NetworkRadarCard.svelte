<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    export let network: AnalyticsData['network'];
</script>

<div class="card-soft p-4">
    <div class="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
            <i class="fa-solid fa-users-viewfinder text-[11px] text-slate-400"></i> Networking Radar
        </h3>
        <span class="text-[9px] text-slate-400 font-mono">Top Mentions</span>
    </div>

    {#if network.topMentions.length > 0}
        <div class="space-y-1 text-[11px]">
            {#each network.topMentions as mention, i}
                <div class="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors group">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="w-4 text-[10px] text-slate-400 font-mono">#{i + 1}</span>
                        <a href="https://x.com/{mention.handle}" target="_blank" rel="noopener noreferrer" class="text-sky-600 font-medium truncate hover:underline">@{mention.handle}</a>
                    </div>
                    <span class="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono group-hover:bg-white group-hover:shadow-sm transition-all">{mention.count}x</span>
                </div>
            {/each}
        </div>
    {:else}
        <div class="h-20 flex items-center justify-center text-slate-400 text-xs italic">No data</div>
    {/if}
</div>
