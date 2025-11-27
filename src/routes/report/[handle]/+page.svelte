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
    import InsiderNetworkCard from '$lib/components/report/InsiderNetworkCard.svelte';
    import RecentActivityCard from '$lib/components/report/RecentActivityCard.svelte';
    import NetworkRadarCard from '$lib/components/report/NetworkRadarCard.svelte';
    import TrafficFlowCard from '$lib/components/report/TrafficFlowCard.svelte';

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
    
<div class="sticky top-20 z-30 w-full mb-12 pointer-events-none transition-all duration-300">
        <div class="pointer-events-auto w-full flex justify-center px-2 sm:px-4"> 
            
            <div class="w-fit mx-auto bg-white border border-slate-300 shadow-lg shadow-slate-200/50 rounded-3xl p-1.5 flex flex-col sm:flex-row items-center gap-3">
                
                <div class="hidden md:flex items-center gap-2 px-2 text-[12px] shrink-0">
                    <span class="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Report:</span>
                    <div class="flex items-center gap-2 text-slate-900 font-bold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-300">
                        <span class="relative flex h-2 w-2">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                        </span>
                        <span class="font-mono">{analyticsData.profile.handle}</span>
                    </div>
                </div>

                <form on:submit|preventDefault={handleSearch} class="relative w-full sm:w-auto">
                    <div class="relative rounded-2xl border border-slate-300 bg-white px-2 py-1 flex items-center gap-2 hover:border-slate-400 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-all w-full sm:w-[300px]">
                        
                        <div class="pl-2 pr-1 text-slate-600">
                            <i class="fa-brands fa-x-twitter text-sm"></i>
                        </div>
                        
                        <input
                            type="text"
                            bind:value={searchTerm}
                            placeholder="Analyze another..."
                            class="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-500 focus:outline-none font-mono h-9 min-w-0 font-medium truncate"
                        />

                        <button
                            type="submit"
                            disabled={isLoading || !searchTerm}
                            class="ml-1 h-9 px-3 rounded-xl bg-slate-900 text-[12px] font-bold text-white flex items-center gap-1.5 shadow-md hover:bg-black active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                        >
                            {#if isLoading}
                                <i class="fa-solid fa-circle-notch fa-spin"></i>
                            {:else}
                                <span>Analyze</span>
                                <i class="fa-solid fa-bolt text-[10px] text-yellow-400"></i>
                            {/if}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-5 items-start animate-fade-in-up">
        <div class="space-y-4">
            <ProfileCard profile={analyticsData.profile} />
            <RecentActivityCard heatmap={analyticsData.habits.heatmap} />
            <BestTimeChart habits={analyticsData.habits} />

            <NetworkRadarCard network={analyticsData.network} />
            <TrafficFlowCard traffic={analyticsData.traffic} />
            
            {#if analyticsData.network.vipFollowing && analyticsData.network.vipFollowing.length > 0}
                <InsiderNetworkCard data={analyticsData.network.vipFollowing} />
            {/if}
            
            <AudienceFunnel funnel={analyticsData.funnel} />
            
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

            <MonetizationCard data={analyticsData.contentStrategy.monetization} />
            <LengthStrategyCard data={analyticsData.contentStrategy.length} />
            
            <ReplyStrategyCard 
                data={analyticsData.replyStrategy} 
                myHandle={analyticsData.profile.handle} 
             />

            
            
        </div>
    </div>
</div>
{/if}
