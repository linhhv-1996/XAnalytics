<script lang="ts">
    import type { AnalyticsData } from '$lib/types';
    export let posts: AnalyticsData['topContent']['list'];

    function getRankColor(index: number) {
        if (index === 0) return 'bg-amber-50 text-amber-700 border-amber-200';
        if (index === 1) return 'bg-sky-50 text-sky-700 border-sky-200';
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
</script>

<div class="card-soft p-4">
    <div class="flex items-center justify-between mb-3">
        <h3 class="text-[11px] font-semibold uppercase flex items-center gap-2 tracking-[0.14em] text-slate-700">
            <span class="text-amber-500 text-sm">🏆</span> Top Viral Posts
        </h3>
        <span class="text-[9px] text-slate-400 font-mono">Top 3 Posts</span>
    </div>

    <div class="space-y-2.5">
        {#each posts as post, i}
            <a href={post.url} target="_blank" rel="noopener noreferrer" class="block group">
                <div class="rounded-lg border border-slate-100 bg-white p-3 hover:border-slate-200 hover:bg-slate-50 transition-colors">
                    <div class="flex items-center justify-between mb-1.5">
                        <span class="px-2 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-wide {getRankColor(i)}">
                            #{i + 1} Viral Hit
                        </span>
                        <span class="text-[9px] text-slate-400 font-mono">{post.date}</span>
                    </div>

                    <p class="text-[12px] text-slate-900 leading-relaxed font-mono line-clamp-2 mb-2 group-hover:text-slate-700">
                        {post.text}
                    </p>
                    
                    <div class="flex items-center gap-3 text-[10px] text-slate-500">
                        <span class="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-1.5 rounded">
                            <i class="fa-solid fa-chart-simple"></i> {post.views}
                        </span>
                        <span class="flex items-center gap-1"><i class="fa-solid fa-heart"></i> {post.likes}</span>
                        <span class="flex items-center gap-1"><i class="fa-regular fa-comment"></i> {post.replies}</span>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>
