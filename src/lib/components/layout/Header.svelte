<script lang="ts">
  import { page } from '$app/stores';

  let isMenuOpen = false;

  function toggleUserMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('#user-menu-button') && !target.closest('#user-menu')) {
      isMenuOpen = false;
    }
  }

  $: user = $page.data.user;
  async function handleLogout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
  }
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="fixed inset-x-0 top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
  <div class="max-w-[1000px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-3">
    <!-- Left: brand -->
    <a href="/" class="group flex items-center gap-2.5">
      <div class="h-8 w-8 rounded-2xl border border-emerald-400/60 bg-slate-950 shadow-[0_14px_40px_rgba(16,185,129,0.7)] overflow-hidden relative">
        <div class="absolute inset-[-40%] bg-[conic-gradient(at_top,_#22c55e,_#0ea5e9,_#22c55e)] opacity-70 blur-[6px]"></div>
        <div class="relative w-full h-full flex items-center justify-center">
          <span class="text-[13px] font-semibold text-emerald-50 tracking-tight">PD</span>
        </div>
      </div>
      <span class="text-[15px] md:text-[16px] font-semibold tracking-tight text-slate-50 group-hover:text-emerald-100 transition-colors">PatternDecoder</span>
    </a>

    <!-- Right: credits + user -->
<div class="flex items-center gap-2.5 md:gap-3 text-[11px]">
      
      {#if user}
          <div class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-800 bg-slate-950/90">
            <span class="w-4 h-4 rounded-full bg-emerald-900/60 border border-emerald-500/70 flex items-center justify-center">
              <i class="fa-solid fa-bolt text-[9px] text-emerald-300"></i>
            </span>
            <span class="text-slate-400">Credits</span>
            <span id="write-credits" class="font-medium text-slate-100 metric-num">5</span> 
          </div>

          <div class="relative">
            <button id="user-menu-button" type="button" on:click={toggleUserMenu} class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 hover:bg-slate-900 hover:border-slate-600 transition text-left">
              {#if user.picture}
                <img src={user.picture} alt="avatar" class="w-6 h-6 rounded-full border border-slate-700" />
              {:else}
                 <div class="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 via-emerald-400 to-emerald-500 flex items-center justify-center text-[11px] font-semibold text-slate-950">{user.name?.charAt(0) || 'U'}</div>
              {/if}
              <span class="hidden sm:inline text-[11px] text-slate-50 font-medium">{user.name}</span>
              <i class="fa-solid fa-chevron-down text-[9px] text-slate-500 sm:ml-0.5"></i>
            </button>

            {#if isMenuOpen}
            <div id="user-menu" class="absolute right-0 mt-2 w-40 rounded-xl border border-slate-800 bg-slate-950 shadow-[0_18px_50px_rgba(0,0,0,0.85)] py-1 text-[11px] text-slate-200">
              <button type="button" class="w-full text-left px-3 py-1.5 hover:bg-slate-900 flex items-center gap-2">
                <i class="fa-solid fa-coins text-[10px] text-amber-300"></i>
                <span>Buy credits</span>
              </button>
              <div class="my-1 border-t border-slate-800"></div>
              <button on:click={handleLogout} type="button" class="w-full text-left px-3 py-1.5 hover:bg-slate-900 flex items-center gap-2 text-rose-300">
                <i class="fa-solid fa-arrow-right-from-bracket text-[10px]"></i>
                <span>Logout</span>
              </button>
            </div>
            {/if}
          </div>

      {:else}
          <a href="/login" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-950 font-semibold text-[12px] hover:bg-white transition shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Login
          </a>
      {/if}

    </div>
  </div>
</nav>
