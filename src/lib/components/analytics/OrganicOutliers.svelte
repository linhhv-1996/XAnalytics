<script lang="ts">
    import type { OutlierPost } from "$lib/types";
    export let posts: OutlierPost[];
</script>

<section class="b-card">
    <div
        class="px-5 py-3 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between bg-slate-950/80 gap-2"
    >
        <div>
            <div class="flex items-center gap-2">
                <i
                    class="fa-solid fa-fire-flame-curved text-[13px] text-emerald-300"
                ></i>
                <span class="text-[13px] font-medium text-slate-50"
                    >Organic outliers (top posts)</span
                >
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">
                Posts that clearly outperform their usual baseline.
            </p>
        </div>
        <span class="pill-soft-green text-[10px]">Best to reverse-engineer</span
        >
    </div>
    <div class="p-5 grid md:grid-cols-3 gap-5 text-[13px]">
        {#each posts as post}
            <div
                class="border border-slate-700 rounded-xl p-4 bg-slate-950/80 hover:border-slate-500 hover:shadow-xl transition-all flex flex-col justify-between h-52"
            >
                <div>
                    <div
                        class="flex justify-between mb-3 text-[10px] text-slate-400"
                    >
                        <span
                            class={post.tagColor === "blue"
                                ? "pill-soft-blue text-[10px]"
                                : "pill-soft text-[10px]"}
                            >{post.performance}</span
                        >
                        <span class="font-mono">{post.timeAgo}</span>
                    </div>
                    <p class="text-slate-300 leading-relaxed line-clamp-3">
                        {post.text}
                    </p>
                </div>
                <div
                    class="flex items-center justify-between pt-3 mt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400"
                >
                    <div class="flex gap-3">
                        <span class="flex items-center gap-1"
                            ><i class="fa-regular fa-eye text-[12px]"></i>
                            {post.view}</span
                        >

                        <span class="flex items-center gap-1"
                            ><i class="fa-regular fa-heart text-[12px]"></i>
                            {post.likes}</span
                        >
                        <span class="flex items-center gap-1"
                            ><i class="fa-regular fa-comment text-[12px]"></i>
                            {post.comments}</span
                        >
                    </div>
                    <a  target="_blank"
                        href="{post.url}"
                        class="text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                        View <i
                            class="fa-solid fa-arrow-up-right-from-square text-[10px]"
                        ></i>
                    </a>
                </div>
            </div>
        {/each}
    </div>
</section>
