<script lang="ts">
  import DemoReport from "$lib/components/DemoReport.svelte";
  import AudienceFunnel from "$lib/components/report/AudienceFunnel.svelte";
  import BaselinePerformance from "$lib/components/report/BaselinePerformance.svelte";
  import BestTimeChart from "$lib/components/report/BestTimeChart.svelte";
  import LengthStrategyCard from "$lib/components/report/LengthStrategyCard.svelte";
  import MonetizationCard from "$lib/components/report/MonetizationCard.svelte";
  import ProfileCard from "$lib/components/report/ProfileCard.svelte";
  import SignalSnapshot from "$lib/components/report/SignalSnapshot.svelte";
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

    // Clean handle (remove @ or url)
    let handle = inputValue.trim();
    if (handle.startsWith("@")) handle = handle.slice(1);
    if (handle.includes("x.com/"))
      handle = handle.split("x.com/")[1].split("/")[0];
    if (handle.includes("twitter.com/"))
      handle = handle.split("twitter.com/")[1].split("/")[0];

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

<main class="max-w-[1100px] mx-auto px-4 py-8 relative z-10 pt-16">
  {#if isLoading}
    <div
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        class="glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
      >
        <div class="relative w-12 h-12">
          <div
            class="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"
          ></div>
          <div
            class="absolute inset-2 rounded-full border-t-2 border-emerald-300 animate-spin reverse"
            style="animation-direction: reverse; animation-duration: 1s;"
          ></div>
        </div>
        <div class="text-center">
          <h3 class="text-white font-bold text-lg">Decoding Strategy...</h3>
          <p class="text-zinc-400 text-xs font-mono mt-1">
            Fetching live data from X
          </p>
        </div>
      </div>
    </div>
  {/if}

  <section class="mb-20 text-center relative">
    <div
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm mb-6 animate-fade-in-up"
    >
      <span class="relative flex h-2 w-2">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
        ></span>
      </span>
      <span
        class="text-[10px] uppercase tracking-[0.15em] text-emerald-400 font-bold font-mono"
      >
        Live Intelligence V2.0
      </span>
    </div>

    <h1
      class="max-w-4xl mx-auto text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]"
    >
      Reverse Engineer the <br class="hidden md:block" />
      <span
        class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
        >Growth Strategy</span
      > of Any Profile.
    </h1>

    <p
      class="max-w-2xl mx-auto text-sm sm:text-[16px] text-zinc-400 leading-relaxed mb-10"
    >
      Stop guessing what works. Instantly decode the viral hooks, posting
      schedules, and monetization funnels of successful creators—then apply them
      to
      <span class="text-zinc-200 font-medium">grow your own audience.</span>
    </p>

    <form
      on:submit|preventDefault={handleAnalyze}
      class="max-w-[500px] mx-auto relative group"
    >
      <div
        class="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition duration-500"
      ></div>

      <div
        class="relative flex items-center bg-[#0A0A0A] rounded-xl border border-white/10 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        <div class="pl-3.5 pr-2 text-zinc-500">
          <i class="fa-brands fa-x-twitter text-sm"></i>
        </div>
        <input
          type="text"
          bind:value={inputValue}
          placeholder="Analyze a competitor (e.g. @hormozi)"
          class="flex-1 bg-transparent border-none text-sm text-white placeholder-zinc-600 focus:ring-0 focus:outline-none h-10 font-mono"
        />
        <div class="hidden sm:flex items-center gap-1.5 pr-2">
          <kbd
            class="hidden md:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium text-zinc-500 bg-zinc-900 border border-zinc-800 rounded rounded-[4px] font-mono"
            >⌘K</kbd
          >
        </div>

        <button
          type="submit"
          disabled={isLoading}
          class="h-9 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black text-[12px] font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-[0.98] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isLoading ? "Scanning..." : "Decode Strategy"}</span>
          {#if !isLoading}
            <i
              class="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"
            ></i>
          {/if}
        </button>
      </div>
      {#if error}
        <div
          class="text-rose-400 text-xs mt-3 bg-rose-500/10 inline-block px-3 py-1 rounded border border-rose-500/20"
        >
          <i class="fa-solid fa-triangle-exclamation mr-1"></i>
          {error}
        </div>
      {/if}
    </form>

    <div
      class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] text-zinc-500 font-mono opacity-70"
    >
      <span class="flex items-center gap-1.5">
        <i class="fa-solid fa-check text-emerald-500/80"></i> For Creators & Brands
      </span>
      <span class="hidden sm:inline w-1 h-1 bg-zinc-800 rounded-full"></span>
      <span class="flex items-center gap-1.5">
        <i class="fa-solid fa-check text-emerald-500/80"></i> Unlock Viral Structures
      </span>
      <span class="hidden sm:inline w-1 h-1 bg-zinc-800 rounded-full"></span>
      <span class="flex items-center gap-1.5">
        <i class="fa-solid fa-bolt text-yellow-500/80"></i> AI Pattern Recognition
      </span>
    </div>
  </section>

  {#if analyticsData}
    <div
      class="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-5 items-start animate-fade-in-up"
    >
      <div class="space-y-4">
        <ProfileCard
          profile={analyticsData.profile}
          habits={analyticsData.habits}
          network={analyticsData.network}
          traffic={analyticsData.traffic}
        />

        <div
          class="glass-panel rounded-xl p-6 text-center text-zinc-500 text-xs border-dashed border-zinc-800"
        >
          Other side widgets coming soon...
        </div>
      </div>

      <div class="space-y-4">
        <SignalSnapshot
          signal={analyticsData.signal}
          profileAvatar={analyticsData.profile.avatarUrl}
        />
        {#if analyticsData.topContent.list.length > 0}
          <TopViralPosts posts={analyticsData.topContent.list} />
        {/if}
        <BaselinePerformance baseline={analyticsData.baseline} />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MonetizationCard data={analyticsData.contentStrategy.monetization} />
          <LengthStrategyCard data={analyticsData.contentStrategy.length} />
        </div>
        <BestTimeChart habits={analyticsData.habits} />
        
        <AudienceFunnel funnel={analyticsData.funnel} />
      </div>
    </div>
  {:else}
    <DemoReport />
  {/if}
</main>
