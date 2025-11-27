<script lang="ts">
    export let bestTime: { time: string; timezone: string; days: string };
</script>

<section class="b-card">
    <div
        class="px-5 py-3 border-b border-slate-800 bg-slate-950/80 flex items-center gap-2"
    >
        <i class="fa-regular fa-clock text-[13px] text-slate-300"></i>
        <h4 class="text-[13px] font-medium text-slate-50">
            Best time to post (their data)
        </h4>
    </div>
    <div class="p-5 flex flex-col md:flex-row gap-7 items-center text-[13px]">
        <div class="md:w-1/3">
            <div class="flex items-baseline gap-2">
                <span class="text-[30px] metric-num font-semibold text-slate-50"
                    >{bestTime.time}</span
                >
                <span class="text-[11px] text-slate-400 font-medium"
                    >{bestTime.timezone}</span
                >
            </div>
            <p class="mt-2 text-slate-300">
                Strongest days:
                <span class="font-medium text-slate-50">{bestTime.days}</span>
            </p>
            <p class="mt-1 text-[11px] text-slate-400">
                Based on posts that performed above their usual average.
            </p>
        </div>
        <div class="md:w-2/3 w-full space-y-2">
            <div
                class="flex justify-between text-[10px] font-mono text-slate-500"
            >
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
            </div>
            <div
                class="h-8 w-full bg-slate-900 rounded-full flex overflow-hidden border border-slate-800"
            >
                <div class="h-full flex-1 bg-slate-900"></div>
                <div class="h-full flex-1 bg-slate-800"></div>
                <div
                    class="h-full flex-1 bg-gradient-to-r from-sky-500 via-emerald-400 to-emerald-500 relative group cursor-default"
                >
                    <span
                        class="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-slate-50 text-[10px] px-2 py-0.5 rounded shadow-md border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >Peak window</span
                    >
                </div>
                <div class="h-full flex-1 bg-slate-800"></div>
                <div class="h-full flex-1 bg-slate-900"></div>
            </div>
        </div>
    </div>
</section>
