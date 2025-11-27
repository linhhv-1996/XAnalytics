<script lang="ts">
    import type { FormatStat } from "$lib/types";
    export let formats: FormatStat[];
</script>

<section class="b-card p-5">
    <div class="flex justify-between items-start mb-5">
        <h4
            class="text-[10px] text-slate-400 uppercase font-medium tracking-[0.18em]"
        >
            Format breakdown
        </h4>
        <span class="text-[10px] text-slate-400">
            <i class="fa-solid fa-filter mr-1 text-[9px]"></i>Last 30 days
        </span>
    </div>

    <div class="space-y-4 text-[12px]">
        {#each formats as format}
            <div class="relative group">
                <div
                    class="flex justify-between font-semibold mb-1 text-slate-50 relative z-10"
                >
                    <span class="flex items-center gap-2">
                        <i
                            class="fa-solid {format.icon} text-slate-400 text-[12px]"
                        ></i>
                        {format.name}
                    </span>
                    <span>{format.multiplier}</span>
                </div>
                <div
                    class="w-full h-8 bg-slate-950 rounded-full border border-slate-800 relative overflow-hidden"
                >
                    <div
                        class="absolute top-0 left-0 h-full {format.colorClass} border-r"
                        style="width: {format.barWidth}%"
                    ></div>
                    {#if format.isWinner}
                        <span
                            class="absolute top-1/2 -translate-y-1/2 right-2 text-[10px] text-emerald-200 font-mono bg-slate-950/80 px-1.5 py-0.5 rounded-full border border-emerald-400/50"
                            >WINNER</span
                        >
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</section>
