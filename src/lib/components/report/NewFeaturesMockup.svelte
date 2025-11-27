<script lang="ts">
  // Dữ liệu giả (Mock Data)
  const mockOverlap = {
    youHandle: '@you_maker',
    targetHandle: '@andi_losing',
    overlapPercent: 28,
    totalFollowing: 1100,
    commonVips: [
        { handle: 'levelsio', avatar: 'https://unavatar.io/twitter/levelsio', count: 5 },
        { handle: 'paulg', avatar: 'https://unavatar.io/twitter/paulg', count: 3 },
        { handle: 'naval', avatar: 'https://unavatar.io/twitter/naval', count: 2 },
    ]
  };

  const mockInteractions = {
    totalReplies: 12,
    totalMentions: 3,
    lastInteractions: [
        { 
            type: 'Reply', 
            date: 'Nov 25', 
            text: "Great point. I totally agree with the 7-year entrepreneur takeaway: 'Ship More'!",
            url: 'https://x.com/search?q=(from:andi_losing)%20(to:you_maker)'
        },
        { 
            type: 'Mention', 
            date: 'Nov 23', 
            text: "Thanks for the shoutout @you_maker, I'll check your latest post on the topic.",
            url: 'https://x.com/search?q=(from:andi_losing)%20(mention:you_maker)'
        },
        { 
            type: 'Reply', 
            date: 'Nov 20', 
            text: "This is exactly what I needed to hear after a tough week.",
            url: 'https://x.com/search?q=(from:andi_losing)%20(to:you_maker)'
        }
    ]
  }

  function getFollowLink(handle: string) {
    return `https://x.com/${handle}`;
  }

  function getScoreColor(num: number) {
    if (num > 40) return 'text-emerald-600';
    if (num > 20) return 'text-amber-600';
    return 'text-sky-600';
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-5 items-start">

    <div class="space-y-4">
        
        <div class="card-soft p-5 h-full flex flex-col">
            <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700 mb-4 border-b border-slate-100 pb-2">
                <i class="fa-solid fa-code-merge text-[11px] text-indigo-400"></i> Audience Overlap (WIP)
            </h3>

            <div class="flex items-center justify-around h-28 relative">
                <div class="relative w-full h-full max-w-[200px] mx-auto">
                    <div class="absolute w-24 h-24 rounded-full bg-sky-500/30 left-0 top-1/2 -translate-y-1/2 blur-lg"></div>
                    <div class="absolute w-24 h-24 rounded-full bg-emerald-500/30 right-0 top-1/2 -translate-y-1/2 blur-lg"></div>
                    
                    <div class="absolute inset-0 flex items-center justify-center text-slate-900 font-black text-2xl font-mono">
                        {mockOverlap.overlapPercent}%
                    </div>
                </div>
            </div>

            <div class="flex flex-col items-center justify-center mt-3 pt-3 border-t border-slate-100">
                <span class="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                    Common VIP Follows
                </span>
                <div class="flex flex-wrap gap-1.5 justify-center">
                    {#each mockOverlap.commonVips as vip}
                        <a href={getFollowLink(vip.handle)} target="_blank" rel="noopener noreferrer" 
                           class="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                        >
                            <img src={vip.avatar} alt={vip.handle} class="w-4 h-4 rounded-full object-cover">
                            <span class="text-[11px] text-slate-700 font-mono">@{vip.handle}</span>
                        </a>
                    {/each}
                </div>
            </div>
        </div>

    </div>

    <div class="space-y-4">
        
        <div class="card-soft p-5 h-full flex flex-col">
            <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700 mb-4 border-b border-slate-100 pb-2">
                <i class="fa-solid fa-handshake text-[11px] text-emerald-500"></i> Past Interactions with You
            </h3>

            <div class="flex items-center gap-6 mb-4">
                <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-0.5">Total Replies</span>
                    <span class="text-2xl font-black font-mono {getScoreColor(mockInteractions.totalReplies)}">{mockInteractions.totalReplies}</span>
                </div>
                <div>
                    <span class="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-0.5">Total Mentions</span>
                    <span class="text-2xl font-black font-mono text-slate-900">{mockInteractions.totalMentions}</span>
                </div>
            </div>

            <div class="space-y-3.5">
                {#each mockInteractions.lastInteractions as interaction}
                    <a href={interaction.url} target="_blank" rel="noopener noreferrer" class="group block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 hover:border-slate-300">
                        <div class="flex items-center justify-between mb-1.5">
                            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                {interaction.type}
                            </span>
                            <span class="text-[9px] text-slate-400 font-mono">{interaction.date}</span>
                        </div>
                        <p class="text-[12px] text-slate-700 leading-snug line-clamp-2 italic font-medium group-hover:text-slate-900">
                            "{interaction.text}"
                        </p>
                    </a>
                {/each}
            </div>

            <p class="text-[9px] text-slate-400 italic mt-4 pt-3 border-t border-slate-100">
                Data based on search for: (from:{mockOverlap.targetHandle}) (to:{mockOverlap.youHandle})
            </p>
        </div>

    </div>
</div>
