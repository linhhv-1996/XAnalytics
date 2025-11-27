<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    export let funnel: AnalyticsData['funnel'];
</script>

<div class="card-soft p-5 h-full">
    <div class="flex items-center justify-between mb-6">
        <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
            <i class="fa-solid fa-filter text-[11px] text-slate-400"></i> Audience Funnel
        </h3>
    </div>

    <div class="relative pl-2">
        <div class="absolute left-[22px] top-4 bottom-8 w-[2px] bg-slate-100 -z-10"></div>

        <div class="flex gap-4 relative mb-1">
            <div class="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm z-10">
                <i class="fa-regular fa-eye"></i>
            </div>
            <div class="pt-1 flex-1">
                <div class="flex justify-between text-[12px] font-medium text-slate-500 mb-0.5">
                    <span>Impressions</span>
                    <span class="font-mono">100%</span>
                </div>
                <div class="h-1.5 w-full bg-slate-100 rounded-full">
                    <div class="h-full bg-slate-300 rounded-full w-full"></div>
                </div>
            </div>
        </div>

        <div class="flex gap-4 my-2">
            <div class="w-11 flex justify-center">
                <i class="fa-solid fa-arrow-down text-[10px] text-slate-300"></i>
            </div>
            <div class="flex-1">
                <span class="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 inline-block">
                    {funnel.viewToLike}% conversion
                </span>
            </div>
        </div>

        <div class="flex gap-4 relative mb-1">
            <div class="w-11 h-11 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 shadow-sm z-10">
                <i class="fa-solid fa-heart"></i>
            </div>
            <div class="pt-1 flex-1">
                <div class="flex justify-between text-[12px] font-bold text-slate-700 mb-0.5">
                    <span>Interest (Likes)</span>
                    <span class="font-mono">{funnel.viewToLike}%</span>
                </div>
                <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-slate-600 rounded-full" style="width: {Math.min(funnel.viewToLike * 5, 100)}%"></div>
                </div>
            </div>
        </div>

        <div class="flex gap-4 my-2">
            <div class="w-11 flex justify-center">
                <i class="fa-solid fa-arrow-down text-[10px] text-slate-300"></i>
            </div>
            <div class="flex-1">
                 <span class="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 inline-block">
                    High intent
                </span>
            </div>
        </div>

        <div class="flex gap-4 relative">
            <div class="w-11 h-11 rounded-xl bg-slate-900 border border-slate-900 flex items-center justify-center text-emerald-400 shadow-md z-10">
                <i class="fa-solid fa-user-check"></i>
            </div>
            <div class="pt-1 flex-1">
                <div class="flex justify-between text-[12px] font-black text-slate-900 mb-0.5">
                    <span>True Fans</span>
                    <span class="font-mono text-emerald-600">{funnel.viewToFan}%</span>
                </div>
                <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full" style="width: {Math.min(funnel.viewToFan * 10, 100)}%"></div>
                </div>
                <p class="text-[9px] text-slate-400 mt-1.5">
                    Reply or Bookmark (Action takers)
                </p>
            </div>
        </div>
    </div>
</div>
