<script lang="ts">
    // Data cho phần "How it works"
    const steps = [
        {
            icon: "fa-solid fa-magnifying-glass",
            title: "1. Analyze Profile",
            desc: "Enter any public X handle. Our engine fetches their recent tweets, replies, and engagement data instantly.",
            color: "text-sky-600 bg-sky-50 border-sky-100"
        },
        {
            icon: "fa-solid fa-microchip",
            title: "2. Pattern Recognition",
            desc: "AI scans for viral hooks, posting schedules, and content structures that consistently drive high engagement.",
            color: "text-emerald-600 bg-emerald-50 border-emerald-100"
        },
        {
            icon: "fa-solid fa-arrow-trend-up",
            title: "3. Apply & Grow",
            desc: "Get a clear report with actionable insights. Replicate their success strategy for your own audience.",
            color: "text-amber-600 bg-amber-50 border-amber-100"
        }
    ];

    // Data cho phần FAQ
    const faqs = [
        {
            q: "Do I need to login with X / Twitter?",
            a: "No. We use public data analysis. You don't need to connect your X account, meaning zero risk to your profile."
        },
        {
            q: "Is this tool free?",
            a: "Yes, the core analysis features are currently free to use. We might introduce premium features for deep historical data in the future."
        },
        {
            q: "Can I analyze private accounts?",
            a: "No. PatternDecoder only works on public profiles. We cannot access protected tweets."
        },
        {
            q: "How is 'Viral Odds' calculated?",
            a: "We compare a user's median performance against their top outliers. A high score means they frequently break out of their follower bubble."
        }
    ];
</script>

<div class="space-y-8 animate-fade-in-up">
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {#each steps as step}
            <div class="card-soft p-5 flex flex-col items-start h-full hover:border-slate-300 transition-colors">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border {step.color}">
                    <i class="{step.icon} text-lg"></i>
                </div>
                <h3 class="text-slate-900 font-bold text-[14px] mb-2">{step.title}</h3>
                <p class="text-slate-500 text-[12px] leading-relaxed">
                    {step.desc}
                </p>
            </div>
        {/each}
    </div>

    <div class="card p-6 md:p-8">
        <div class="flex items-center gap-2 mb-6">
            <i class="fa-regular fa-circle-question text-slate-400"></i>
            <h3 class="text-slate-900 font-bold text-lg tracking-tight">Frequently Asked Questions</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {#each faqs as faq}
                <div class="space-y-2">
                    <h4 class="text-[13px] font-semibold text-slate-800 flex items-start gap-2">
                        <span class="text-emerald-500 mt-0.5">•</span>
                        {faq.q}
                    </h4>
                    <p class="text-[12px] text-slate-500 leading-relaxed pl-3.5 border-l border-slate-100">
                        {faq.a}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</div>
