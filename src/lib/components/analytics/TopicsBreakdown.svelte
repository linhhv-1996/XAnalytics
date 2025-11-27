<script lang="ts">
    import type { TopicStat } from "$lib/types";
    export let topics: TopicStat[];
</script>

<section class="b-card overflow-hidden">
    <div
        class="px-5 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/80"
    >
        <h4 class="text-[13px] font-medium text-slate-50">
            Topics that work (and don’t)
        </h4>
        <span class="pill-soft text-[10px] font-mono">Last 30 days</span>
    </div>
    <table class="w-full text-left text-[12px]">
        <thead>
            <tr class="text-slate-400 border-b border-slate-800 bg-slate-950">
                <th class="p-3 font-medium w-[40%]">Topic group</th>
                <th class="p-3 font-medium w-[15%]">Share of posts</th>
                <th class="p-3 font-medium w-[30%]">Reach vs normal</th>
                <th class="p-3 font-medium w-[15%] text-right">Suggestion</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
            {#each topics as topic}
                <tr class="hover:bg-slate-950/80">
                    <td class="p-3 align-top">
                        <span class="block font-medium text-slate-50 mb-1"
                            >{topic.name}</span
                        >
                        <span
                            class="inline-block text-[11px] text-slate-400 bg-slate-950 border border-slate-800 rounded-lg px-2 py-[2px]"
                        >
                            {topic.description}
                        </span>
                    </td>
                    <td class="p-3 align-top text-slate-300 metric-num"
                        >{topic.share}</td
                    >
                    <td class="p-3 align-top">
                        <div class="space-y-1">
                            <div
                                class="w-full h-2 bg-slate-900 rounded-full relative overflow-hidden"
                            >
                                <div
                                    class="absolute h-full {topic.barColor} rounded-full"
                                    style="left:{topic.barStart}%;width:{topic.barWidth}%;"
                                ></div>
                                <div
                                    class="absolute h-full w-[2px] bg-slate-50 opacity-90"
                                    style="left:35%;"
                                ></div>
                            </div>
                            <div
                                class="flex justify-between text-[10px] font-mono text-slate-400"
                            >
                                <span>{topic.reachMin}</span>
                                <span>{topic.reachAvg}</span>
                                <span>{topic.reachMax}</span>
                            </div>
                        </div>
                    </td>
                    <td class="p-3 align-top text-right">
                        {#if topic.suggestionType === "good"}
                            <span class="pill-soft-green text-[10px]"
                                >{topic.suggestion}</span
                            >
                        {:else if topic.suggestionType === "bad"}
                            <span
                                class="pill-soft text-[10px] text-rose-200 bg-rose-900/40 border border-rose-500/40"
                                >{topic.suggestion}</span
                            >
                        {:else}
                            <span class="pill-soft text-[10px]"
                                >{topic.suggestion}</span
                            >
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>
