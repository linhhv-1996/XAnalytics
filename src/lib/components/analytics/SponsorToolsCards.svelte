<script lang="ts">
    import type { Sponsor } from "$lib/types";
    export let sponsors: Sponsor[];

    function getBadgeClass(color: string) {
        const map: Record<string, string> = {
            emerald: "bg-emerald-900/40 border-emerald-500/50 text-emerald-200",
            sky: "bg-sky-900/40 border-sky-500/50 text-sky-200",
            amber: "bg-amber-900/40 border-amber-500/50 text-amber-100",
            fuchsia: "bg-fuchsia-900/40 border-fuchsia-500/50 text-fuchsia-100",
            cyan: "bg-cyan-900/40 border-cyan-500/50 text-cyan-100",
            lime: "bg-lime-900/40 border-lime-500/50 text-lime-100",
        };
        return map[color] || map.emerald;
    }
</script>

<section class="b-card">
    <div
        class="px-5 py-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between"
    >
        <div class="flex items-center gap-2">
            <i class="fa-solid fa-bullhorn text-[13px] text-slate-300"></i>
            <div>
                <p class="text-[13px] font-medium text-slate-50">
                    Tools this audience actually uses
                </p>
                <p class="text-[11px] text-slate-400">
                    Hand-picked sponsors for builders & creators.
                </p>
            </div>
        </div>
        <span class="pill-soft text-[10px] uppercase tracking-[0.18em]"
            >Ad spots</span
        >
    </div>
    <div class="p-5 grid md:grid-cols-3 gap-4 text-[12px]">
        {#each sponsors as sponsor}
            <article
                class="border border-slate-800 rounded-xl p-4 bg-slate-950/80 hover:border-slate-600 hover:bg-slate-900/90 hover:shadow-xl transition flex flex-col justify-between h-full"
            >
                <div>
                    <div class="flex items-start justify-between gap-2 mb-3">
                        <div>
                            <p
                                class="text-[10px] uppercase tracking-[0.18em] text-slate-500"
                            >
                                Sponsored
                            </p>
                            <p
                                class="text-[13px] font-semibold text-slate-50 mt-1"
                            >
                                {sponsor.name}
                            </p>
                        </div>
                        <span
                            class="text-[10px] font-mono px-2 py-0.5 rounded-full border {getBadgeClass(
                                sponsor.badgeColor,
                            )}"
                        >
                            {sponsor.badgeText}
                        </span>
                    </div>
                    <p class="text-slate-300 leading-relaxed">
                        {sponsor.description}
                    </p>
                </div>
                <div
                    class="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between"
                >
                    <span class="text-[10px] text-slate-500 font-mono"
                        >{sponsor.tagline}</span
                    >
                    <a
                        href="#"
                        class="text-[11px] font-medium text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
                    >
                        Visit sponsor <i
                            class="fa-solid fa-arrow-up-right-from-square text-[9px]"
                        ></i>
                    </a>
                </div>
            </article>
        {/each}
    </div>
</section>
