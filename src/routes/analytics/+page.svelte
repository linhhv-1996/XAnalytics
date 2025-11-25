<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import type { AnalyticsData } from "$lib/types";

  // Import Components giữ nguyên
  import SponsorTools from "$lib/components/analytics/SponsorTools.svelte";
  import SponsorToolsCards from "$lib/components/analytics/SponsorToolsCards.svelte";
  import SearchBar from "$lib/components/analytics/SearchBar.svelte";
  import ProfileCard from "$lib/components/analytics/ProfileCard.svelte";
  import PinnedPost from "$lib/components/analytics/PinnedPost.svelte";
  import OrganicOutliers from "$lib/components/analytics/OrganicOutliers.svelte";
  import TypicalPerformance from "$lib/components/analytics/TypicalPerformance.svelte";
  import Archetype from "$lib/components/analytics/Archetype.svelte";
  import FormatBreakdown from "$lib/components/analytics/FormatBreakdown.svelte";
  import TopicsBreakdown from "$lib/components/analytics/TopicsBreakdown.svelte";
  import BestTimeToPost from "$lib/components/analytics/BestTimeToPost.svelte";
  import AICommandCenter from "$lib/components/analytics/AIWriting.svelte";
    import ConsistencyCheck from "$lib/components/analytics/ConsistencyCheck.svelte";
    import ContentMix from "$lib/components/analytics/ContentMix.svelte";

  // State
  let isLoading = true;
  let loadingLog = "Initializing...";
  let data: AnalyticsData | null = null;
  let showDashboard = false;
  let showAI = false;

  // Biến theo dõi handle hiện tại để tránh re-run không cần thiết
  let currentHandle = "";

  // 1. Task Call API
  async function fetchAnalyticsData(handle: string): Promise<AnalyticsData> {
    const res = await fetch(`/api/analytics?handle=${handle}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }

  // 2. Task Chạy Animation (Cố định 7s)
  async function runLoadingAnimation() {
    const logs = [
      "Collecting recent posts…",
      "Finding standout posts…",
      "Checking topics and themes…",
      "Estimating best time to post…",
      "Finalizing report…",
    ];
    const STEP_DURATION = 1400; // 5 bước * 1.4s = 7s

    for (let log of logs) {
      loadingLog = log;
      await new Promise((r) => setTimeout(r, STEP_DURATION));
    }
  }

  // 3. Hàm Main chạy phân tích (Tách ra khỏi onMount)
  async function startAnalysis(handle: string) {
    // Reset state để hiện màn hình loading lại
    isLoading = true;
    showDashboard = false;
    showAI = false;
    loadingLog = "Initializing...";
    currentHandle = handle;

    try {
      // Chạy song song API và Animation
      const [apiResult, _] = await Promise.all([
        fetchAnalyticsData(handle),
        runLoadingAnimation(),
      ]);

      data = apiResult;
      isLoading = false;

      // Hiệu ứng hiện Dashboard
      setTimeout(() => {
        showDashboard = true;
        window.scrollTo(0, 0);
        setTimeout(() => {
          showAI = true;
        }, 300);
      }, 100);
    } catch (error) {
      console.error("Error loading report:", error);
      loadingLog = "Error loading data.";
    }
  }

  // --- LOGIC REACTIVE (QUAN TRỌNG) ---
  // Mỗi khi $page.url thay đổi (do goto), dòng này sẽ chạy lại
  $: handleParam = $page.url.searchParams.get("handle") || "elonmusk";
  $: user = $page.data.user;

  // Tự động chạy startAnalysis khi handle thay đổi VÀ đã có user
  $: if (browser && handleParam && user) {
    startAnalysis(handleParam);
  }

  // Check login lúc mới vào (bảo vệ Client-side)
  onMount(() => {
    if (!user) {
      const currentPath = encodeURIComponent(
        $page.url.pathname + $page.url.search,
      );
      goto(`/login?redirectTo=${currentPath}`);
    }
  });
</script>

{#if isLoading}
  <section
    id="processing-modal"
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md"
  >
    <div
      class="w-full max-w-sm p-6 text-center space-y-4 bg-slate-950 rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.9)] border border-slate-800"
    >
      <div class="relative w-12 h-12 mx-auto">
        <div
          class="absolute inset-0 border-[3px] border-slate-800 rounded-full"
        ></div>
        <div
          class="absolute inset-0 border-[3px] border-t-emerald-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
        ></div>
        <div
          class="absolute inset-0 flex items-center justify-center text-emerald-400"
        >
          <i class="fa-solid fa-bolt text-[14px]"></i>
        </div>
      </div>
      <div class="space-y-1">
        <h3 class="text-[14px] font-medium text-slate-50">
          Analyzing @{$page.url.searchParams.get("handle") || "..."}
        </h3>
        <div class="text-[12px] text-slate-400 font-mono h-5 overflow-hidden">
          {loadingLog}
        </div>
      </div>
    </div>
    <!-- <SponsorTools sponsors={data?.sponsors}/> -->
  </section>
{/if}

{#if !isLoading && data}
  <section
    class="opacity-0 transition-opacity duration-500 ease-out"
    class:opacity-100={showDashboard}
  >
    <div class="max-w-[1000px] mx-auto px-4 md:px-6 py-7 space-y-7">
      <section class="pt-2 mb-4">
        <div class="w-full max-w-2xl mx-auto text-center">
          <div
            class="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 mb-4"
          >
            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            <span>Analyze another X profile</span>
          </div>

          <h1
            class="text-[20px] md:text-[22px] font-semibold tracking-tight text-slate-50 mb-2"
          >
            Don’t stop at one report
            <span class="block text-slate-300"
              >drop another handle and rerun this view.</span
            >
          </h1>

          <p
            class="text-[12px] md:text-[13px] text-slate-400 mb-4 max-w-xl mx-auto"
          >
            Paste any public handle to spin up a fresh PatternDecoder report
            with the same layout, ads and insights.
          </p>

          <SearchBar compact={true} />
        </div>
      </section>

      <ProfileCard profile={data.profile} />

      {#if data.pinnedPost.text}
        <PinnedPost post={data.pinnedPost} />
      {/if}

      <OrganicOutliers posts={data.outliers} />

      <TypicalPerformance metrics={data.performance} />

      <!-- <SponsorToolsCards sponsors={data.sponsors} /> -->

      <div class="grid md:grid-cols-1 gap-6"> 
          <ConsistencyCheck data={data.consistency} />
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <Archetype archetype={data.archetype} />
        <FormatBreakdown formats={data.formats} />
      </div>

      <ContentMix data={data.contentMix} />

      <TopicsBreakdown topics={data.topics} />
      <BestTimeToPost bestTime={data.bestTime} />
    </div>
  </section>
{/if}

<!-- {#if showAI}
  <AICommandCenter />
{/if} -->
