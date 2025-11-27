<script lang="ts">
    // PROPS: Account A (Target) and Account B (Comparison)
    export let targetHandle: string; // Account A: The one who is doing the interacting (from:)
    export let compareHandle: string; // Account B: The one being interacted with (to:)
    
    // MOCK RESULT DATA (REPLACE WITH REAL API DATA)
    export let totalReplies: number = 7; 
    export let totalMentions: number = 2;
    export let lastInteractions = [
        { 
            type: 'Reply', 
            date: 'Nov 20', 
            text: "Great thread A, I learned a lot from this.", 
            url: '#' 
        },
        { 
            type: 'Mention', 
            date: 'Nov 18', 
            text: "Just saw this cool project by @levelsio, check it out.", 
            url: '#'
        },
        { 
            type: 'Reply', 
            date: 'Nov 15', 
            text: "This is exactly what I needed to hear after a tough week.", 
            url: '#'
        }
    ];

    // UI State for demonstration
    let dataLoaded = true;

    function getInteractionLink(type: string, target: string, compare: string) {
        // Clean handles
        const targetClean = target.replace('@', '');
        const compareClean = compare.replace('@', '');
        
        // Build X Search URL
        let query = (type === 'Reply') 
            ? `(from:${targetClean}) (to:${compareClean})` 
            : `(from:${targetClean}) ${compareClean}`;      

        return `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query`;
    }
    
</script>

<div class="card-soft p-5 h-full flex flex-col">
    <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700 mb-4 border-b border-slate-100 pb-2">
        <i class="fa-solid fa-comments text-[11px] text-pink-500"></i> Interactions (Outbound)
        <span class="text-slate-400 font-mono ml-auto">{targetHandle} → {compareHandle}</span>
    </h3>

    {#if dataLoaded}
        <div class="flex items-center gap-6 mb-4">
            <div>
                <span class="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-0.5">Total Replies</span>
                <a href={getInteractionLink('Reply', targetHandle, compareHandle)} target="_blank" rel="noopener noreferrer" class="group block">
                    <span class="text-2xl font-black font-mono text-pink-600 group-hover:text-pink-700 transition-colors">{totalReplies}</span>
                </a>
            </div>
            <div>
                <span class="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-0.5">Total Mentions</span>
                 <a href={getInteractionLink('Mention', targetHandle, compareHandle)} target="_blank" rel="noopener noreferrer" class="group block">
                    <span class="text-2xl font-black font-mono text-slate-900 group-hover:text-slate-700 transition-colors">{totalMentions}</span>
                </a>
            </div>
        </div>

        <div class="space-y-3.5 flex-1">
            {#each lastInteractions as interaction}
                <a href={getInteractionLink(interaction.type, targetHandle, compareHandle)} target="_blank" rel="noopener noreferrer" class="group block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 hover:border-slate-300">
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
            Data fetched from X Search API.
        </p>
        
    {:else}
        <div class="flex flex-col items-center justify-center flex-1 min-h-[120px] pt-2">
            <p class="text-[12px] text-slate-500 mb-4 text-center">
                Search for mentions/replies from **{targetHandle}** to any other account.
            </p>
        </div>
    {/if}
</div>
