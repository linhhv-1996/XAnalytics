<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let signal: AnalyticsData['signal'];
    export let profileAvatar: string;
    $: isPinned = signal?.type === 'Pin Tweet';
    $: cardIcon = isPinned ? 'fa-solid fa-thumbtack' : 'fa-solid fa-signal';
</script>

{#if signal}
<div class="card flex flex-col relative overflow-hidden group">
    <div class="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100">
        <div class="flex items-center gap-2">
            <i class="{cardIcon} text-slate-400 text-[11px]"></i>
            <h3 class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                {signal.title}
            </h3>
        </div>
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-[9px] font-mono text-amber-700">
            <i class="fa-solid fa-bolt text-[8px]"></i>
            {signal.type}
        </span>
    </div>

    <div class="px-4 pb-4 pt-3 space-y-3.5">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-[11px] text-slate-500">
                <div class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                    <img src={profileAvatar.replace('_normal', '_400x400')} class="w-full h-full object-cover" alt="Avatar">
                </div>
                <span class="font-mono">{signal.createdAt}</span>
            </div>
            <a href={signal.url} target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-slate-900 transition-colors p-1">
                <i class="fa-solid fa-arrow-up-right-from-square text-[12px]"></i>
            </a>
        </div>

        <div class="relative">
            <i class="fa-solid fa-quote-left absolute -top-2 -left-3 text-slate-100 text-3xl -z-10"></i>
            <a href={signal.url} target="_blank" rel="noopener noreferrer" class="block group-hover:text-slate-600 transition-colors">
                <p class="text-[13px] md:text-[14px] text-slate-900 leading-relaxed font-medium line-clamp-6">
                    "{signal.text}"
                </p>
            </a>
        </div>

        <div class="flex items-center gap-4 text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
            <span class="flex items-center gap-1.5 text-slate-900" title="Views">
                <i class="fa-solid fa-chart-simple"></i> {signal.views}
            </span>
            <span class="flex items-center gap-1.5" title="Likes">
                <i class="fa-solid fa-heart"></i> {signal.likes}
            </span>
            <span class="ml-auto text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                {signal.multiplier} baseline
            </span>
        </div>
    </div>
</div>
{/if}
