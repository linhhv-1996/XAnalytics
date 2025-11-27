<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    
    import ProfileCard from "$lib/components/report/ProfileCard.svelte";
    import MonetizationCard from "$lib/components/report/MonetizationCard.svelte";
    import LengthStrategyCard from "$lib/components/report/LengthStrategyCard.svelte";
    import ReplyStrategyCard from "$lib/components/report/ReplyStrategyCard.svelte";
    import SignalSnapshot from "$lib/components/report/SignalSnapshot.svelte";
    import TopicCloudCard from "$lib/components/report/TopicCloudCard.svelte";
    import TopViralPosts from "$lib/components/report/TopViralPosts.svelte";
    import BaselinePerformance from "$lib/components/report/BaselinePerformance.svelte";
    import BestTimeChart from "$lib/components/report/BestTimeChart.svelte";
    import AudienceFunnel from "$lib/components/report/AudienceFunnel.svelte";

    // State
    let analyticsData: any = null;
    let isLoading = true; 
    let errorMsg = "";
    let searchTerm = "";
    let activeHandle = "";

    // Reactive: Tự động chạy khi URL thay đổi
    $: if ($page.params.handle && $page.params.handle !== activeHandle) {
        activeHandle = $page.params.handle;
        initAnalysis(activeHandle);
    }

    async function initAnalysis(handle: string) {
        isLoading = true;
        analyticsData = null;
        errorMsg = "";

        try {
            const res = await fetch('/api/analyze-profile', {
                method: 'POST',
                body: JSON.stringify({ handle }),
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await res.json();

            if (res.ok && result.success) {
                analyticsData = result.analyticsData;
            } else {
                errorMsg = result.message || "Failed to load data";
            }
        } catch (e) {
            errorMsg = "Network error. Please try again.";
        } finally {
            isLoading = false;
        }
    }

    async function handleSearch() {
        if (!searchTerm.trim()) return;
        
        let newHandle = searchTerm.trim();
        if (newHandle.startsWith("@")) newHandle = newHandle.slice(1);
        if (newHandle.includes("x.com/")) newHandle = newHandle.split("x.com/")[1].split("/")[0];
        if (newHandle.includes("twitter.com/")) newHandle = newHandle.split("twitter.com/")[1].split("/")[0];

        searchTerm = ""; 

        if (newHandle.toLowerCase() === $page?.params?.handle?.toLowerCase()) {
            await initAnalysis(newHandle);
        } else {
            isLoading = true; 
            await goto(`/report/${newHandle}`);
        }
    }
</script>

{#if isLoading}
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
      <div class="card p-6 rounded-2xl flex flex-col items-center gap-4 border border-slate-200 shadow-2xl bg-white">
        <div class="relative w-10 h-10">
          <div class="absolute inset-0 rounded-full border-t-2 border-slate-900 animate-spin"></div>
        </div>
        <div class="text-center">
          <h3 class="text-slate-900 font-bold text-sm">Decoding Strategy...</h3>
          <p class="text-slate-500 text-xs font-mono mt-1">
             Fetching live data for @{$page.params.handle}
          </p>
        </div>
      </div>
    </div>
{/if}

{#if !isLoading && errorMsg}
    <div class="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div class="bg-white p-6 rounded-2xl border border-rose-100 shadow-lg text-center max-w-md w-full">
            <div class="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3 text-rose-500">
                <i class="fa-solid fa-triangle-exclamation text-xl"></i>
            </div>
            <h3 class="text-slate-900 font-bold mb-1">Analysis Failed</h3>
            <p class="text-slate-500 text-sm mb-4">{errorMsg}</p>
            <button on:click={() => window.location.reload()} class="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium shadow-lg shadow-slate-900/20">
                Try Again
            </button>
        </div>
    </div>
{/if}

{#if !isLoading && analyticsData}
<div class="max-w-5xl mx-auto px-4 pb-10 pt-6">
    
    <div class="flex flex-col items-center gap-3 mb-16 sticky top-4 z-30 w-full pointer-events-none">
        
        <div class="pointer-events-auto bg-white/80 backdrop-blur border border-white/50 shadow-sm px-4 py-1.5 rounded-full flex items-center gap-2 ring-1 ring-slate-900/5">
             <h1 class="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                ANALYTICS REPORT
                <span class="w-[1px] h-3 bg-slate-300"></span>
                <span class="font-mono text-slate-500 font-normal">@{$page.params.handle}</span>
            </h1>
        </div>

        <form on:submit|preventDefault={handleSearch} class="pointer-events-auto relative w-full max-w-md flex items-center p-1.5 bg-white/90 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-200 rounded-xl ring-1 ring-slate-900/5 transition-all focus-within:ring-slate-900/20 focus-within:border-slate-300 focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
            <div class="pl-3 pr-2 text-slate-400">
                <i class="fa-brands fa-x-twitter"></i>
            </div>
            
            <input
                type="text"
                bind:value={searchTerm}
                placeholder="Analyze another profile..."
                class="flex-1 bg-transparent text-[13px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none h-9"
            />

            <button
                type="submit"
                disabled={isLoading}
                class="h-9 px-5 rounded-lg bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wide hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-slate-900/10"
            >
                <span>Analyze</span>
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        </form>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-5 items-start animate-fade-in-up">
        <div class="space-y-4">
            <ProfileCard
                profile={analyticsData.profile}
                habits={analyticsData.habits}
                network={analyticsData.network}
                traffic={analyticsData.traffic}
            />
            <AudienceFunnel funnel={analyticsData.funnel} />
            <MonetizationCard data={analyticsData.contentStrategy.monetization} />
            <LengthStrategyCard data={analyticsData.contentStrategy.length} />
        </div>

        <div class="space-y-4">
            <SignalSnapshot signal={analyticsData.signal} profileAvatar={analyticsData.profile.avatarUrl} />
            <BaselinePerformance baseline={analyticsData.baseline} />
            
            {#if analyticsData.topContent.list.length > 0}
              <TopViralPosts posts={analyticsData.topContent.list} />
            {/if}
            
            <TopicCloudCard 
                topics={analyticsData.topics.list} 
                handle={analyticsData.profile.handle} 
            />
            
            <ReplyStrategyCard 
                data={analyticsData.replyStrategy} 
                myHandle={analyticsData.profile.handle} 
             />

            <BestTimeChart habits={analyticsData.habits} />
            
        </div>
    </div>
</div>
{/if}
