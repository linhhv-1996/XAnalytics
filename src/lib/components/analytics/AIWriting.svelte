<script lang="ts">
    let isExpanded = false;
    let isGenerating = false;
    let showResult = false;
    let prompt = "";
    let resultText = "";

    function toggleBar() {
        isExpanded = !isExpanded;
    }

    function tryGenerate() {
        if (!prompt.trim()) return;
        isGenerating = true;

        // Simulate delay
        setTimeout(() => {
            isGenerating = false;
            showResult = true;
            resultText = `Most people overthink how to talk about ${prompt}. So they post nothing.<br><br>
          The easiest way to stand out is to share what you&#39;re actually doing, in public, in simple words.<br><br>
          Tell one small story, one clear lesson, and one gentle nudge for people to follow along.
          <br><br>
          What&#39;s one honest story you can share today? 👇`;
        }, 850);
    }

    function hideResult() {
        showResult = false;
    }

    function copyToClipboard(btn: HTMLButtonElement) {
        if (!resultText) return;
        navigator.clipboard
            .writeText(resultText.replace(/<br>/g, "\n"))
            .then(() => {
                const original = btn.innerHTML;
                btn.innerHTML = `<i class="fa-solid fa-check text-emerald-300 text-[11px]"></i>`;
                setTimeout(() => (btn.innerHTML = original), 650);
            });
    }
</script>

<div
    id="ai-command-center"
    class="fixed bottom-4 left-0 right-0 z-40 transition-transform duration-200"
    class:translate-y-[140%]={false}
>
    <div class="max-w-[900px] mx-auto px-4 md:px-6">
        <!-- Collapsed -->
        {#if !isExpanded}
            <div id="ai-collapsed">
                <button
                    on:click={toggleBar}
                    class="w-full md:w-auto mx-auto flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-950 border border-slate-800 shadow-[0_16px_40px_rgba(0,0,0,0.9)] text-[11px] text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                >
                    <span
                        class="w-6 h-6 rounded-full bg-emerald-900/40 border border-emerald-500/60 flex items-center justify-center"
                    >
                        <i
                            class="fa-solid fa-wand-magic-sparkles text-emerald-300 text-[11px]"
                        ></i>
                    </span>
                    <div class="overflow-hidden">
                        <div class="ai-cta-text">
                            <span class="text-[11px] text-slate-300"
                                >Turn these insights into post ideas for your
                                own account…</span
                            >
                        </div>
                    </div>
                    <span
                        class="hidden sm:inline-flex items-center gap-1 ml-1 text-[11px] font-mono text-slate-400"
                    >
                        <span class="w-1.5 h-1.5 rounded-full bg-slate-500"
                        ></span>
                        Open
                    </span>
                </button>
            </div>
        {/if}

        <!-- Expanded -->
        {#if isExpanded}
            <div id="ai-expanded" class="mt-2">
                <div class="ai-shell bg-slate-950 overflow-hidden">
                    <!-- Result -->
                    {#if showResult}
                        <div
                            id="result-area"
                            class="border-b border-slate-800 bg-slate-950"
                        >
                            <div class="p-4">
                                <div
                                    class="flex justify-between items-center mb-2"
                                >
                                    <div
                                        class="flex items-center gap-2 text-[11px] text-emerald-300"
                                    >
                                        <span
                                            class="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                        ></span>
                                        Draft generated
                                    </div>
                                    <div class="flex gap-2">
                                        <button
                                            on:click={(e) =>
                                                copyToClipboard(
                                                    e.currentTarget,
                                                )}
                                            class="btn-ghost"
                                            title="Copy"
                                        >
                                            <i
                                                class="fa-regular fa-copy text-[11px]"
                                            ></i>
                                        </button>
                                        <button
                                            on:click={hideResult}
                                            class="btn-ghost"
                                            title="Close"
                                        >
                                            <i
                                                class="fa-solid fa-xmark text-[11px]"
                                            ></i>
                                        </button>
                                    </div>
                                </div>
                                <div
                                    class="ai-result-box p-3 text-[13px] text-slate-100 leading-relaxed max-h-[40vh] overflow-y-auto result-scroll"
                                >
                                    {@html resultText}
                                </div>
                            </div>
                        </div>
                    {/if}

                    <!-- Input -->
                    <div class="px-4 py-4 bg-slate-950">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <div
                                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800"
                                >
                                    <i
                                        class="fa-solid fa-wand-magic-sparkles text-emerald-300 text-[11px]"
                                    ></i>
                                    <span class="text-[11px] text-slate-300"
                                        >Get a post idea based on this profile</span
                                    >
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <span
                                    class="text-[10px] font-mono text-slate-400"
                                    >Credits: <span class="text-slate-100"
                                        >0</span
                                    ></span
                                >
                                <button
                                    on:click={toggleBar}
                                    class="btn-ghost !w-7 !h-7 flex items-center justify-center"
                                    title="Collapse"
                                >
                                    <i
                                        class="fa-solid fa-chevron-down text-[10px]"
                                    ></i>
                                </button>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <textarea
                                bind:value={prompt}
                                placeholder="What do you want to talk about? (MRR, AI, lessons, story…)"
                                rows="3"
                                class="w-full min-h-[70px] max-h-32 bg-slate-950 border border-slate-800 rounded-xl text-[13px] text-slate-100 placeholder-slate-500 px-3 py-2.5 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/70 resize-none"
                            ></textarea>
                            <button
                                on:click={tryGenerate}
                                disabled={isGenerating}
                                class="btn-primary w-full h-9 flex items-center justify-center gap-2"
                            >
                                {#if isGenerating}
                                    <i
                                        class="fa-solid fa-circle-notch fa-spin text-[13px]"
                                    ></i>
                                {:else}
                                    Generate draft
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
