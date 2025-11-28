<script lang="ts">
    export let interactions: { type: string, date: string, text: string }[] = [];
    export let targetHandle: string; // Handle IDOL
    export let myHandle: string;     // Handle Của Mình

    function getInteractionLink() {
        const t = targetHandle.replace('@', '');
        const m = myHandle.replace('@', '');
        const query = `(from:${m}) (to:${t})`;      
        return `https://x.com/search?q=${encodeURIComponent(query)}&src=typed_query`;
    }
</script>

<div class="p-0 bg-slate-50/50">
    <div class="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Interactions</h4>
        <span class="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-0.5 rounded-full shadow-sm">
            {interactions.length} replies
        </span>
    </div>

    <div class="flex flex-col bg-white">
        {#each interactions as item}
            <a href={getInteractionLink()} target="_blank" class="group flex items-center justify-between px-6 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                <div class="flex items-center gap-3 min-w-0 flex-1 mr-4">
                    <div class="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0">
                        <i class="fa-solid fa-reply text-sm"></i>
                    </div>
                    <span class="text-sm text-slate-600 truncate font-medium group-hover:text-slate-900 transition-colors">
                        {item.text}
                    </span>
                </div>

                <span class="text-xs text-slate-400 font-mono whitespace-nowrap shrink-0">
                    {item.date}
                </span>
            </a>
        {/each}
    </div>
    
    <div class="py-3 text-center border-t border-slate-100 bg-slate-50">
        <a href={getInteractionLink()} target="_blank" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
            View full history on X &rarr;
        </a>
    </div>
</div>
