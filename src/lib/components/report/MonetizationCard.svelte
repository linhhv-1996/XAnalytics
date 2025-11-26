<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let data: AnalyticsData['contentStrategy']['monetization'];
</script>

<div class="glass-panel rounded-xl p-4">
    <h3 class="text-zinc-400 text-[10px] font-bold uppercase mb-3 flex items-center gap-2">
        <i class="fa-solid fa-wallet text-[11px] text-zinc-500"></i> Monetization Mix
    </h3>
    
    <div class="space-y-3">
        <div>
            <div class="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>Value Posts (No link)</span>
                <span class="text-white font-mono">{data.valueRatio}%</span>
            </div>
            <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-400 transition-all duration-500" style="width: {data.valueRatio}%"></div>
            </div>
        </div>

        <div>
            <div class="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>Promo/Plug (Has link)</span>
                <span class="text-white font-mono">{data.promoRatio}%</span>
            </div>
            <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div class="h-full bg-pink-500 transition-all duration-500" style="width: {data.promoRatio}%"></div>
            </div>
        </div>

        <p class="text-[9px] text-zinc-500 italic mt-2 border-t border-zinc-800/50 pt-2">
            "{data.frequency}."
        </p>
    </div>
</div>
