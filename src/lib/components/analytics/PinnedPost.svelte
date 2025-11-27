<script lang="ts">
    import type { PinnedPost } from "$lib/types";
    export let post: PinnedPost;
</script>

<section class="b-card">
    <div
        class="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80"
    >
        <div class="flex items-center gap-2">
            <i class="fa-solid fa-thumbtack text-[11px] text-slate-300"></i>
            <span class="text-[13px] font-medium text-slate-50"
                >Pinned post (evergreen)</span
            >
        </div>
        <span class="pill-soft-green text-[10px]">Good to study</span>
    </div>
    <div class="p-5 flex flex-col md:flex-row gap-5 text-[13px]">
        <div class="md:w-3/5">
            <p class="text-slate-300 leading-relaxed">{post.text}</p>
            <div
                class="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono"
            >
                <div class="flex gap-4">
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
                    <span class="flex items-center gap-1 text-amber-300"
                        >age: {post.age}</span
                    >
                </div>
                <a
                    target="_blank"
                    href="{post.url}"
                    class="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                >
                    View on X <i
                        class="fa-solid fa-arrow-up-right-from-square text-[10px]"
                    ></i>
                </a>
            </div>
        </div>
        <div
            class="md:w-2/5 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5 space-y-3 text-[12px]"
        >
            <div>
                <p
                    class="text-[11px] uppercase tracking-wide text-slate-400 mb-1"
                >
                    Main goal
                </p>
                <p class="text-slate-50">{post.goal}</p>
            </div>
            <div>
                <p
                    class="text-[11px] uppercase tracking-wide text-slate-400 mb-1"
                >
                    Type
                </p>
                <p class="text-slate-50">{post.type}</p>
            </div>
            <div>
                <p
                    class="text-[11px] uppercase tracking-wide text-slate-400 mb-1"
                >
                    Estimated clicks
                </p>
                <p class="text-emerald-300">{post.clickThrough}</p>
            </div>
        </div>
    </div>
</section>
