<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import AudienceOverlapCard from './AudienceOverlapCard.svelte';
    import PersonalInteractionsCard from './PersonalInteractionsCard.svelte';

    export let targetHandle: string;
    export let isOpen: boolean = false;

    const dispatch = createEventDispatcher();

    // State
    let step = 'input'; 
    let myHandle = '';
    let isLoading = false;

    // MOCK DATA (Truyền xuống component con)
    const mockData = {
        overlap: 28,
        totalCommon: 124, 
        topCommonVips: [
            { handle: 'levelsio', avatar: 'https://unavatar.io/twitter/levelsio' },
            { handle: 'paulg', avatar: 'https://unavatar.io/twitter/paulg' },
            { handle: 'naval', avatar: 'https://unavatar.io/twitter/naval' },
            { handle: 'tobi', avatar: 'https://unavatar.io/twitter/tobi' },
            { handle: 'sama', avatar: 'https://unavatar.io/twitter/sama' },
            { handle: 'shl', avatar: 'https://unavatar.io/twitter/shl' },
            { handle: 'swyx', avatar: 'https://unavatar.io/twitter/swyx' },
            { handle: 'dagorenouf', avatar: 'https://unavatar.io/twitter/dagorenouf' },
            { handle: 'vercel', avatar: 'https://unavatar.io/twitter/vercel' },
            { handle: 'supabase', avatar: 'https://unavatar.io/twitter/supabase' }
        ],
        interactions: [
            { type: 'Reply', date: '2d ago', text: "Great thread! I totally agree with this point." },
            { type: 'Reply', date: 'Nov 15', text: "This is exactly what I needed to hear today." },
            { type: 'Reply', date: 'Nov 12', text: "Underrated advice. Bookmarking this immediately." },
            { type: 'Reply', date: 'Oct 30', text: "Lol true." },
            { type: 'Reply', date: 'Oct 28', text: "Wait, is this real?" }
        ]
    };

    function handleAnalyze() {
        if (!myHandle) return;
        isLoading = true;
        step = 'loading';
        
        setTimeout(() => {
            isLoading = false;
            step = 'result';
        }, 1000);
    }

    function resetInput() {
        step = 'input';
        myHandle = '';
    }

    function closeModal() {
        dispatch('close');
    }
</script>

{#if isOpen}
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" on:click={closeModal}></div>

        <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            
            <div class="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0">
                        <i class="fa-solid fa-bolt text-lg"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-slate-900 leading-tight">Relationship Intelligence</h3>
                        
                        {#if step === 'result'}
                            <div class="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                                <span>You (@{myHandle})</span>
                                <button on:click={resetInput} class="text-indigo-600 hover:text-indigo-800 hover:underline font-bold" title="Analyze another handle">
                                    (Change)
                                </button>
                                <span>vs. @{targetHandle}</span>
                            </div>
                        {:else}
                            <p class="text-xs text-slate-500 font-medium mt-0.5">Analyze connection with @{targetHandle}</p>
                        {/if}
                    </div>
                </div>
                <button on:click={closeModal} class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>

            <div class="p-0 overflow-y-auto bg-slate-50 scrollbar-hide">
                
                {#if step === 'input'}
                    <div class="flex flex-col items-center justify-center py-12 px-6 text-center bg-white min-h-[320px]">
                        <div class="mb-6 p-4 rounded-full bg-indigo-50 text-indigo-500 animate-pulse">
                            <i class="fa-brands fa-twitter text-4xl"></i>
                        </div>
                        <h4 class="text-xl font-bold text-slate-900 mb-2">Who are you?</h4>
                        <p class="text-sm text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
                            Enter your X handle to check mutual followers & interaction history.
                        </p>
                        
                        <form on:submit|preventDefault={handleAnalyze} class="w-full max-w-xs">
                            <div class="relative w-full mb-4">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="text-slate-400 font-bold text-base select-none">@</span>
                                </div>
                                <input 
                                    type="text" 
                                    bind:value={myHandle}
                                    class="w-full h-12 pl-9 pr-4 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono text-base focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                    placeholder="your_handle"
                                    autoFocus
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={!myHandle}
                                class="w-full h-12 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span>Reveal Data</span>
                                <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </form>
                    </div>
                {/if}

                {#if step === 'loading'}
                    <div class="flex flex-col items-center justify-center py-16 min-h-[320px] bg-white">
                        <div class="relative w-16 h-16 mb-5">
                            <div class="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                            <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p class="text-base font-bold text-slate-700">Analyzing...</p>
                        <p class="text-xs text-slate-400 mt-1 font-mono">Fetching interactions & connections</p>
                    </div>
                {/if}

                {#if step === 'result'}
                    <div class="divide-y divide-slate-200 bg-white">
                        
                        <AudienceOverlapCard 
                            overlapPercent={mockData.overlap}
                            totalCommon={mockData.totalCommon}
                            topCommonVips={mockData.topCommonVips}
                        />

                        <PersonalInteractionsCard 
                            interactions={mockData.interactions}
                            targetHandle={targetHandle}
                            myHandle={myHandle}
                        />

                    </div>
                {/if}

            </div>
        </div>
    </div>
{/if}
