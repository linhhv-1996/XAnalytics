<script lang="ts">
    import AudienceOverlapCard from '$lib/components/report/AudienceOverlapCard.svelte';
    import PersonalInteractionsCard from '$lib/components/report/PersonalInteractionsCard.svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    // --- STATE ---
    let handleA: string = "";
    let handleB: string = "";
    let isLoading: boolean = false;
    let isAnalyzed: boolean = false;
    let errorMsg: string = "";
    
    // --- MOCK DATA (Should be replaced by real API result) ---
    // Using mock data allows the UI to be fully functional before API is built
    const mockOverlapData = {
        overlapPercent: 35,
        commonVips: [
            { handle: 'levelsio', avatar: 'https://unavatar.io/twitter/levelsio' },
            { handle: 'paulg', avatar: 'https://unavatar.io/twitter/paulg' },
            { handle: 'naval', avatar: 'https://unavatar.io/twitter/naval' },
            { handle: 'tobi', avatar: 'https://unavatar.io/twitter/tobi' },
        ],
        message: "Overlap based on mutual VIP accounts followed by both handles (1000 IDs checked)."
    };
    const mockInteractionAtoB = { 
        totalReplies: 7, 
        totalMentions: 2,
        interactions: [
            { type: 'Reply', date: 'Nov 20', text: "Great thread A, I learned a lot from this.", url: '#' },
            { type: 'Mention', date: 'Nov 18', text: "Just saw this cool project by @levelsio, check it out.", url: '#' },
        ]
    };
     const mockInteractionBtoA = { 
        totalReplies: 3, 
        totalMentions: 0,
        interactions: [
            { type: 'Reply', date: 'Nov 25', text: "I agree with this point on building in public.", url: '#' },
            { type: 'Reply', date: 'Nov 19', text: "Very insightful, saving this thread.", url: '#' },
        ]
    };

    
    // --- METHODS ---
    async function handleComparison() {
        if (!handleA.trim() || !handleB.trim()) return;
        
        // 1. Clean handles
        let cleanA = handleA.trim().replace('@', '');
        let cleanB = handleB.trim().replace('@', '');
        
        // 2. Client-side login check (Optional, depending on your business rule)
        if (!$page.data.user) { 
             await goto(`/login?redirectTo=${encodeURIComponent(`/compare?hA=${cleanA}&hB=${cleanB}`)}`);
             return;
        }
        
        isLoading = true;
        isAnalyzed = false;
        errorMsg = "";

        // TODO: Call API POST /api/compare with { handleA: cleanA, handleB: cleanB }

        // Mock Loading Delay
        await new Promise(r => setTimeout(r, 1500));
        
        // Mock success scenario
        isLoading = false;
        isAnalyzed = true;
        handleA = `@${cleanA}`;
        handleB = `@${cleanB}`;

        // Example of how to handle API error
        // if (cleanA === 'fail') {
        //     isLoading = false;
        //     errorMsg = "One or both accounts are private or not found.";
        //     isAnalyzed = false;
        // }
    }

    function swapHandles() {
        // Swap values if possible
        if (!isLoading) {
            [handleA, handleB] = [handleB, handleA];
            if (isAnalyzed) {
                // Rerunning the analysis is necessary if the data depends on the A->B direction,
                // but since the cards are symmetrical, a quick UI swap is enough to feel fast.
                // You would need to re-fetch if API calls change based on order (e.g., A's followers data is fresher).
                [handleA, handleB] = [handleB, handleA]; // Double swap
            }
        }
    }
</script>

<div class="max-w-5xl mx-auto px-4 pb-10 pt-6">
    <div class="text-center mb-10">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight mb-2">Network Comparison</h1>
        <p class="text-slate-500 text-base">Compare VIP audience overlap and cross-interactions between any two accounts.</p>
    </div>

    <div class="card p-6 mb-12 max-w-4xl mx-auto">
        <form on:submit|preventDefault={handleComparison} class="flex items-center justify-between gap-4">
            
            <div class="flex-1">
                <label for="handle-a" class="text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5 block">Account A</label>
                <input 
                    type="text" 
                    id="handle-a"
                    bind:value={handleA} 
                    placeholder="@handle_A" 
                    class="w-full bg-slate-50 text-base text-slate-900 font-mono h-12 px-4 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    disabled={isLoading}
                />
            </div>
            
            <div class="flex flex-col items-center gap-1 mt-6">
                <button 
                    type="button"
                    on:click={swapHandles}
                    class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors flex items-center justify-center shadow-sm"
                    title="Swap Handles"
                    disabled={isLoading}
                >
                    <i class="fa-solid fa-arrow-right-arrow-left text-sm"></i>
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !handleA.trim() || !handleB.trim()}
                    class="h-10 px-5 rounded-xl bg-slate-900 text-sm font-bold text-white flex items-center gap-2 shadow-lg hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                    {#if isLoading}
                        <i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing...
                    {:else}
                        <i class="fa-solid fa-bolt text-yellow-400"></i> Compare
                    {/if}
                </button>
            </div>
            
            <div class="flex-1">
                <label for="handle-b" class="text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5 block">Account B</label>
                <input 
                    type="text" 
                    id="handle-b"
                    bind:value={handleB} 
                    placeholder="@handle_B" 
                    class="w-full bg-slate-50 text-base text-slate-900 font-mono h-12 px-4 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                    disabled={isLoading}
                />
            </div>
        </form>
        
        {#if errorMsg}
            <div class="text-center mt-4 text-sm text-rose-500 font-medium">
                <i class="fa-solid fa-triangle-exclamation mr-1"></i> {errorMsg}
            </div>
        {/if}
    </div>

    {#if isAnalyzed && !isLoading}
        <div class="space-y-6 animate-fade-in-up">
            <h2 class="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">Analysis: {handleA} vs. {handleB}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <AudienceOverlapCard 
                    targetHandle={handleA} 
                    compareHandle={handleB} 
                    overlapPercent={mockOverlapData.overlapPercent} 
                    commonVips={mockOverlapData.commonVips}
                />

                <PersonalInteractionsCard 
                    targetHandle={handleA} 
                    compareHandle={handleB}
                    totalReplies={mockInteractionAtoB.totalReplies}
                    totalMentions={mockInteractionAtoB.totalMentions}
                    lastInteractions={mockInteractionAtoB.interactions}
                />
            </div>
        </div>
    {/if}
    
    {#if isLoading}
        <div class="text-center py-10 text-slate-500">
            <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-3"></i>
            <p>Fetching 1000 VIPs and interaction data...</p>
        </div>
    {/if}

</div>
