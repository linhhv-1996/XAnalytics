<script lang="ts">
    export let data: {
        totalDays: number;
        activeDays: number;
        postsPerDay: string;
        heatmap: { date: string; count: number; level: number }[];
        streak: number;
    };

    function getColor(level: number) {
        switch (level) {
            case 1: return "bg-emerald-900/60 border-emerald-800";
            case 2: return "bg-emerald-600/60 border-emerald-500";
            case 3: return "bg-emerald-500 border-emerald-400";
            case 4: return "bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.6)]";
            default: return "bg-slate-900 border-slate-800/50"; 
        }
    }
</script>

<section class="b-card p-5 !overflow-visible relative z-10">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
        <div>
            <div class="flex items-center gap-2 mb-1">
                <i class="fa-solid fa-calendar-days text-[13px] text-slate-300"></i>
                <h4 class="text-[13px] font-medium text-slate-50">Posting Habit</h4>
            </div>
            <p class="text-[11px] text-slate-400">Last 30 days activity</p>
        </div>

        <div class="flex gap-3 text-[12px]">
            <div class="flex flex-col items-end">
                <span class="text-[10px] uppercase text-slate-500 font-mono">Streak</span>
                <span class="text-[16px] font-semibold text-emerald-400 flex items-center gap-1">
                    {data.streak} <i class="fa-solid fa-fire text-[10px]"></i>
                </span>
            </div>
            <div class="w-[1px] h-8 bg-slate-800"></div>
            <div class="flex flex-col items-end">
                <span class="text-[10px] uppercase text-slate-500 font-mono">Active</span>
                <span class="text-[16px] font-semibold text-slate-50">
                    {data.activeDays}<span class="text-slate-500 text-[11px] font-normal">/{data.totalDays}</span>
                </span>
            </div>
        </div>
    </div>

    <div class="w-full">
        <div class="flex gap-[3px] h-7 items-end w-full"> 
            {#each data.heatmap as day}
                <div class="relative group flex-1 h-full min-w-[3px]">
                    <div 
                        class="w-full h-full rounded-[1px] border {getColor(day.level)} transition-all hover:brightness-125 hover:scale-y-110 origin-bottom cursor-default"
                    ></div>

                    <div class="absolute bottom-[130%] left-1/2 -translate-x-1/2 hidden group-hover:block z-[100] pointer-events-none w-max">
                        <div class="bg-slate-800 text-slate-200 text-[10px] px-2 py-1 rounded border border-slate-600 shadow-lg flex flex-col items-center gap-0.5">
                            <span class="font-mono text-slate-400 text-[9px]">{day.date}</span>
                            <span class="font-semibold text-white">{day.count} posts</span>
                        </div>
                        <div class="w-2 h-2 bg-slate-800 border-r border-b border-slate-600 absolute left-1/2 -translate-x-1/2 -bottom-1 rotate-45"></div>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2">
        <span>30 days ago</span>
        <span class="text-[9px] uppercase tracking-[0.2em] opacity-100 font-semibold">
            Daily Volume
        </span>
        <span>Today</span>
    </div>
</section>
