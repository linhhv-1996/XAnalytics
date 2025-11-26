<script lang="ts">
    import type { AnalyticsData } from '$lib/types';

    export let posts: AnalyticsData['topContent']['list'];

    function getRankColor(index: number) {
        if (index === 0) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        if (index === 1) return 'text-zinc-300 bg-zinc-300/10 border-zinc-300/20';
        return 'text-amber-600 bg-amber-600/10 border-amber-600/20';
    }
</script>

<div class="glass-panel rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
        <h3 class="text-zinc-400 text-[10px] font-bold uppercase flex items-center gap-2">
            <i class="fa-solid fa-fire text-[11px] text-orange-500"></i> Viral Hits
        </h3>
        <span class="text-[9px] text-zinc-600 font-mono">Top 3 Posts</span>
    </div>

    <div class="space-y-2">
        {#each posts as post, i}
            <a href={post.url} target="_blank" rel="noopener noreferrer" class="block group">
                <div class="flex items-start gap-3 p-2.5 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all">
                    <div class="mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border {getRankColor(i)}">
                        {i + 1}
                    </div>

                    <div class="flex-1 min-w-0">
                        <p class="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed group-hover:text-white transition-colors mb-1.5">
                            {post.text}
                        </p>
                        
                        <div class="flex items-center justify-between text-[10px] text-zinc-500">
                            <span class="font-mono">{post.date}</span>
                            
                            <div class="flex items-center gap-3">
                                <span class="flex items-center gap-1 text-emerald-400 bg-emerald-400/5 px-1.5 rounded">
                                    <i class="fa-solid fa-chart-simple text-[9px]"></i> {post.views}
                                </span>
                                
                                <span class="flex items-center gap-1" title="Likes">
                                    <i class="fa-solid fa-heart text-[9px]"></i> {post.likes}
                                </span>

                                <span class="flex items-center gap-1" title="Replies">
                                    <i class="fa-regular fa-comment text-[9px]"></i> {post.replies}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>
