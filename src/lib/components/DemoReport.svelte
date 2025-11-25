<script lang="ts">
    // Mock data for charts (Hardcoded to match index.html visual output)
    const heatmapCells: string[] = [];
    const mockLevelColors = [
        'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]',
        'bg-emerald-600',
        'bg-emerald-900/70',
        'bg-zinc-800/40'
    ];
    for (let i = 0; i < 35; i++) {
        heatmapCells.push(mockLevelColors[i % mockLevelColors.length]);
    }
    
    // Best Time Bar Chart Data
    const timeBars = [2,2,0,0,5,10,20,30,20,10,5,5,10,20,40,60,80,100,70,50,30,10,5,2];
</script>

<div class="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-5 items-start">
    <div class="space-y-4">
        <div class="glass-panel rounded-xl overflow-hidden flex flex-col relative group">
            <div class="h-20 w-full bg-gradient-to-r from-zinc-800 to-zinc-700 relative rounded-t-xl">
                <div class="absolute inset-0 bg-black/20"></div>
            </div>
            <div class="px-4 pb-4 -mt-10 relative z-10 flex-1 flex flex-col">
                <div class="flex justify-between items-end">
                    <img
                        src="https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg"
                        class="w-16 h-16 rounded-full border-4 border-[#18181b] shadow-lg"
                        alt="Elon Musk Avatar"
                    >
                    <span
                        class="bg-zinc-800 text-zinc-300 text-[9px] font-bold px-2 py-1 rounded border border-zinc-700 uppercase tracking-wide mb-1.5"
                    >
                        Alpha Tier
                    </span>
                </div>

                <div class="mt-2.5">
                    <h1 class="font-bold text-white text-[15px] leading-none flex items-center gap-1">
                        Elon Musk
                        <i class="fa-solid fa-certificate text-blue-400 text-[11px]"></i>
                    </h1>
                    <div class="text-zinc-500 text-[11px] font-mono mt-0.5">@elonmusk</div>
                </div>

                <p class="text-zinc-400 text-[11px] mt-2 leading-relaxed line-clamp-2">
                    Exploring the universe. Tech & memes. CEO of SpaceX, Tesla and X.
                </p>

                <div class="grid grid-cols-3 gap-2 mt-auto pt-3 border-t border-zinc-800/50">
                    <div>
                        <div class="text-white font-bold text-[13px] font-mono">500</div>
                        <div class="text-[9px] text-zinc-600 uppercase tracking-wider">Following</div>
                    </div>
                    <div>
                        <div class="flex items-center gap-1">
                            <span class="text-white font-bold text-[13px] font-mono">164M</span>
                        </div>
                        <div class="text-[9px] text-zinc-600 uppercase tracking-wider">Followers</div>
                    </div>
                    <div>
                        <div class="text-white font-bold text-[13px] font-mono">42k</div>
                        <div class="text-[9px] text-zinc-600 uppercase tracking-wider">Posts</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="glass-panel rounded-xl p-4">
            <div class="flex justify-between items-center mb-2.5">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-layer-group text-zinc-500 text-[11px]"></i>
                    <h3 class="text-zinc-300 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                        30d Consistency
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
                        {#each heatmapCells as bg}
                            <div class="heatmap-cell group cursor-pointer">
                                <div class="heatmap-cell-inner {bg} group-hover:outline group-hover:outline-[1px] group-hover:outline-white/70"></div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
        <div class="glass-panel rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-zinc-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                    <i class="fa-solid fa-fingerprint text-[11px] text-zinc-500"></i>
                    Topic Fingerprint
                </h3>
                <span class="text-[9px] text-zinc-600 font-mono">Based on last 50 posts</span>
            </div>
            <div class="flex flex-wrap gap-2">
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium font-mono group cursor-help relative">
                    <span>🚀 Space</span>
                    <span class="text-[9px] opacity-70 border-l border-emerald-500/30 pl-1.5 ml-0.5">High Viral</span>
                </div>
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[11px] font-medium font-mono">
                    <span>⚖️ Politics</span>
                    <span class="text-[9px] opacity-70 border-l border-orange-500/30 pl-1.5 ml-0.5">Debate</span>
                </div>
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-medium font-mono">
                    <span>🤖 AI & Tech</span>
                </div>
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px] font-mono">
                    <span>🚗 EV</span>
                </div>
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px] font-mono">
                    <span>😂 Memes</span>
                </div>
            </div>
        </div>
        <div class="glass-panel rounded-xl p-4 flex flex-col">
            <div class="flex items-center justify-between mb-2.5">
                <h3 class="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                    Networking Radar
                </h3>
                <span class="text-[9px] text-zinc-500 font-mono">Top Mentions/Quotes</span>
            </div>
            <div class="rounded-lg border border-zinc-800/80 overflow-hidden text-xs">
                <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 hover:bg-zinc-900/60 transition-colors">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="w-4 text-[10px] text-zinc-500 font-mono">#1</span>
                        <span class="text-blue-400 font-medium truncate">@SpaceX</span>
                    </div>
                    <span class="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">12x</span>
                </div>
                <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 hover:bg-zinc-900/60 transition-colors">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="w-4 text-[10px] text-zinc-500 font-mono">#2</span>
                        <span class="text-blue-400 font-medium truncate">@Tesla</span>
                    </div>
                    <span class="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">8x</span>
                </div>
                <div class="flex items-center justify-between px-3 py-2 hover:bg-zinc-900/60 transition-colors">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="w-4 text-[10px] text-zinc-500 font-mono">#3</span>
                        <span class="text-white font-medium truncate">@mayemusk</span>
                    </div>
                    <span class="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">3x</span>
                </div>
            </div>
        </div>
        <div class="glass-panel rounded-xl p-4 flex flex-col">
            <div class="flex items-center justify-between mb-2.5">
                <h3 class="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                    Traffic Flow
                </h3>
                <span class="text-[9px] text-zinc-500 font-mono">Top Links</span>
            </div>
            <div class="rounded-lg border border-zinc-800/80 overflow-hidden text-xs">
                <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 hover:bg-zinc-900/60 transition-colors">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="text-zinc-200 truncate">spacex.com</span>
                    </div>
                    <span class="text-[11px] font-mono text-emerald-400 font-semibold">45%</span>
                </div>
                <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 hover:bg-zinc-900/60 transition-colors">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="text-zinc-200 truncate">tesla.com</span>
                    </div>
                    <span class="text-[11px] font-mono text-zinc-300 font-semibold">25%</span>
                </div>
                <div class="flex items-center justify-between px-3 py-2 hover:bg-zinc-900/60 transition-colors">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="text-zinc-200 truncate">x.com</span>
                    </div>
                    <span class="text-[11px] font-mono text-zinc-300 font-semibold">15%</span>
                </div>
            </div>
        </div>
    </div>
    <div class="space-y-4">
        <div class="glass-panel rounded-xl flex flex-col relative overflow-hidden group">
            <div class="flex items-center justify-between px-4 pt-4 pb-2.5 border-b border-zinc-800/60">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-signal text-zinc-400 text-[11px]"></i>
                    <h3 class="text-zinc-200 text-[11px] font-bold uppercase tracking-wider">
                        Signal Snapshot
                    </h3>
                </div>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[9px] font-mono text-emerald-300">
                    <i class="fa-solid fa-bolt text-[8px]"></i>
                    Breakout Post
                </span>
            </div>
            <div class="px-4 pb-4 pt-3 space-y-3.5">
                <div class="flex items-center gap-2 text-[11px] text-zinc-500">
                    <div class="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-700 overflow-hidden">
                        <img src="https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg" class="w-full h-full object-cover" alt="Avatar">
                    </div>
                    <span class="font-mono">Dec 07, 2023</span>
                </div>
                <div class="relative">
                    <i class="fa-solid fa-quote-left absolute -top-2 -left-3 text-zinc-800 text-3xl -z-10"></i>
                    <p class="text-[13px] md:text-[14px] text-zinc-200 leading-relaxed font-medium">
                        "Today was my last day at my 9-to-5. I quit my job to chase my dream of building my own SaaS..."
                    </p>
                </div>
                <div class="flex items-center gap-4 text-[11px] text-zinc-400 border-t border-zinc-800/60 pt-2.5">
                    <span class="flex items-center gap-1.5 text-zinc-200"><i class="fa-solid fa-heart"></i> 42k</span>
                    <span class="flex items-center gap-1.5"><i class="fa-regular fa-comment"></i> 4.9k</span>
                    <span class="ml-auto text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                        4.2× above baseline
                    </span>
                </div>
            </div>
        </div>
        <div class="glass-panel rounded-xl p-4">
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800/50">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-scale-balanced text-zinc-400 text-[11px]"></i>
                    <h3 class="text-zinc-300 text-[11px] font-bold uppercase tracking-wider">
                        Baseline Performance
                    </h3>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                    <div class="text-zinc-500 text-[10px] uppercase mb-1 font-medium">Avg Views</div>
                    <div class="text-lg font-bold text-white font-mono">2.5M</div>
                    <div class="w-full bg-zinc-800/50 h-1 mt-2 rounded-full overflow-hidden"><div class="bg-blue-500 h-full" style="width: 80%"></div></div>
                </div>
                <div>
                    <div class="text-zinc-500 text-[10px] uppercase mb-1 font-medium">Avg Likes</div>
                    <div class="text-lg font-bold text-white font-mono">45k</div>
                    <div class="w-full bg-zinc-800/50 h-1 mt-2 rounded-full overflow-hidden"><div class="bg-pink-500 h-full" style="width: 50%"></div></div>
                </div>
                <div>
                    <div class="text-zinc-500 text-[10px] uppercase mb-1 font-medium">Engagement</div>
                    <div class="text-lg font-bold text-emerald-400 font-mono">1.8%</div>
                    <div class="w-full bg-zinc-800/50 h-1 mt-2 rounded-full overflow-hidden"><div class="bg-emerald-500 h-full" style="width: 60%"></div></div>
                </div>
                <div>
                    <div class="text-zinc-500 text-[10px] uppercase mb-1 font-medium">Viral Odds</div>
                    <div class="text-lg font-bold text-yellow-400 font-mono">6.5%</div>
                    <div class="w-full bg-zinc-800/50 h-1 mt-2 rounded-full overflow-hidden"><div class="bg-yellow-500 h-full" style="width: 20%"></div></div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="glass-panel rounded-xl p-4">
                <h3 class="text-zinc-400 text-[10px] font-bold uppercase mb-3 flex items-center gap-2">
                    <i class="fa-solid fa-wallet text-[11px] text-zinc-500"></i> Monetization Mix
                </h3>
                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between text-[10px] text-zinc-400 mb-1">
                            <span>Value Posts (No link)</span>
                            <span class="text-white font-mono">85%</span>
                        </div>
                        <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div class="h-full bg-indigo-400" style="width: 85%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-[10px] text-zinc-400 mb-1">
                            <span>Promo/Plug (Has link)</span>
                            <span class="text-white font-mono">15%</span>
                        </div>
                        <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div class="h-full bg-pink-500" style="width: 15%"></div>
                        </div>
                    </div>
                    <p class="text-[9px] text-zinc-500 italic mt-2">
                        "He sells roughly once every 6 posts."
                    </p>
                </div>
            </div>
            <div class="glass-panel rounded-xl p-4">
                <h3 class="text-zinc-400 text-[10px] font-bold uppercase mb-3 flex items-center gap-2">
                    <i class="fa-solid fa-ruler-horizontal text-[11px] text-zinc-500"></i> Length Strategy
                </h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between text-[10px]">
                        <span class="text-zinc-400">Short</span>
                        <span class="text-emerald-400 font-mono">+120% Avg. Reach</span>
                    </div>
                    <div class="flex items-center justify-between text-[10px]">
                        <span class="text-zinc-400">Threads (Long)</span>
                        <span class="text-zinc-500 font-mono">Avg. Reach</span>
                    </div>
                    <p class="text-[9px] text-zinc-500 italic mt-auto pt-2 border-t border-zinc-800/50">
                        Short tweets perform 1.2x better for reach.
                    </p>
                </div>
            </div>
        </div>
        <div class="glass-panel rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                    <span class="text-yellow-400 text-sm">🏆</span>
                    <h3 class="text-zinc-200 text-[11px] font-bold uppercase tracking-wider">
                        Viral Hooks Library
                    </h3>
                </div>
                <span class="text-[9px] text-zinc-500 font-mono">
                    Top 3 performing hooks
                </span>
            </div>
            <div class="space-y-2.5 text-xs">
                <div class="rounded-lg border border-zinc-800/80 bg-zinc-950/70 p-3 hover:border-zinc-700 hover:bg-zinc-900/80 transition-colors">
                    <div class="flex items-center justify-between mb-1.5">
                        <div class="flex items-center gap-1.5">
                            <span class="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/40 text-[9px] font-mono uppercase tracking-wide">
                                #1 Viral Vision
                            </span>
                        </div>
                        <span class="text-[9px] text-zinc-500 font-mono">12M views</span>
                    </div>
                    <p class="text-[12px] text-zinc-100 leading-relaxed font-mono">
                        "Make humanity multi-planetary. That is the goal. Everything else is noise."
                    </p>
                    <div class="mt-2 text-[10px] text-zinc-500 flex gap-3">
                        <span class="flex items-center gap-1"><i class="fa-regular fa-heart"></i> 450k</span>
                        <span class="flex items-center gap-1"><i class="fa-solid fa-retweet"></i> 52k</span>
                    </div>
                </div>
                <div class="rounded-lg border border-zinc-800/80 bg-zinc-950/70 p-3 hover:border-zinc-700 hover:bg-zinc-900/80 transition-colors">
                    <div class="flex items-center justify-between mb-1.5">
                        <div class="flex items-center gap-1.5">
                            <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/40 text-[9px] font-mono uppercase tracking-wide">
                                #2 Hot Take
                            </span>
                        </div>
                        <span class="text-[9px] text-zinc-500 font-mono">8.2M views</span>
                    </div>
                    <p class="text-[12px] text-zinc-100 leading-relaxed font-mono">
                        "Unpopular opinion: The MBA is strictly worse than a 3-month coding bootcamp. Here is why."
                    </p>
                    <div class="mt-2 text-[10px] text-zinc-500 flex gap-3">
                        <span class="flex items-center gap-1"><i class="fa-regular fa-comment"></i> 12k</span>
                        <span class="flex items-center gap-1"><i class="fa-solid fa-fire text-orange-400"></i> High debate</span>
                    </div>
                </div>
                <div class="rounded-lg border border-zinc-800/80 bg-zinc-950/70 p-3 hover:border-zinc-700 hover:bg-zinc-900/80 transition-colors">
                    <div class="flex items-center justify-between mb-1.5">
                        <div class="flex items-center gap-1.5">
                            <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono uppercase tracking-wide">
                                #3 Personal Story
                            </span>
                        </div>
                        <span class="text-[9px] text-zinc-500 font-mono">6M views</span>
                    </div>
                    <p class="text-[12px] text-zinc-100 leading-relaxed font-mono">
                        "I spent $44B to buy this app. Here are the 5 biggest lessons I learned about free speech."
                    </p>
                    <div class="mt-2 text-[10px] text-zinc-500 flex gap-3">
                        <span class="flex items-center gap-1"><i class="fa-regular fa-bookmark"></i> 5k saves</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="glass-panel rounded-xl p-4">
            <h3 class="text-zinc-400 text-[10px] font-bold uppercase mb-1.5 flex justify-between items-center">
                <span>⏰ Best Time to Post</span>
                <i class="fa-regular fa-clock text-[11px]"></i>
            </h3>
            <div class="text-center my-2.5">
                <div class="text-xl font-bold text-white font-mono">21:00</div>
                <div class="text-[10px] text-zinc-500">Highest View Count</div>
            </div>
            <div class="flex items-end gap-[2px] h-9 w-full px-2">
                {#each timeBars as h}
                    <div 
                        class="flex-1 {h === 100 ? 'bg-emerald-500' : 'bg-zinc-800'} rounded-sm" 
                        style="height: {h}%"
                    ></div>
                {/each}
            </div>
            <div class="flex justify-between text-[9px] text-zinc-600 mt-1 font-mono uppercase px-2">
                <span>00h</span><span>12h</span><span>23h</span>
            </div>
        </div>
        <div class="glass-panel rounded-xl p-4">
            <h3 class="text-zinc-400 text-[10px] font-bold uppercase mb-4 flex items-center gap-2">
                <i class="fa-solid fa-filter text-[11px]"></i> Audience Funnel
            </h3>
            <div class="space-y-4 relative">
                <div class="absolute left-[11px] top-3 bottom-3 w-0.5 bg-zinc-800 -z-10"></div>
                
                <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center z-10">
                        <div class="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between text-[10px] mb-1 text-zinc-400">
                            <span>Avg. Views (Public Reach)</span><span>100%</span>
                        </div>
                        <div class="h-1.5 bg-zinc-900 rounded-full w-full">
                            <div class="h-full bg-blue-500 w-full rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center z-10">
                        <div class="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between text-[10px] mb-1 text-zinc-400">
                            <span>Likes (Approvals)</span><span class="text-pink-400 font-bold font-mono">3.5%</span>
                        </div>
                        <div class="h-1.5 bg-zinc-900 rounded-full w-full">
                            <div class="h-full bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]" style="width: 15%"></div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center z-10">
                        <div class="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between text-[10px] mb-1 text-zinc-400">
                            <span>Comments/Saves (Fans)</span><span class="text-purple-400 font-bold font-mono">1.2%</span>
                        </div>
                        <div class="h-1.5 bg-zinc-900 rounded-full w-full">
                            <div class="h-full bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]" style="width: 5%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
