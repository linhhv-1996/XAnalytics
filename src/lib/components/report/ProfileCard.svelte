<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let profile: AnalyticsData['profile'];
    export let habits: AnalyticsData['habits'];
    export let network: AnalyticsData['network'];
    export let traffic: AnalyticsData['traffic'];

    // Helper màu cho Heatmap
    function getLevelColor(level: number): string {
        switch (level) {
            case 3: return 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]';
            case 2: return 'bg-emerald-600';
            case 1: return 'bg-emerald-900/70';
            default: return 'bg-zinc-800/40';
        }
    }

    // Helper tính % cho Traffic
    $: totalTraffic = traffic.topDomains.reduce((acc, item) => acc + item.count, 0);
    
    function getTrafficPercent(count: number) {
        if (totalTraffic === 0) return 0;
        return Math.round((count / totalTraffic) * 100);
    }

    // Helper lấy link cho Traffic Domain
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
    
    <div class="glass-panel rounded-xl overflow-hidden flex flex-col relative group">
        <div class="h-20 w-full bg-zinc-800 relative rounded-t-xl bg-cover bg-center" 
             style={profile.banner ? `background-image: url('${profile.banner}')` : ''}>
            <div class="absolute inset-0 bg-black/20"></div>
            {#if !profile.banner}
                <div class="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-700"></div>
            {/if}
        </div>
        
        <div class="px-4 pb-4 -mt-10 relative z-10 flex-1 flex flex-col">
            <div class="flex justify-between items-end">
                <img src={profile.avatarUrl.replace('_normal', '_400x400')} class="w-16 h-16 rounded-full border-4 border-[#18181b] shadow-lg object-cover bg-zinc-900" alt="{profile.name}">
                <span class="bg-zinc-800 text-zinc-300 text-[9px] font-bold px-2 py-1 rounded border border-zinc-700 uppercase tracking-wide mb-1.5">{profile.grade} Tier</span>
            </div>
            <div class="mt-2.5">
                <h1 class="font-bold text-white text-[15px] leading-none flex items-center gap-1">{profile.name} <i class="fa-solid fa-certificate text-blue-400 text-[11px]"></i></h1>
                <div class="text-zinc-500 text-[11px] font-mono mt-0.5">{profile.handle}</div>
            </div>
            <p class="text-zinc-400 text-[11px] mt-2 leading-relaxed line-clamp-3">{@html profile.bio}</p>
            <div class="grid grid-cols-3 gap-2 mt-auto pt-3 border-t border-zinc-800/50">
                <div><div class="text-white font-bold text-[13px] font-mono">{profile.following}</div><div class="text-[9px] text-zinc-600 uppercase tracking-wider">Following</div></div>
                <div><div class="text-white font-bold text-[13px] font-mono">{profile.followers}</div><div class="text-[9px] text-zinc-600 uppercase tracking-wider">Followers</div></div>
                <div><div class="text-white font-bold text-[13px] font-mono">{profile.tweetsCount}</div><div class="text-[9px] text-zinc-600 uppercase tracking-wider">Posts</div></div>
            </div>
        </div>
    </div>

    <div class="glass-panel rounded-xl p-4">
        <div class="flex justify-between items-center mb-2.5">
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-layer-group text-zinc-500 text-[11px]"></i>
                <h3 class="text-zinc-300 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                    35d Consistency
                </h3>
            </div>
            <div class="flex items-center gap-2">
                <div class="hidden sm:flex items-center gap-0.5 text-[8px] text-zinc-500">
                    <span class="mr-1">Less</span>
                    <div class="w-2 h-2 rounded-[1px] bg-zinc-800"></div>
                    <div class="w-2 h-2 rounded-[1px] bg-emerald-500"></div>
                    <span class="ml-1">More</span>
                </div>
            </div>
        </div>
        <div class="flex justify-center mt-1">
            <div class="heatmap-wrapper w-full">
                <div class="flex justify-end gap-[6px] text-[8px] text-zinc-500 font-mono mb-1 pr-[2px]">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
                <div class="heatmap-grid-30">
                    {#each habits.heatmap as day}
                        <div class="heatmap-cell group cursor-pointer relative">
                            <div class="heatmap-cell-inner {getLevelColor(day.level)} group-hover:outline group-hover:outline-[1px] group-hover:outline-white/70 transition-all duration-200"></div>
                            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                <div class="bg-zinc-900 text-white text-[10px] px-2 py-1 rounded border border-zinc-700 whitespace-nowrap shadow-xl font-mono">
                                    <div class="font-bold">{day.date}</div>
                                    <div class="text-zinc-400">{day.count} post{day.count !== 1 ? 's' : ''}</div>
                                </div>
                                <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-700"></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <div class="glass-panel rounded-xl p-4 flex flex-col relative overflow-hidden">
        <div class="flex items-center justify-between mb-2.5">
            <h3 class="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                Networking Radar
            </h3>
            <span class="text-[9px] text-zinc-500 font-mono">Top Mentions</span>
        </div>

        {#if network.topMentions.length > 0}
            <div class="rounded-lg border border-zinc-800/80 overflow-hidden text-xs">
                {#each network.topMentions as mention, i}
                    <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 hover:bg-zinc-900/60 transition-colors last:border-0">
                        <div class="flex items-center gap-2 min-w-0">
                            <span class="w-4 text-[10px] text-zinc-500 font-mono">#{i + 1}</span>
                            <a href="https://x.com/{mention.handle}" target="_blank" rel="noopener noreferrer" class="text-blue-400 font-medium truncate hover:underline">@{mention.handle}</a>
                        </div>
                        <span class="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">{mention.count}x</span>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="rounded-lg border border-zinc-800/80 overflow-hidden text-xs h-[100px] relative">
                <div class="opacity-20 blur-sm pointer-events-none select-none filter grayscale">
                    <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80">
                        <div class="flex items-center gap-2"><span class="w-4">#1</span><span>@elonmusk</span></div>
                        <span>12x</span>
                    </div>
                    <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80">
                        <div class="flex items-center gap-2"><span class="w-4">#2</span><span>@SpaceX</span></div>
                        <span>8x</span>
                    </div>
                    <div class="flex items-center justify-between px-3 py-2">
                        <div class="flex items-center gap-2"><span class="w-4">#3</span><span>@tesla</span></div>
                        <span>5x</span>
                    </div>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-[10px] text-zinc-500 font-mono bg-black/50 px-2 py-1 rounded border border-zinc-800 backdrop-blur-md">No Data</span>
                </div>
            </div>
        {/if}
    </div>

    <div class="glass-panel rounded-xl p-4 flex flex-col relative overflow-hidden">
        <div class="flex items-center justify-between mb-2.5">
            <h3 class="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                Traffic Flow
            </h3>
            <span class="text-[9px] text-zinc-500 font-mono">Top Links</span>
        </div>

        {#if traffic.topDomains.length > 0}
            <div class="rounded-lg border border-zinc-800/80 overflow-hidden text-xs">
                {#each traffic.topDomains as domain, i}
                    <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 hover:bg-zinc-900/60 transition-colors last:border-0">
                        <div class="flex items-center gap-2 min-w-0">
                            <span class="w-4 text-[10px] text-zinc-500 font-mono">#{i + 1}</span>
                            
                            {#if getDomainLink(domain.domain)}
                                <a href={getDomainLink(domain.domain)} 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   class="text-zinc-200 truncate max-w-[120px] hover:text-emerald-400 hover:underline transition-colors">
                                    {domain.domain}
                                </a>
                            {:else}
                                <span class="text-zinc-200 truncate max-w-[120px] cursor-default">{domain.domain}</span>
                            {/if}
                        </div>
                        <span class="text-[11px] font-mono text-emerald-400 font-semibold">
                            {getTrafficPercent(domain.count)}%
                        </span>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="rounded-lg border border-zinc-800/80 overflow-hidden text-xs h-[100px] relative">
                <div class="opacity-20 blur-sm pointer-events-none select-none filter grayscale">
                    <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80">
                        <div class="flex items-center gap-2"><span class="w-4">#1</span><span>youtube.com</span></div>
                        <span class="text-emerald-400">45%</span>
                    </div>
                    <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80">
                        <div class="flex items-center gap-2"><span class="w-4">#2</span><span>github.com</span></div>
                        <span class="text-emerald-400">25%</span>
                    </div>
                    <div class="flex items-center justify-between px-3 py-2">
                        <div class="flex items-center gap-2"><span class="w-4">#3</span><span>gumroad.com</span></div>
                        <span class="text-emerald-400">15%</span>
                    </div>
                </div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-[10px] text-zinc-500 font-mono bg-black/50 px-2 py-1 rounded border border-zinc-800 backdrop-blur-md">No Data</span>
                </div>
            </div>
        {/if}
    </div>

</div>
