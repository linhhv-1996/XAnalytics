<script lang="ts">
    import type { PerformanceMetrics } from "$lib/types";
    export let metrics: PerformanceMetrics;
</script>

<section class="b-card">
    <div
        class="px-5 py-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between"
    >
        <div class="flex items-center gap-2">
            <i class="fa-solid fa-chart-line text-[13px] text-slate-300"></i>
            <span class="text-[13px] font-medium text-slate-50"
                >Typical performance (last 30 days)</span
            >
        </div>
        <span class="pill-soft text-[10px]">For context</span>
    </div>
    <div class="p-5 grid grid-cols-4 gap-4 text-[13px]">
        <div>
            <p class="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                Avg. views / post
            </p>
            <p class="text-[18px] font-semibold metric-num text-slate-50">
                {metrics.avgViews}
            </p>
        </div>
        <div>
            <p class="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                Avg. likes / post
            </p>
            <p class="text-[18px] font-semibold metric-num text-slate-50">
                {metrics.avgLikes}
            </p>
        </div>
        <div>
            <p class="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
                Avg. reposts / post
            </p>
            <p class="text-[18px] font-semibold metric-num text-slate-50">
                {metrics.avgReposts}
            </p>
        </div>
        <div>
            <p
                class="text-[10px] uppercase tracking-wide text-slate-400 mb-1 flex items-center gap-1"
            >
                Speed of engagement
                <i
                    class="fa-solid fa-circle-info text-[11px] text-slate-400"
                    title="Rough speed of likes + reposts in the first hours after posting."
                ></i>
            </p>
            <p class="text-[18px] font-semibold metric-num text-emerald-300">
                {metrics.speedOfEngagement}
            </p>
        </div>
    </div>
</section>
