<script lang="ts">
    // PROPS: Account A (Target) and Account B (Comparison)
    export let targetHandle: string; 
    export let compareHandle: string;
    
    // MOCK RESULT DATA (REPLACE WITH REAL API DATA)
    export let overlapPercent: number = 35;
    export let commonVips = [
        { handle: 'levelsio', avatar: 'https://unavatar.io/twitter/levelsio' },
        { handle: 'paulg', avatar: 'https://unavatar.io/twitter/paulg' },
        { handle: 'naval', avatar: 'https://unavatar.io/twitter/naval' },
        { handle: 'tobi', avatar: 'https://unavatar.io/twitter/tobi' },
    ];
    export let totalVIPsChecked: number = 980;

    // UI State for demonstration (you might control this from the parent in real implementation)
    let dataLoaded = true;

    function getFollowLink(handle: string) {
        return `https://x.com/${handle}`;
    }
    
</script>

<div class="card-soft p-5 h-full flex flex-col">
    <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700 mb-4 border-b border-slate-100 pb-2">
        <i class="fa-solid fa-code-merge text-[11px] text-indigo-400"></i> Audience Overlap 
        <span class="text-slate-400 font-mono ml-auto">vs {compareHandle}</span>
    </h3>

    {#if dataLoaded}
        <div class="flex flex-col items-center justify-around h-32 relative">
            <div class="relative w-full h-full max-w-[200px] mx-auto">
                <div class="absolute w-24 h-24 rounded-full bg-sky-500/30 left-0 top-1/2 -translate-y-1/2 blur-lg flex items-center justify-center text-[10px] text-sky-800 font-bold border-2 border-sky-400/40">{targetHandle}</div>
                <div class="absolute w-24 h-24 rounded-full bg-emerald-500/30 right-0 top-1/2 -translate-y-1/2 blur-lg flex items-center justify-center text-[10px] text-emerald-800 font-bold border-2 border-emerald-400/40">{compareHandle}</div>
                
                <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-900 font-black text-2xl font-mono leading-none">
                    {overlapPercent}%
                    <span class="text-[9px] text-slate-500 font-semibold mt-1">Common VIPs</span>
                </div>
            </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100">
            <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Mutual Influencers ({commonVips.length})
                </span>
                <span class="text-[9px] text-slate-400 font-mono">Checked {totalVIPsChecked} VIPs</span>
            </div>
            
            <div class="flex flex-wrap gap-1.5 justify-start max-h-[100px] overflow-y-auto">
                {#each commonVips as vip}
                    <a href={getFollowLink(vip.handle)} target="_blank" rel="noopener noreferrer" 
                       class="flex items-center gap-1.5 px-2 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-100 transition-colors shadow-sm"
                    >
                        <img src={vip.avatar} alt={vip.handle} class="w-4 h-4 rounded-full object-cover" loading="lazy">
                        <span class="text-[11px] text-slate-700 font-mono">@{vip.handle}</span>
                    </a>
                {/each}
            </div>
            
             <p class="text-[9px] text-slate-400 italic mt-3">
                Overlap based on mutual VIP accounts followed by both handles (1000 IDs checked).
            </p>
            
            </div>
        
    {:else}
        <div class="flex flex-col items-center justify-center flex-1 min-h-[120px] pt-2">
            <p class="text-[12px] text-slate-500 mb-4 text-center">
                Compare the **VIP audience** of **{targetHandle}** against any handle.
            </p>
        </div>
    {/if}
</div>
