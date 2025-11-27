<script lang="ts">
    export let data: any[] = []; 

    function formatFollowers(num: number) {
        return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
    }
</script>

<div class="card-soft p-5 h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
            <i class="fa-solid fa-chess-queen text-[11px] text-slate-400"></i> Top Following
        </h3>
        <span class="text-[9px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
            {data.length} VIPs
        </span>
    </div>

    {#if data && data.length > 0}
        <div class="flex flex-wrap gap-2.5 justify-center content-start">
            {#each data as user}
                <a href="https://x.com/{user.handle}" target="_blank" rel="noopener noreferrer" 
                   class="group relative block"
                >
                    <div class="relative w-11 h-11 rounded-full p-[2px] border border-slate-200 bg-white group-hover:border-emerald-400 group-hover:shadow-md transition-all duration-200">
                        <img 
                            src={user.avatar.replace('_normal', '_400x400')} 
                            alt={user.handle} 
                            class="w-full h-full rounded-full object-cover bg-slate-100"
                            loading="lazy"
                        >
                        {#if user.isVerified}
                            <div class="absolute -bottom-0.5 -right-0.5 bg-white rounded-full border border-white flex items-center justify-center w-4 h-4 shadow-sm">
                                <i class="fa-solid fa-circle-check text-[10px] text-sky-500"></i>
                            </div>
                        {/if}
                    </div>

                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-max pointer-events-none">
                        <div class="bg-slate-900 text-white text-[10px] px-3 py-2 rounded-lg shadow-xl flex flex-col items-center gap-0.5 border border-slate-700/50">
                            <span class="font-bold">{user.name}</span>
                            <span class="text-slate-400 font-mono text-[9px]">@{user.handle}</span>
                            <div class="mt-1 pt-1 border-t border-slate-700 w-full text-center font-mono text-emerald-400 font-bold">
                                {formatFollowers(user.followers)} followers
                            </div>
                            
                            <div class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900"></div>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {:else}
        <div class="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 min-h-[100px]">
            <span class="text-[11px] font-medium">No VIPs found</span>
        </div>
    {/if}
</div>
