<script lang="ts">

    // Xử lý FAQ accordion
    function toggleFaq(event: MouseEvent) {
        const btn = event.currentTarget as HTMLElement;
        const item = btn.closest('.faq-item') as HTMLElement;
        const body = item.querySelector('[data-faq-body]');
        const icon = item.querySelector('[data-faq-icon]') as HTMLElement;
        const isOpen = !body?.classList.contains('hidden');

        // Close all others
        document.querySelectorAll('.faq-item').forEach(it => {
            it.classList.remove('open');
            it.querySelector('[data-faq-body]')?.classList.add('hidden');
            const ic = it.querySelector('[data-faq-icon]') as HTMLElement;
            if(ic) ic.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
            item.classList.add('open');
            body?.classList.remove('hidden');
            if(icon) icon.style.transform = 'rotate(180deg)';
        }
    }
</script>

<div class="max-w-[1000px] mx-auto px-4 md:px-6 pt-6 pb-12">

    <!-- HERO -->
    <section class="min-h-[70vh] flex items-center justify-center">
      <div class="w-full max-w-2xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 mb-4">
          <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
          <span>Built for solo creators & small teams</span>
        </div>

        <h1 class="text-[30px] md:text-[36px] font-semibold tracking-tight text-slate-50 mb-3">
          Stop guessing what works
          <span class="block text-slate-300">copy the patterns that already do.</span>
        </h1>

        <p class="text-[14px] md:text-[15px] text-slate-400 leading-relaxed mb-6 max-w-xl mx-auto">
          PatternDecoder looks at a public X account and shows you their typical performance, breakout posts, winning topics, and posting window — in one clean report.
        </p>

        <div class="space-y-3">

          <div class="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <span class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              No login. Just paste a handle.
            </span>
          </div>

          <div class="mt-2 flex justify-center text-[11px] text-slate-400">
            <div class="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span class="uppercase tracking-[0.14em] text-[9px] text-slate-400 font-medium">Recently checked</span>
              </div>
              <div class="pd-ticker-viewport-x">
                <div class="pd-ticker-track-x">
                  <div class="pd-ticker-row-x">
                    <button class="pd-ticker-item-x">@paulg</button><span class="pd-dot">•</span>
                    <button class="pd-ticker-item-x">@levelsio</button><span class="pd-dot">•</span>
                    <button class="pd-ticker-item-x">@naval</button><span class="pd-dot">•</span>
                    <button class="pd-ticker-item-x">@tibo_maker</button><span class="pd-dot">•</span>
                  </div>
                  <div class="pd-ticker-row-x">
                    <button class="pd-ticker-item-x">@paulg</button><span class="pd-dot">•</span>
                    <button class="pd-ticker-item-x">@levelsio</button><span class="pd-dot">•</span>
                    <button class="pd-ticker-item-x">@naval</button><span class="pd-dot">•</span>
                    <button class="pd-ticker-item-x">@tibo_maker</button><span class="pd-dot">•</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHAT YOU SEE -->
    <section class="mb-24">
      <div class="max-w-2xl mx-auto text-center mb-6">
        <h2 class="text-[24px] font-semibold text-slate-50 mb-1">What you see in a report</h2>
        <p class="text-[14px] md:text-[15px] text-slate-400">No dashboards, no filters. Just the small set of numbers and patterns that actually help you write better posts.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
        <div class="section-card text-center">
          <div class="flex flex-col items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <i class="fa-solid fa-wave-square text-[11px] text-emerald-300"></i>
            </div>
            <p class="text-[13px] font-medium text-slate-50">Baseline & outliers</p>
          </div>
          <p class="text-[13px] text-slate-400 mb-3">See their “normal” post and the few that clearly break out. You instantly know what’s worth copying.</p>
          <ul class="text-[12px] text-slate-400 space-y-1">
            <li>Typical views, likes, reposts</li>
            <li>Top performing posts (with link)</li>
            <li>How far above baseline they went</li>
          </ul>
        </div>
        <div class="section-card text-center">
          <div class="flex flex-col items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <i class="fa-solid fa-layer-group text-[11px] text-sky-300"></i>
            </div>
            <p class="text-[13px] font-medium text-slate-50">Topics & formats</p>
          </div>
          <p class="text-[13px] text-slate-400 mb-3">Which themes and formats carry their account, and which ones quietly underperform.</p>
          <ul class="text-[12px] text-slate-400 space-y-1">
            <li>Topic groups ranked by reach</li>
            <li>Format breakdown (thread, image, text)</li>
            <li>Clear “do more / post less” suggestions</li>
          </ul>
        </div>
        <div class="section-card text-center">
          <div class="flex flex-col items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <i class="fa-regular fa-clock text-[11px] text-indigo-300"></i>
            </div>
            <p class="text-[13px] font-medium text-slate-50">Posting window</p>
          </div>
          <p class="text-[13px] text-slate-400 mb-3">A simple, visual window of when their posts tend to perform best — no complex charts.</p>
          <ul class="text-[12px] text-slate-400 space-y-1">
            <li>Time of day that spikes engagement</li>
            <li>Days of week that overperform</li>
            <li>Based on their best posts only</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="mb-24">
      <div class="max-w-2xl mx-auto text-center mb-5">
        <h2 class="text-[24px] font-semibold text-slate-50 mb-1">How PatternDecoder works</h2>
        <p class="text-[14px] md:text-[15px] text-slate-400">From handle → useful learning in under a minute.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div class="section-card-soft text-center">
          <p class="text-[11px] text-slate-400 mb-1 font-mono">Step 1</p>
          <p class="text-[13px] font-medium text-slate-50 mb-1">Drop in any public X handle</p>
          <p class="text-[13px] text-slate-400">No API keys, no login. We look at their recent public posts.</p>
        </div>
        <div class="section-card-soft text-center">
          <p class="text-[11px] text-slate-400 mb-1 font-mono">Step 2</p>
          <p class="text-[13px] font-medium text-slate-50 mb-1">We detect patterns & outliers</p>
          <p class="text-[13px] text-slate-400">Which posts spike, what they talk about, and how that compares to their usual numbers.</p>
        </div>
        <div class="section-card-soft text-center">
          <p class="text-[11px] text-slate-400 mb-1 font-mono">Step 3</p>
          <p class="text-[13px] font-medium text-slate-50 mb-1">You model what works</p>
          <p class="text-[13px] text-slate-400">Use the report as a cheat sheet for your own content and experiments.</p>
        </div>
      </div>
    </section>

    <!-- WHO IS THIS FOR -->
    <section class="mb-24">
      <div class="max-w-2xl mx-auto text-center mb-6">
        <h2 class="text-[24px] font-semibold text-slate-50 mb-1">Who is this for?</h2>
        <p class="text-[14px] md:text-[15px] text-slate-400">Light-weight analytics for people who care more about shipping than dashboards.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <i class="fa-solid fa-rocket text-[11px] text-emerald-300"></i>
            </div>
            <p class="text-[13px] font-medium text-slate-50">Solo builders</p>
          </div>
          <p class="text-[13px] text-slate-400">You ship products, not reports. You just want “this kind of post works 3× better” in plain English.</p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <i class="fa-solid fa-pen-nib text-[11px] text-sky-300"></i>
            </div>
            <p class="text-[13px] font-medium text-slate-50">Creators & writers</p>
          </div>
          <p class="text-[13px] text-slate-400">You’re testing hooks, angles, and threads. You want to see which topics and formats actually move the needle.</p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <i class="fa-solid fa-users-line text-[11px] text-indigo-300"></i>
            </div>
            <p class="text-[13px] font-medium text-slate-50">Small teams & clients</p>
          </div>
          <p class="text-[13px] text-slate-400">You need a quick “profile read” before planning content, collabs, or sponsorship packages.</p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="mb-6">
      <div class="max-w-2xl mx-auto text-center mb-5">
        <h2 class="text-[24px] font-semibold text-slate-50 mb-1">FAQ</h2>
        <p class="text-[14px] md:text-[15px] text-slate-400">A few common questions before you drop in your handle.</p>
      </div>

      <div class="space-y-3" id="faq-list">
        <!-- FAQ 1 -->
        <div class="faq-item">
          <button on:click={toggleFaq} class="w-full flex items-center justify-between px-4 py-3 text-left text-[13px] text-slate-100">
            <span>Do I need an X API key or login?</span>
            <i class="fa-solid fa-chevron-down text-[11px] text-slate-400 transition-transform" data-faq-icon></i>
          </button>
          <div class="px-4 pb-3 text-[13px] text-slate-400 hidden" data-faq-body>
            No. PatternDecoder only reads publicly available data from the handle you paste in. You don’t need to connect your account or create an API app.
          </div>
        </div>
        <!-- FAQ 2 -->
        <div class="faq-item">
          <button on:click={toggleFaq} class="w-full flex items-center justify-between px-4 py-3 text-left text-[13px] text-slate-100">
            <span>What kind of accounts does this work best on?</span>
            <i class="fa-solid fa-chevron-down text-[11px] text-slate-400 transition-transform" data-faq-icon></i>
          </button>
          <div class="px-4 pb-3 text-[13px] text-slate-400 hidden" data-faq-body>
            It works best on creators, founders, builders, and brands that post regularly. The more consistent the account, the clearer the patterns.
          </div>
        </div>
        <!-- FAQ 3 -->
        <div class="faq-item">
            <button on:click={toggleFaq} class="w-full flex items-center justify-between px-4 py-3 text-left text-[13px] text-slate-100">
              <span>Can I use this to improve my own account?</span>
              <i class="fa-solid fa-chevron-down text-[11px] text-slate-400 transition-transform" data-faq-icon></i>
            </button>
            <div class="px-4 pb-3 text-[13px] text-slate-400 hidden" data-faq-body>
                Yes. Many people start by analyzing accounts they admire, then run the tool on their own handle to compare baselines, topics, and posting windows.
            </div>
          </div>
          <!-- FAQ 4 -->
          <div class="faq-item">
            <button on:click={toggleFaq} class="w-full flex items-center justify-between px-4 py-3 text-left text-[13px] text-slate-100">
              <span>How many free checks do I get?</span>
              <i class="fa-solid fa-chevron-down text-[11px] text-slate-400 transition-transform" data-faq-icon></i>
            </button>
            <div class="px-4 pb-3 text-[13px] text-slate-400 hidden" data-faq-body>
                Right now you can run up to 10 free analyses. That’s usually enough to scan a few inspiration accounts and your own profile.
            </div>
          </div>
      </div>
    </section>

  </div>
  