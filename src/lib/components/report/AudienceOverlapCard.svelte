<script lang="ts">
    export let overlapPercent: number;
    export let totalCommon: number;
    export let topCommonVips: { handle: string, avatar: string }[] = [];
</script>

<div class="p-6 bg-white">
    <div class="flex items-center justify-between mb-5">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Audience Match</h4>
        <span class="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-100">High Affinity</span>
    </div>
    
    <div class="flex gap-6 items-center">
        <div class="flex flex-col items-center min-w-[90px] shrink-0">
            <span class="text-5xl font-black text-slate-900 tracking-tighter leading-none">{overlapPercent}%</span>
            <span class="text-xs text-slate-500 font-medium mt-1">Similarity</span>
        </div>

        <div class="w-px h-12 bg-slate-100 shrink-0"></div>

        <div class="flex-1 min-w-0 overflow-hidden">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-1.5">
                    <span class="text-sm font-semibold text-slate-700">Shared Connections</span>
                    <span class="text-xs text-slate-400 font-mono">({totalCommon})</span>
                </div>
                <i class="fa-solid fa-arrow-right-long text-slate-300 text-xs"></i>
            </div>
            
            <div class="flex gap-2 overflow-x-auto py-2 pl-1 scrollbar-hide -mr-6 pr-6 mask-fade-right">
                {#each topCommonVips as vip}
                    <a href="https://x.com/{vip.handle}" target="_blank" class="shrink-0 relative group" title="@{vip.handle}">
                        <div class="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 group-hover:border-indigo-500 group-hover:scale-110 group-hover:shadow-md transition-all duration-200 ease-out overflow-hidden">
                            <img src={vip.avatar} alt={vip.handle} class="w-full h-full object-cover" />
                        </div>
                    </a>
                {/each}
                <div class="w-1 shrink-0"></div>
            </div>
        </div>
    </div>
</div>

<style>
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .mask-fade-right {
        mask-image: linear-gradient(to right, black 85%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
    }
</style>
