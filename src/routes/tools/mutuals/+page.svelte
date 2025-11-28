<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    // --- MOCK STATE ---
    let step: 'input' | 'scanning' | 'result' = 'input';
    let handleA = "";
    let handleB = "";
    let errorMsg = "";

    // Biến lưu data thật
    let resultData: any = null;


    async function handleCheck() {
        if (!handleA || !handleB) return;
        
        step = 'scanning';
        errorMsg = "";
        resultData = null;

        try {
            const res = await fetch('/api/analyze-relationship', {
                method: 'POST',
                body: JSON.stringify({ handleA, handleB }),
                headers: { 'Content-Type': 'application/json' }
            });

            const resp = await res.json();

            if (res.ok && resp.success) {
                resultData = resp.data;
                step = 'result';
            } else {
                step = 'input';
                errorMsg = resp.message || "Something went wrong";
                alert(errorMsg); // Hoặc hiển thị UI đẹp hơn
            }
        } catch (e) {
            step = 'input';
            alert("Network error");
        }
    }

    function reset() {
        step = 'input';
        handleA = "";
        handleB = "";
    }
</script>

<svelte:head>
    <title>Mutuals Check | PatternDecoder</title>
</svelte:head>

<div class="w-full relative selection:bg-indigo-500/20 flex flex-col items-center pt-8 pb-8 px-4">
    
    <div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-50/80 to-transparent rounded-[100%] blur-[80px]"></div>
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
    </div>

    <div class="w-full max-w-[400px] relative z-10">

        <div class="text-center mb-8" in:fly={{ y: -20, duration: 600, easing: quintOut }}>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-200/60 bg-white/50 backdrop-blur-sm text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-3 shadow-sm">
                <i class="fa-solid fa-link"></i>
                <span>Relationship IQ</span>
            </div>
            <h1 class="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Network<span class="text-indigo-600">Overlap</span>
            </h1>
            <p class="text-slate-500 text-sm mt-2 font-medium">See who connects you.</p>
        </div>
        
        <div class="bg-white rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-200/60 overflow-hidden ring-4 ring-slate-50/50 relative">
            
            {#if step === 'input'}
                <div class="p-6 sm:p-8" in:fade={{ duration: 300 }}>
                    <form on:submit|preventDefault={handleCheck} class="space-y-5">
                        
                        <div class="space-y-1">
                            <!-- svelte-ignore a11y_label_has_associated_control -->
                            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Profile A</label>
                            <div class="relative group">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="text-slate-400 font-bold text-sm">@</span>
                                </div>
                                <input 
                                    type="text" 
                                    bind:value={handleA}
                                    placeholder="your_handle"
                                    class="w-full h-12 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                                />
                            </div>
                        </div>

                        <div class="relative h-4 flex items-center justify-center">
                            <div class="w-full border-t border-slate-100 absolute"></div>
                            <div class="relative bg-white px-2 text-slate-300">
                                <i class="fa-solid fa-arrow-down text-xs"></i>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <!-- svelte-ignore a11y_label_has_associated_control -->
                            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Profile B</label>
                            <div class="relative group">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="text-slate-400 font-bold text-sm">@</span>
                                </div>
                                <input 
                                    type="text" 
                                    bind:value={handleB}
                                    placeholder="target_handle"
                                    class="w-full h-12 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={!handleA || !handleB}
                            class="w-full h-12 mt-2 rounded-xl bg-slate-900 text-white font-bold text-[13px] tracking-wide hover:bg-black hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <span>Start Analysis</span>
                            <i class="fa-solid fa-bolt text-indigo-400"></i>
                        </button>
                    </form>
                </div>
            {/if}

            {#if step === 'scanning'}
                <div class="p-10 flex flex-col items-center justify-center text-center min-h-[340px]" in:fade>
                    <div class="relative w-20 h-20 mb-6">
                        <div class="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                        <div class="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <img src="https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png" class="w-10 h-10 rounded-full opacity-20" alt="loading">
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900 mb-2">Scanning Networks...</h3>
                    <div class="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <span>@{handleA}</span>
                        <i class="fa-solid fa-xmark text-[10px] text-slate-300"></i>
                        <span>@{handleB}</span>
                    </div>
                </div>
            {/if}

            {#if step === 'result'}
                <div class="animate-in fade-in zoom-in-95 duration-300">
                    <div class="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
                        <div class="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-500/30 rounded-full blur-[60px]"></div>
                        
                        <div class="relative z-10 flex flex-col items-center">
                            <span class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1 opacity-80">Connection Strength</span>
                            <div class="text-6xl font-black tracking-tighter text-white mb-4 drop-shadow-2xl">{resultData.overlapPercent}%</div>
                            
                            <div class="flex items-center gap-0">
                                <div class="bg-white/10 backdrop-blur-md border border-white/10 pl-3 pr-2 py-1.5 rounded-l-full text-xs font-medium flex items-center gap-2">
                                    <span class="max-w-[80px] truncate">@{handleA}</span>
                                </div>
                                <div class="bg-indigo-500/80 backdrop-blur-md border-y border-indigo-400/50 h-[30px] flex items-center px-2 z-10 -ml-1 -mr-1 rounded-sm relative">
                                    <i class="fa-solid fa-link text-[10px]"></i>
                                </div>
                                <div class="bg-white/10 backdrop-blur-md border border-white/10 pl-2 pr-3 py-1.5 rounded-r-full text-xs font-medium flex items-center gap-2">
                                    <span class="max-w-[80px] truncate">@{handleB}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 bg-white">
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Mutual Connections
                            </span>
                            <span class="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                                {resultData.totalCommon} total
                            </span>
                        </div>

                        <div class="flex flex-wrap justify-center gap-2 mb-6">
                            {#each resultData.commonVips as vip}
                                <a href="https://x.com/{vip.handle}" target="_blank" class="group relative block">
                                    <div class="w-11 h-11 rounded-full p-[2px] bg-white border border-slate-100 group-hover:border-indigo-500 group-hover:scale-110 transition-all duration-200 shadow-sm overflow-hidden">
                                        <img src={vip.avatar} alt={vip.handle} class="w-full h-full rounded-full object-cover bg-slate-100" />
                                    </div>
                                </a>
                            {/each}
                            <div class="w-11 h-11 rounded-full bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-default">
                                <span class="text-[9px] font-bold leading-none">+{resultData.totalCommon - resultData.commonVips.length}</span>
                                <span class="text-[8px] leading-none">more</span>
                            </div>
                        </div>

                        <div class="space-y-2.5">
                            <button class="w-full h-11 rounded-xl bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-400/20 active:scale-[0.98]">
                                <i class="fa-brands fa-twitter text-lg"></i>
                                <span>Share Result on X</span>
                            </button>
                            
                            <button on:click={reset} class="w-full h-10 rounded-xl text-slate-500 text-xs font-bold hover:text-slate-800 hover:bg-slate-50 transition-colors">
                                Analyze Another Pair
                            </button>
                        </div>
                    </div>
                </div>
            {/if}

        </div>
    </div>
</div>
