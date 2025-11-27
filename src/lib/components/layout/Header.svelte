<script lang="ts">
  import { page } from "$app/stores";

  $: user = $page.data.user;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  function getUserInitials(name: string | undefined): string {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }
</script>

<nav class="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md backdrop-saturate-150 border-b border-slate-200/60 transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
  <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
    
    <a href="/" class="flex items-center gap-3 cursor-pointer group select-none">
        <div class="relative">
            <div class="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-xl opacity-20 blur group-hover:opacity-40 transition duration-500"></div>
            <div class="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-sm ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-300">
              <i class="fa-solid fa-bolt text-sm"></i>
            </div>
        </div>
        <div class="flex flex-col leading-none gap-0.5">
          <span class="text-[16px] font-bold tracking-tight text-slate-900 group-hover:text-black transition-colors">
            Pattern<span class="text-slate-500 font-semibold group-hover:text-slate-700">Decoder</span>
          </span>
          <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-emerald-600 transition-colors">
            Creator Intelligence
          </span>
        </div>
    </a>

    <div class="flex items-center">
      {#if user}
          <div class="relative group py-2">
            <button class="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all active:scale-95">
              {#if user.picture}
                <img src={user.picture} alt="avatar" class="w-7 h-7 rounded-full object-cover ring-2 ring-white" />
              {:else}
                <div class="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                    {getUserInitials(user.name)}
                </div>
              {/if}
              <span class="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">{user.name}</span>
              <i class="fa-solid fa-chevron-down text-[10px] opacity-50"></i>
            </button>
        
            <div class="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-100 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
              <div class="px-4 py-2.5 border-b border-slate-50 mb-1">
                <p class="text-xs font-semibold text-slate-900">Signed in as</p>
                <p class="text-[11px] text-slate-500 truncate font-mono mt-0.5">{user.email || user.name}</p>
              </div>
              
              <button on:click={handleLogout} type="button" class="w-full text-left px-4 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-between">
                <span>Sign out</span>
                <i class="fa-solid fa-arrow-right-from-bracket opacity-70"></i>
              </button>
            </div>
          </div>
        {:else}
          <a href="/login" class="group h-9 px-5 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wide hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2">
            <span>Start Free</span>
            <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
          </a>
        {/if}
    </div>
  </div>
</nav>
