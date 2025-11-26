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

<nav class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200/70 transition-all duration-300">
  <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
    <a href="/" class="flex items-center gap-2 cursor-pointer group">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform">
          <i class="fa-solid fa-bolt text-xs"></i>
        </div>
        <div class="flex flex-col leading-tight">
          <span class="text-[15px] font-semibold tracking-tight text-slate-900">
            Pattern<span class="text-slate-500 font-medium">Decoder</span>
          </span>
          <span class="text-[11px] text-slate-400">
            Creator intelligence
          </span>
        </div>
    </a>

    <div class="flex items-center gap-4">
      <a href="#" class="hidden sm:inline text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
      <a href="#" class="hidden sm:inline text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors">Methodology</a>

      <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>

      {#if user}
          <div class="relative group">
            <button class="flex items-center gap-2 text-[12px] px-2.5 py-1 rounded-full bg-slate-900 text-white font-medium shadow-sm hover:bg-slate-800 transition-colors">
              {#if user.picture}
                <img src={user.picture} alt="avatar" class="w-4 h-4 rounded-full border border-slate-600" />
              {:else}
                <span>{getUserInitials(user.name)}</span>
              {/if}
              <span class="hidden sm:inline">{user.name}</span>
              <i class="fa-solid fa-chevron-down text-[8px] opacity-70"></i>
            </button>
            
            <div class="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white shadow-xl py-1 text-[11px] text-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="px-3 py-1.5 text-slate-400 border-b border-slate-100 font-medium truncate">
                {user.email || user.name}
              </div>
              <button on:click={handleLogout} type="button" class="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-rose-500">
                <i class="fa-solid fa-arrow-right-from-bracket text-[10px]"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        {:else}
          <a href="/login" class="h-8 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-medium transition-all flex items-center gap-2 shadow-sm active:scale-[0.98]">
            Login
          </a>
        {/if}
    </div>
  </div>
</nav>
