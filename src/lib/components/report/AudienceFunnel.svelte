<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    export let funnel: AnalyticsData['funnel'];
</script>

<div class="card-soft p-4 h-full">
    <h3 class="text-[11px] font-semibold uppercase mb-4 flex items-center gap-2 tracking-[0.14em] text-slate-700">
        <i class="fa-solid fa-filter text-[11px] text-slate-400"></i> Audience Funnel
    </h3>

    <div class="space-y-4 relative">
        <div class="absolute left-[11px] top-3 bottom-3 w-[2px] bg-slate-100 -z-10"></div>
        
        <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                <div class="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
            </div>
            <div class="flex-1">
                <div class="flex justify-between text-[10px] mb-1 text-slate-500">
                    <span>Avg. Views</span><span class="text-slate-900 font-mono">100%</span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full w-full">
                    <div class="h-full bg-sky-500 w-full rounded-full shadow-[0_0_8px_#38bdf8]"></div>
                </div>
            </div>
        </div>
        
        <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                <div class="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
            </div>
            <div class="flex-1">
                <div class="flex justify-between text-[10px] mb-1 text-slate-500">
                    <span>Likes</span><span class="text-pink-500 font-bold font-mono">{funnel.viewToLike}%</span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full w-full">
                    <div class="h-full bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]" style="width: {Math.min(funnel.viewToLike * 10, 100)}%"></div>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                <div class="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            </div>
            <div class="flex-1">
                <div class="flex justify-between text-[10px] mb-1 text-slate-500">
                    <span>Fans</span><span class="text-purple-500 font-bold font-mono">{funnel.viewToFan}%</span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full w-full">
                    <div class="h-full bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" style="width: {Math.min(funnel.viewToFan * 20, 100)}%"></div>
                </div>
            </div>
        </div>
    </div>
</div>
