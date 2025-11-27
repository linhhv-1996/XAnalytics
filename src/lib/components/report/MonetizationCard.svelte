<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    export let data: AnalyticsData['contentStrategy']['monetization'];
</script>

<div class="card-soft p-4">
    <h3 class="text-[11px] font-semibold uppercase mb-3 flex items-center gap-2 tracking-[0.14em] text-slate-700">
        <i class="fa-solid fa-link text-[11px] text-slate-400"></i> Link vs. No Link
    </h3>
    
    <div class="space-y-3">
        <div>
            <div class="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>No Link (Pure Content)</span>
                <span class="text-slate-900 font-mono">{data.valueRatio}%</span>
            </div>
            <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-400 transition-all duration-500" style="width: {data.valueRatio}%"></div>
            </div>
        </div>

        <div>
            <div class="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Has Link (Promo/Plug)</span>
                <span class="text-slate-900 font-mono">{data.promoRatio}%</span>
            </div>
            <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-pink-500 transition-all duration-500" style="width: {data.promoRatio}%"></div>
            </div>
        </div>
    </div>
</div>
