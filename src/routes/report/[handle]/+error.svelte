<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="min-h-[70vh] w-full flex flex-col items-center justify-center animate-fade-in-up px-4">
    
    <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100">
        <i class="fa-solid fa-user-slash text-3xl"></i>
    </div>

    <h1 class="text-xl font-bold text-slate-900 mb-3 tracking-tight">
        Unable to analyze profile
    </h1>
    
    <div class="max-w-sm w-full mb-8">
        <p class="text-slate-500 text-sm text-center mb-5 leading-relaxed">
            We couldn't retrieve data for <strong class="text-slate-700">@{$page.params.handle || 'this user'}</strong>.
        </p>

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 text-left">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Possible Reasons</span>
            <ul class="text-xs text-slate-600 space-y-2">
                <li class="flex items-start gap-2">
                    <i class="fa-solid fa-circle-check text-[8px] text-emerald-500 mt-1"></i>
                    <span>Check if the username is correct.</span>
                </li>
                <li class="flex items-start gap-2">
                    <i class="fa-solid fa-lock text-[8px] text-amber-500 mt-1"></i>
                    <span>The account might be private or suspended.</span>
                </li>
                <li class="flex items-start gap-2">
                    <i class="fa-solid fa-wifi text-[8px] text-slate-400 mt-1"></i>
                    <span>Twitter API might be busy. Try refreshing.</span>
                </li>
            </ul>
        </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
            on:click={() => window.location.reload()}
            class="flex-1 h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
        >
            <i class="fa-solid fa-rotate-right text-[11px]"></i>
            <span>Refresh</span>
        </button>

        <a
            href="/"
            class="flex-1 h-10 px-4 rounded-xl bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
        >
            <i class="fa-solid fa-arrow-left text-[11px]"></i>
            <span>Back Home</span>
        </a>
    </div>

    <p class="mt-8 text-[11px] text-slate-300 font-mono">
        Error 404 • Data Unavailable
    </p>

</div>
