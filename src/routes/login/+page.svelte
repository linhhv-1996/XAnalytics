<script lang="ts">
    import { auth, googleProvider } from '$lib/firebase';
    import { signInWithPopup } from 'firebase/auth';
    import { page } from '$app/stores';

    let isLoading = false;

    async function handleGoogleLogin() {
        if (isLoading) return;
        isLoading = true;
        try {
            const userCred = await signInWithPopup(auth, googleProvider);
            const idToken = await userCred.user.getIdToken();

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ idToken }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                const redirectTo = $page.url.searchParams.get('redirectTo');
                if (redirectTo) {
                    window.location.href = decodeURIComponent(redirectTo);
                } else {
                    window.location.href = '/';
                }
            } else {
                alert('Login failed. Please try again.');
            }
        } catch (e) {
            console.error("Login error:", e);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
    <div class="fixed inset-0 pointer-events-none -z-10">
        <div class="absolute inset-0 bg-grid-light opacity-60"></div>
    </div>
    
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

    <div class="w-full max-w-[400px] px-4 z-10">
        <div class="flex flex-col items-center justify-center mb-8 animate-fade-in-up">
             <div class="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-[0_10px_30px_rgba(16,185,129,0.25)] flex items-center justify-center mb-4 text-white">
                <i class="fa-solid fa-bolt text-xl"></i>
            </div>
            <h1 class="text-[22px] font-bold text-slate-900 tracking-tight">PatternDecoder</h1>
        </div>

        <div class="card p-8 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl relative">
            <div class="text-center mb-8">
                <h2 class="text-[16px] font-semibold text-slate-900 mb-2">Welcome back</h2>
                <p class="text-[13px] text-slate-500 leading-relaxed">
                    Sign in to access analytics history and unlock deeper insights.
                </p>
            </div>

            <button 
                on:click={handleGoogleLogin}
                disabled={isLoading}
                class="group w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold h-11 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {#if isLoading}
                    <i class="fa-solid fa-circle-notch fa-spin text-slate-400"></i>
                {:else}
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google">
                    <span class="text-[14px]">Sign in with Google</span>
                {/if}
            </button>

            <div class="relative my-8">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-100"></div>
                </div>
                <div class="relative flex justify-center text-[11px] uppercase tracking-widest">
                    <span class="bg-white px-3 text-slate-400 font-mono">Secure Access</span>
                </div>
            </div>

            <div class="text-center space-y-5">
                <div class="flex items-center justify-center gap-2 text-[11px] text-slate-500 bg-slate-50 py-2 rounded-lg border border-slate-100">
                    <i class="fa-solid fa-shield-halved text-emerald-500"></i>
                    <span>We never post to X on your behalf.</span>
                </div>
                
                <a href="/" class="inline-flex items-center gap-2 text-[12px] text-slate-400 hover:text-emerald-600 transition-colors group">
                    <i class="fa-solid fa-arrow-left text-[11px] group-hover:-translate-x-1 transition-transform"></i>
                    Back to home
                </a>
            </div>
        </div>
        
        <p class="text-center mt-8 text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} PatternDecoder. All rights reserved.
        </p>
    </div>
</div>
