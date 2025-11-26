<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let signal: AnalyticsData['signal'];
    export let profileAvatar: string;

    $: isPinned = signal?.type === 'Pin Tweet';
    $: cardIcon = isPinned ? 'fa-solid fa-thumbtack' : 'fa-solid fa-signal';
</script>

{#if signal}
<div class="glass-panel rounded-xl flex flex-col relative overflow-hidden group hover:border-zinc-700 transition-colors">
    <div class="flex items-center justify-between px-4 pt-4 pb-2.5 border-b border-zinc-800/60">
        <div class="flex items-center gap-2">
            <i class="{cardIcon} text-zinc-400 text-[11px]"></i>
            <h3 class="text-zinc-200 text-[11px] font-bold uppercase tracking-wider">
                {signal.title}
            </h3>
        </div>
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[9px] font-mono text-emerald-300">
            <i class="fa-solid fa-bolt text-[8px]"></i>
            {signal.type}
        </span>
    </div>

    <div class="px-4 pb-4 pt-3 space-y-3.5">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-[11px] text-zinc-500">
                <div class="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-700 overflow-hidden">
                    <img src={profileAvatar.replace('_normal', '_400x400')} class="w-full h-full object-cover" alt="Avatar">
                </div>
                <span class="font-mono">{signal.createdAt}</span>
            </div>
            
            <a href={signal.url} target="_blank" rel="noopener noreferrer" class="text-zinc-600 hover:text-zinc-300 transition-colors p-1" title="View on X">
                <i class="fa-solid fa-arrow-up-right-from-square text-[12px]"></i>
            </a>
        </div>

        <div class="relative">
            <i class="fa-solid fa-quote-left absolute -top-2 -left-3 text-zinc-800 text-3xl -z-10"></i>
            <a href={signal.url} target="_blank" rel="noopener noreferrer" class="block group-hover:text-zinc-100 transition-colors">
                <p class="text-[13px] md:text-[14px] text-zinc-200 leading-relaxed font-medium line-clamp-6">
                    "{signal.text}"
                </p>
            </a>
            </div>

        <div class="flex items-center gap-3 text-[10px] text-zinc-400 border-t border-zinc-800/60 pt-2.5">
            <span class="flex items-center gap-1.5" title="Views">
                <i class="fa-solid fa-chart-simple"></i> {signal.views}
            </span>
            
            <span class="flex items-center gap-1.5 text-zinc-200" title="Likes">
                <i class="fa-solid fa-heart"></i> {signal.likes}
            </span>
            
            <span class="flex items-center gap-1.5" title="Replies">
                <i class="fa-regular fa-comment"></i> {signal.replies}
            </span>
            
            <span class="ml-auto text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                {signal.multiplier} baseline
            </span>
        </div>
    </div>
</div>
{/if}
