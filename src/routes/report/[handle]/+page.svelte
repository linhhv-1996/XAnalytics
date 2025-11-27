<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
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

    export let data: PageData;
    // Reactive statement: Cập nhật data khi chuyển trang thành công
    $: analyticsData = data.analyticsData;

    let searchTerm = "";
    let isSearching = false;

    async function handleSearch() {
        if (!searchTerm.trim()) return;
        
        // 1. Bật Loading Popup ngay lập tức
        isSearching = true; //

        let handle = searchTerm.trim();
        if (handle.startsWith("@")) handle = handle.slice(1);
        if (handle.includes("x.com/")) handle = handle.split("x.com/")[1].split("/")[0];
        if (handle.includes("twitter.com/")) handle = handle.split("twitter.com/")[1].split("/")[0];
        
        // Reset input ngay lập tức
        searchTerm = "";
        
        // FIX UI FREEZE & RE-ANALYSIS
        // 1. setTimeout(0) cho phép browser vẽ UI (isSearching=true) trước khi gọi goto.
        // 2. Thêm ?ref=${Date.now()} để force reload page.server.ts (fix cùng handle).
        setTimeout(async () => {
            try {
                // 2. Gọi Server. Thêm tham số `ref` để buộc reload.
                await goto(`/report/${handle}?ref=${Date.now()}`); 
            } catch (e) {
                // Nếu navigation bị lỗi, tắt loading.
            } finally {
                // Đảm bảo loading tắt sau khi load xong (quan trọng nếu component được reuse).
                isSearching = false; 
            }
        }, 0);
    }
</script>

{#if isSearching}
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm animate-fade-in">
      <div class="card p-6 rounded-2xl flex flex-col items-center gap-4 border border-slate-200 shadow-2xl">
        <div class="relative w-10 h-10">
          <div class="absolute inset-0 rounded-full border-t-2 border-slate-900 animate-spin"></div>
        </div>
        <div class="text-center">
          <h3 class="text-slate-900 font-bold text-sm">Decoding Strategy...</h3>
          <p class="text-slate-500 text-xs font-mono mt-1">Fetching live data from X</p>
        </div>
      </div>
    </div>
{/if}

<div class="max-w-5xl mx-auto px-4 py-1 pt-00">
    
    <div class="text-center max-w-2xl mx-auto mb-24">
        <h1 class="max-w-3xl mx-auto mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
        Reverse engineer the
        <span class="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">growth strategy</span>
        of any profile.
        </h1>

        <p class="max-w-2xl mx-auto mt-4 text-[13px] sm:text-[15px] text-slate-600 leading-relaxed mb-8">
        Stop guessing what works. Decode viral hooks, posting schedules, and monetization funnels of top creators – then apply them to grow <span class="font-semibold text-slate-900">your own audience.</span>
        </p>

        <form on:submit|preventDefault={handleSearch} class="relative max-w-lg mx-auto group z-20">
            <div class="relative rounded-2xl border border-slate-200 bg-white shadow-subtle px-2 py-1.5 flex items-center gap-2 hover:border-slate-300 transition-colors">
                <div class="pl-2 pr-1 text-slate-400">
                    <i class="fa-brands fa-x-twitter text-sm"></i>
                </div>
                <input
                    type="text"
                    bind:value={searchTerm}
                    placeholder="Enter username (e.g. @elonmusk)"
                    class="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono h-9"
                />
                
                <button
                    type="submit"
                    disabled={isSearching}
                    class="ml-1 h-9 px-4 rounded-xl bg-slate-900 text-[12px] font-semibold text-white flex items-center gap-1.5 shadow-sm hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                    <span>{isSearching ? "Scanning..." : "Analyze"}</span>
                    {#if !isSearching}
                        <i class="fa-solid fa-bolt text-[10px] text-yellow-400"></i>
                    {/if}
                </button>
            </div>
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
            <MonetizationCard data={analyticsData.contentStrategy.monetization} />
            <LengthStrategyCard data={analyticsData.contentStrategy.length} />
        </div>

        <div class="space-y-4">
            <SignalSnapshot signal={analyticsData.signal} profileAvatar={analyticsData.profile.avatarUrl} />
            
            {#if analyticsData.topContent.list.length > 0}
              <TopViralPosts posts={analyticsData.topContent.list} />
            {/if}
            
            <BaselinePerformance baseline={analyticsData.baseline} />
            
            <TopicCloudCard 
                topics={analyticsData.topics.list} 
                handle={analyticsData.profile.handle} 
            />
            
            <ReplyStrategyCard 
                data={analyticsData.replyStrategy} 
                myHandle={analyticsData.profile.handle} 
            />

            <BestTimeChart habits={analyticsData.habits} />
            <AudienceFunnel funnel={analyticsData.funnel} />
        </div>
    </div>
</div>
