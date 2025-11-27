<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let profile: AnalyticsData['profile'];
    export let habits: AnalyticsData['habits'];
    export let network: AnalyticsData['network'];
    export let traffic: AnalyticsData['traffic'];

    // Helper màu cho Heatmap (Light Theme)
    function getLevelColor(level: number): string {
        switch (level) {
            case 3: return 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]';
            case 2: return 'bg-emerald-300';
            case 1: return 'bg-emerald-100';
            default: return 'bg-slate-100';
        }
    }

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

<div class="space-y-4">
    <div class="card flex flex-col overflow-hidden">
        <div class="h-20 w-full bg-gradient-to-r from-slate-900 to-slate-700 relative" 
             style={profile.banner ? `background-image: url('${profile.banner}'); background-size: cover;` : ''}>
             {#if profile.banner}<div class="absolute inset-0 bg-black/10"></div>{/if}
        </div>
        
        <div class="px-4 pb-4 -mt-10 flex-1 flex flex-col relative z-10">
            <div class="flex justify-between items-end">
                <img src={profile.avatarUrl.replace('_normal', '_400x400')} class="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover bg-white" alt="{profile.name}">
                <span class="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-1 rounded-full border border-emerald-200 uppercase tracking-wide mb-1">{profile.grade} Tier</span>
            </div>
            <div class="mt-3">
                <h2 class="flex items-center gap-1.5 text-[15px] font-semibold text-slate-900">
                    {profile.name} <i class="fa-solid fa-certificate text-sky-500 text-[11px]"></i>
                </h2>
                <div class="text-[11px] text-slate-500 font-mono mt-0.5">{profile.handle}</div>
            </div>
            <p class="mt-2 text-[11px] text-slate-600 leading-relaxed line-clamp-3">{@html profile.bio}</p>
            <div class="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                <div><div class="text-[13px] font-mono font-semibold text-slate-900">{profile.following}</div><div class="text-[11px] uppercase tracking-wide text-slate-500">Following</div></div>
                <div><div class="text-[13px] font-mono font-semibold text-slate-900">{profile.followers}</div><div class="text-[11px] uppercase tracking-wide text-slate-500">Followers</div></div>
                <div><div class="text-[13px] font-mono font-semibold text-slate-900">{profile.tweetsCount}</div><div class="text-[11px] uppercase tracking-wide text-slate-500">Posts</div></div>
            </div>
        </div>
    </div>

    <div class="card-soft p-4">
        <div class="flex justify-between items-center mb-2.5">
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-layer-group text-slate-400 text-[11px]"></i>
                <h3 class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                    35d Consistency
                </h3>
            </div>
            <div class="hidden sm:flex items-center gap-1 text-[9px] font-mono text-slate-400">
                <span>Less</span>
                <span class="w-2 h-2 rounded bg-slate-100 border border-slate-200"></span>
                <span class="w-2 h-2 rounded bg-emerald-400 border border-emerald-500/60"></span>
                <span>More</span>
            </div>
        </div>
        <div class="flex justify-center mt-1">
            <div class="heatmap-wrapper w-full">
                <div class="flex justify-end gap-[6px] text-[8px] text-slate-400 font-mono mb-1 pr-[2px]">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
                <div class="heatmap-grid-30">
                    {#each habits.heatmap as day}
                        <div class="heatmap-cell group cursor-pointer relative">
                            <div class="heatmap-cell-inner {getLevelColor(day.level)} group-hover:outline group-hover:outline-[1px] group-hover:outline-emerald-500/80 transition-all duration-200"></div>
                            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                <div class="bg-slate-900 text-white text-[11px] px-2 py-1 rounded shadow-xl font-mono whitespace-nowrap">
                                    <div class="font-bold">{day.date}</div>
                                    <div class="text-slate-300">{day.count} post{day.count !== 1 ? 's' : ''}</div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <div class="card-soft p-4">
        <div class="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                Networking Radar
            </h3>
            <span class="text-[9px] text-slate-400 font-mono">Top Mentions</span>
        </div>

        {#if network.topMentions.length > 0}
            <div class="space-y-1 text-[11px]">
                {#each network.topMentions as mention, i}
                    <div class="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-2 min-w-0">
                            <span class="w-4 text-[11px] text-slate-400 font-mono">#{i + 1}</span>
                            <a href="https://x.com/{mention.handle}" target="_blank" rel="noopener noreferrer" class="text-sky-600 font-medium truncate hover:underline">@{mention.handle}</a>
                        </div>
                        <span class="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">{mention.count}x</span>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="h-20 flex items-center justify-center text-slate-400 text-xs italic">No data</div>
        {/if}
    </div>

    <div class="card-soft p-4">
        <div class="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                Traffic Flow
            </h3>
            <span class="text-[9px] text-slate-400 font-mono">Top Links</span>
        </div>

        {#if traffic.topDomains.length > 0}
            <div class="space-y-1 text-[11px]">
                {#each traffic.topDomains as domain, i}
                    <div class="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors">
                        <div class="flex items-center gap-2 min-w-0">
                            <span class="w-4 text-[11px] text-slate-400 font-mono">#{i + 1}</span>
                            {#if getDomainLink(domain.domain)}
                                <a href={getDomainLink(domain.domain)} target="_blank" rel="noopener noreferrer" class="text-slate-900 truncate hover:text-emerald-600 hover:underline">{domain.domain}</a>
                            {:else}
                                <span class="text-slate-900 truncate">{domain.domain}</span>
                            {/if}
                        </div>
                        <span class="text-[11px] font-mono text-emerald-600 font-semibold">{getTrafficPercent(domain.count)}%</span>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="h-20 flex items-center justify-center text-slate-400 text-xs italic">No data</div>
        {/if}
    </div>
</div>
