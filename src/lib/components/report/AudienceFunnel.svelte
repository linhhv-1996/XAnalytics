<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let funnel: AnalyticsData['funnel'];
</script>

<div class="glass-panel rounded-xl p-4">
    <h3 class="text-zinc-400 text-[10px] font-bold uppercase mb-4 flex items-center gap-2">
        <i class="fa-solid fa-filter text-[11px]"></i> Audience Funnel
    </h3>

    <div class="space-y-4 relative">
        <div class="absolute left-[11px] top-3 bottom-3 w-0.5 bg-zinc-800 -z-10"></div>
        
        <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center z-10">
                <div class="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
            </div>
            <div class="flex-1">
                <div class="flex justify-between text-[10px] mb-1 text-zinc-400">
                    <span>Avg. Views (Public Reach)</span><span>100%</span>
                </div>
                <div class="h-1.5 bg-zinc-900 rounded-full w-full">
                    <div class="h-full bg-blue-500 w-full rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                </div>
            </div>
        </div>
        
        <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center z-10">
                <div class="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
            </div>
            <div class="flex-1">
                <div class="flex justify-between text-[10px] mb-1 text-zinc-400">
                    <span>Likes (Approvals)</span>
                    <span class="text-pink-400 font-bold font-mono">{funnel.viewToLike}%</span>
                </div>
                <div class="h-1.5 bg-zinc-900 rounded-full w-full">
                    <div class="h-full bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]" 
                         style="width: {Math.min(funnel.viewToLike * 10, 100)}%"></div>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center z-10">
                <div class="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            </div>
            <div class="flex-1">
                <div class="flex justify-between text-[10px] mb-1 text-zinc-400">
                    <span>Comments/Saves (Fans)</span>
                    <span class="text-purple-400 font-bold font-mono">{funnel.viewToFan}%</span>
                </div>
                <div class="h-1.5 bg-zinc-900 rounded-full w-full">
                    <div class="h-full bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]" 
                         style="width: {Math.min(funnel.viewToFan * 20, 100)}%"></div>
                </div>
            </div>
        </div>
    </div>
</div>
