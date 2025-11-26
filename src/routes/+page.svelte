<script lang="ts">
  import DemoReport from "$lib/components/DemoReport.svelte";
  import AudienceFunnel from "$lib/components/report/AudienceFunnel.svelte";
  import BaselinePerformance from "$lib/components/report/BaselinePerformance.svelte";
  import BestTimeChart from "$lib/components/report/BestTimeChart.svelte";
  import LengthStrategyCard from "$lib/components/report/LengthStrategyCard.svelte";
  import MonetizationCard from "$lib/components/report/MonetizationCard.svelte";
  import ProfileCard from "$lib/components/report/ProfileCard.svelte";
  import ReplyStrategyCard from "$lib/components/report/ReplyStrategyCard.svelte";
  import SignalSnapshot from "$lib/components/report/SignalSnapshot.svelte";
  import TopicCloudCard from "$lib/components/report/TopicCloudCard.svelte";
  import TopViralPosts from "$lib/components/report/TopViralPosts.svelte";
  import type { AnalyticsData } from "$lib/types";

  let inputValue = "";
  let isLoading = false;
  let analyticsData: AnalyticsData | null = null;
  let error: string | null = null;

  async function handleAnalyze() {
    if (!inputValue.trim()) return;
    isLoading = true;
    error = null;
    let handle = inputValue.trim();
    if (handle.startsWith("@")) handle = handle.slice(1);
    if (handle.includes("x.com/")) handle = handle.split("x.com/")[1].split("/")[0];
    if (handle.includes("twitter.com/")) handle = handle.split("twitter.com/")[1].split("/")[0];

    try {
      const res = await fetch(`/api/analytics?handle=${handle}`);
      const data = await res.json();
      if (res.ok) {
        analyticsData = data;
      } else {
        error = data.error || "Failed to analyze profile";
      }
    } catch (e) {
      console.error(e);
      error = "Something went wrong. Please try again.";
    } finally {
      isLoading = false;
    }
  }
</script>

<main class="max-w-5xl mx-auto px-4 pt-10 pb-12 relative z-10">
  {#if isLoading}
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

  <section class="text-center mb-14 relative">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50/80 text-emerald-700 text-[11px] font-mono uppercase tracking-[0.16em] animate-fade-in-up">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      Live Intelligence v2.0
    </div>

    <h1 class="max-w-3xl mx-auto mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
      Reverse engineer the
      <span class="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">growth strategy</span>
      of any profile.
    </h1>

    <p class="max-w-2xl mx-auto mt-4 text-[13px] sm:text-[15px] text-slate-600 leading-relaxed mb-8">
      Stop guessing what works. Decode viral hooks, posting schedules, and monetization funnels of top creators – then apply them to grow <span class="font-semibold text-slate-900">your own audience.</span>
    </p>

    <form on:submit|preventDefault={handleAnalyze} class="mt-8 max-w-xl mx-auto group relative z-20">
      <div class="relative rounded-2xl border border-slate-200 bg-white shadow-subtle px-2 py-1.5 flex items-center gap-2 hover:border-slate-300 transition-colors">
        <div class="pl-2 pr-1 text-slate-400">
          <i class="fa-brands fa-x-twitter text-sm"></i>
        </div>
        <input
          type="text"
          bind:value={inputValue}
          placeholder="Analyze a competitor (e.g. @hormozi)"
          class="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono h-9"
        />
        <div class="hidden sm:flex items-center gap-1.5 pr-1">
            <kbd class="hidden md:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded">⌘K</kbd>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          class="ml-1 h-9 px-4 rounded-xl bg-slate-900 text-[12px] font-semibold text-white flex items-center gap-1.5 shadow-sm hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          <span>{isLoading ? "Scanning..." : "Decode strategy"}</span>
          {#if !isLoading}
            <i class="fa-solid fa-arrow-right -rotate-45 text-[11px]"></i>
          {/if}
        </button>
      </div>
      {#if error}
        <div class="text-rose-500 text-xs mt-3 bg-rose-50 inline-block px-3 py-1 rounded border border-rose-100">
          <i class="fa-solid fa-triangle-exclamation mr-1"></i> {error}
        </div>
      {/if}
    </form>

    <div class="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-500 opacity-80">
      <span class="flex items-center gap-1"><i class="fa-solid fa-check text-emerald-500"></i> Creators & brands</span>
      <span class="flex items-center gap-1"><i class="fa-solid fa-bolt text-amber-500"></i> AI pattern recognition</span>
      <span class="flex items-center gap-1"><i class="fa-regular fa-circle-dot text-sky-500"></i> No API keys needed</span>
    </div>
  </section>

  {#if analyticsData}
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
        <TopicCloudCard />
        <ReplyStrategyCard />

        <!-- <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MonetizationCard data={analyticsData.contentStrategy.monetization} />
          <LengthStrategyCard data={analyticsData.contentStrategy.length} />
        </div> -->
        
        <!-- <div class="grid grid-cols-1 md:grid-cols-[1.4fr_1.6fr] gap-4"> -->
            <BestTimeChart habits={analyticsData.habits} />
            <AudienceFunnel funnel={analyticsData.funnel} />
        <!-- </div> -->
      </div>
    </div>
  {:else}
    <DemoReport />
  {/if}
</main>
