<script lang="ts">
    import type { ArchetypeResult } from "$lib/types";
    export let archetype: ArchetypeResult;
</script>

<section class="b-card p-5 relative">
    <div class="flex justify-between items-start mb-5">
        <div>
            <h4
                class="text-[10px] text-slate-400 uppercase font-medium tracking-[0.18em] mb-1"
            >
                Archetype scan
            </h4>
            <div class="flex items-center gap-2">
               <span class="text-[16px] font-semibold text-slate-50">
                    {archetype.name || "Analyzing..."}
                </span>
                <span
                    class="text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/60 bg-emerald-900/30 text-emerald-200 font-semibold"
                    >{archetype.match_score}</span
                >
            </div>
        </div>
        <div
            class="w-9 h-9 bg-slate-950 rounded-full flex items-center justify-center border border-slate-700 text-emerald-400"
        >
            <i class="fa-solid fa-fingerprint text-[15px]"></i>
        </div>
    </div>

    <div class="space-y-3 text-[12px]">
        <div>
            <div
                class="flex justify-between text-[10px] text-slate-400 mb-1 font-mono"
            >
                <span>AGGRESSION</span>
                <span class="text-slate-50">HIGH</span>
            </div>
            <div
                class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800"
            >
                <div
                    class="h-full bg-red-500"
                    style="width: {archetype.aggression}%"
                ></div>
            </div>
        </div>
        <div>
            <div
                class="flex justify-between text-[10px] text-slate-400 mb-1 font-mono"
            >
                <span>POLARIZATION</span>
                <span class="text-slate-50">MED-HIGH</span>
            </div>
            <div
                class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800"
            >
                <div
                    class="h-full bg-amber-400"
                    style="width: {archetype.polarization}%"
                ></div>
            </div>
        </div>
    </div>

    <p
        class="mt-4 text-[12px] text-slate-400 leading-relaxed border-t border-slate-800 pt-3 italic"
    >
        {archetype.description}
    </p>
</section>
