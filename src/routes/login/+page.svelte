<script lang="ts">
    import { auth, googleProvider } from '$lib/firebase';
    import { signInWithPopup } from 'firebase/auth';
    import { page } from '$app/stores'; // [!code ++] Thêm import page

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
                // [!code ++] LOGIC REDIRECT MỚI
                // Lấy tham số redirectTo từ URL hiện tại
                const redirectTo = $page.url.searchParams.get('redirectTo');
                
                if (redirectTo) {
                    // Nếu có đích đến, decode và chuyển hướng tới đó
                    window.location.href = decodeURIComponent(redirectTo);
                } else {
                    // Nếu không, về trang chủ như bình thường
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

<div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020617]">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
    <div class="absolute bottom-0 right-0 w-[500px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

    <div class="w-full max-w-[400px] px-4 z-10">
        <div class="flex flex-col items-center justify-center mb-8 animate-fade-in-down">
             <div class="h-14 w-14 rounded-2xl border border-emerald-400/60 bg-slate-950 shadow-[0_14px_40px_rgba(16,185,129,0.3)] overflow-hidden relative flex items-center justify-center mb-4">
                <div class="absolute inset-[-40%] bg-[conic-gradient(at_top,_#22c55e,_#0ea5e9,_#22c55e)] opacity-70 blur-[8px]"></div>
                <span class="relative text-[20px] font-bold text-emerald-50 tracking-tight z-10">PD</span>
            </div>
            <h1 class="text-[20px] font-semibold text-slate-50 tracking-tight">PatternDecoder</h1>
        </div>

        <div class="b-card p-8 bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl relative">
            <div class="text-center mb-8">
                <h2 class="text-[16px] font-medium text-slate-200 mb-2">Welcome back</h2>
                <p class="text-[13px] text-slate-400 leading-relaxed">
                    Sign in to access your analytics history and unlock deeper insights.
                </p>
            </div>

            <button 
                on:click={handleGoogleLogin}
                disabled={isLoading}
                class="group w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-950 font-semibold h-11 rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
                {#if isLoading}
                    <i class="fa-solid fa-circle-notch fa-spin text-slate-600"></i>
                {:else}
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google">
                    <span class="text-[14px]">Sign in with Google</span>
                {/if}
            </button>

            <div class="relative my-8">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-800"></div>
                </div>
                <div class="relative flex justify-center text-[10px] uppercase tracking-widest">
                    <span class="bg-slate-950 px-3 text-slate-600 font-mono">Secure Access</span>
                </div>
            </div>

            <div class="text-center space-y-5">
                <div class="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                    <i class="fa-solid fa-shield-halved text-emerald-500/50"></i>
                    <span>We never post to X on your behalf.</span>
                </div>
                
                <a href="/" class="inline-flex items-center gap-2 text-[12px] text-slate-400 hover:text-emerald-400 transition-colors group">
                    <i class="fa-solid fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
                    Back to home
                </a>
            </div>
        </div>
        
        <p class="text-center mt-8 text-[11px] text-slate-600">
            &copy; {new Date().getFullYear()} PatternDecoder. All rights reserved.
        </p>
    </div>
</div>
