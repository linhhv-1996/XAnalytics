<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    export let traffic: AnalyticsData['traffic'];

    $: totalTraffic = traffic.topDomains.reduce((acc, item) => acc + item.count, 0);

    function getTrafficPercent(count: number) {
        if (totalTraffic === 0) return 0;
        return Math.round((count / totalTraffic) * 100);
    }

    function getDomainLink(domain: string): string | null {
        const d = domain.toLowerCase();
        if (d.includes('.')) return `https://${d}`;
        if (d === 'youtube') return 'https://youtube.com';
        if (d === 'gumroad') return 'https://gumroad.com';
        if (d === 'github') return 'https://github.com';
        return null;
    }
</script>

<div class="card-soft p-4">
    <div class="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
            <i class="fa-solid fa-arrow-right-arrow-left text-[11px] text-slate-400"></i> Traffic Flow
        </h3>
        <span class="text-[9px] text-slate-400 font-mono">Top Links</span>
    </div>

    {#if traffic.topDomains.length > 0}
        <div class="space-y-1 text-[11px]">
            {#each traffic.topDomains as domain, i}
                <div class="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors group">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="w-4 text-[10px] text-slate-400 font-mono">#{i + 1}</span>
                        {#if getDomainLink(domain.domain)}
                            <a href={getDomainLink(domain.domain)} target="_blank" rel="noopener noreferrer" class="text-slate-900 truncate hover:text-emerald-600 hover:underline font-medium">{domain.domain}</a>
                        {:else}
                            <span class="text-slate-900 truncate font-medium">{domain.domain}</span>
                        {/if}
                    </div>
                    <span class="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded group-hover:bg-white group-hover:shadow-sm transition-all">{getTrafficPercent(domain.count)}%</span>
                </div>
            {/each}
        </div>
    {:else}
        <div class="h-20 flex items-center justify-center text-slate-400 text-xs italic">No data</div>
    {/if}
</div>
