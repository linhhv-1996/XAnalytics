<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let data: AnalyticsData['contentStrategy']['length'];

    // Helper để lấy màu cho multiplier
    function getScoreColor(score: number) {
        if (score >= 1.2) return 'text-emerald-400'; // Tốt
        if (score >= 0.8) return 'text-zinc-300';    // Trung bình
        return 'text-rose-400';                      // Kém
    }
</script>

<div class="glass-panel rounded-xl p-4">
    <h3 class="text-zinc-400 text-[10px] font-bold uppercase mb-3 flex items-center gap-2">
        <i class="fa-solid fa-ruler-horizontal text-[11px] text-zinc-500"></i> Length Strategy
    </h3>
    
    <div class="space-y-3">
        <div class="flex items-center justify-between text-[10px]">
            <span class="text-zinc-400">Short (&lt;140c)</span>
            <div class="flex flex-col items-end">
                <span class="font-mono {getScoreColor(data.short.score)}">{data.short.score}x Avg</span>
            </div>
        </div>

        <div class="flex items-center justify-between text-[10px]">
            <span class="text-zinc-400">Medium</span>
            <div class="flex flex-col items-end">
                <span class="font-mono {getScoreColor(data.medium.score)}">{data.medium.score}x Avg</span>
            </div>
        </div>

        <div class="flex items-center justify-between text-[10px]">
            <span class="text-zinc-400">Long / Threads</span>
            <div class="flex flex-col items-end">
                <span class="font-mono {getScoreColor(data.long.score)}">{data.long.score}x Avg</span>
            </div>
        </div>

        <p class="text-[9px] text-zinc-500 italic mt-auto pt-2 border-t border-zinc-800/50">
            {data.bestType} formats perform best.
        </p>
    </div>
</div>
