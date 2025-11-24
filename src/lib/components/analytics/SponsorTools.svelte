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

    function getInitialsClass(color: string) {
        const map: Record<string, string> = {
            emerald:
                "border-emerald-400/70 text-emerald-300 shadow-[0_0_24px_rgba(34,197,94,0.7)]",
            sky: "border-sky-400/70 text-sky-300",
            amber: "border-amber-400/70 text-amber-200",
            fuchsia: "border-fuchsia-400/80 text-fuchsia-200",
            cyan: "border-cyan-400/80 text-cyan-200",
            lime: "border-lime-400/80 text-lime-200",
        };
        return map[color] || "border-emerald-400/70 text-emerald-300";
    }

    // Map hover colors for the card
    const hoverClasses: Record<string, string> = {
        emerald:
            "hover:border-emerald-500/70 hover:shadow-[0_26px_70px_rgba(16,185,129,0.45)]",
        sky: "hover:border-sky-500/70 hover:shadow-[0_26px_70px_rgba(56,189,248,0.35)]",
        amber: "hover:border-amber-500/70 hover:shadow-[0_26px_70px_rgba(245,158,11,0.35)]",
        fuchsia:
            "hover:border-fuchsia-500/70 hover:shadow-[0_26px_70px_rgba(217,70,239,0.35)]",
        cyan: "hover:border-cyan-500/70 hover:shadow-[0_26px_70px_rgba(34,211,238,0.35)]",
        lime: "hover:border-lime-500/70 hover:shadow-[0_26px_70px_rgba(190,242,100,0.35)]",
    };
</script>

<div class="mt-7 w-full max-w-4xl px-6">
    <div class="flex flex-col items-center justify-center mb-4 gap-1">
        <span
            class="text-[10px] tracking-[0.22em] uppercase text-slate-500 text-center"
        >
            Supported by
        </span>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
        {#each sponsors as sponsor}
            <a
                href="#"
                class="group block rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/90 px-4 py-4 shadow-[0_20px_55px_rgba(0,0,0,0.85)] transition {hoverClasses[
                    sponsor.badgeColor
                ]}"
            >
                <div class="flex items-stretch gap-4">
                    <!-- Logo column -->
                    <div class="w-14 md:w-16 flex items-center justify-center">
                        <div
                            class="w-11 h-11 md:w-12 md:h-12 rounded-full bg-slate-950 border flex items-center justify-center text-[12px] font-mono {getInitialsClass(
                                sponsor.badgeColor,
                            )}"
                        >
                            {sponsor.initials}
                        </div>
                    </div>

                    <!-- Content column -->
                    <div class="flex-1 flex flex-col justify-between">
                        <div class="flex items-start justify-between gap-2">
                            <div class="space-y-1">
                                <p
                                    class="text-[13px] font-semibold text-slate-50 leading-tight"
                                >
                                    {sponsor.name}
                                </p>
                                <p
                                    class="text-[12px] text-slate-400 leading-relaxed"
                                >
                                    {sponsor.description}
                                </p>
                            </div>
                            <span
                                class="text-[9px] px-2 py-0.5 rounded-full border bg-opacity-40 font-mono whitespace-nowrap {getBadgeClass(
                                    sponsor.badgeColor,
                                )}"
                            >
                                {sponsor.badgeText}
                            </span>
                        </div>

                        <div
                            class="mt-4 flex items-center justify-between text-[11px] text-slate-500"
                        >
                            <span class="font-mono">{sponsor.tagline}</span>
                            <span
                                class="inline-flex items-center gap-1 text-sky-400 group-hover:text-sky-300"
                            >
                                Visit <i
                                    class="fa-solid fa-arrow-up-right-from-square text-[9px]"
                                ></i>
                            </span>
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>
