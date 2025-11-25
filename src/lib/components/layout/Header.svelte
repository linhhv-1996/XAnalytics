<script lang="ts">
  import { page } from "$app/stores";

  $: user = $page.data.user;

  // The original component had a menu toggle, but the new UI design is minimalist.
  // We'll keep the logout logic attached to the user/login component for now.
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  // Helper function to get initials
  function getUserInitials(name: string | undefined): string {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
</script>

<nav
  class="fixed top-0 inset-x-0 z-50 border-b border-white/[0.02] bg-[#030303]/80 backdrop-blur-xl transition-all duration-300"
>
  <div
    class="max-w-[1100px] mx-auto px-4 h-16 flex items-center justify-between"
  >
    <a href="/" class="flex items-center gap-3 group cursor-pointer">
      <div class="relative w-8 h-8 flex items-center justify-center">
        <div
          class="absolute inset-0 bg-emerald-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>
        <div
          class="relative w-8 h-8 bg-gradient-to-tr from-zinc-100 to-zinc-400 text-black rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)] border border-white/10"
        >
          <i class="fa-solid fa-bolt text-sm"></i>
        </div>
      </div>
      <div class="flex flex-col justify-center">
        <span
          class="font-bold text-[15px] tracking-tight text-white leading-none"
        >
          Pattern<span class="text-zinc-500 font-medium">Decoder</span>
        </span>
      </div>
    </a>

    <div class="flex items-center gap-4">
      <a
        href="#"
        class="hidden sm:block text-[12px] text-zinc-400 hover:text-white transition-colors font-medium"
        >Pricing</a
      >
      <a
        href="#"
        class="hidden sm:block text-[12px] text-zinc-400 hover:text-white transition-colors font-medium mr-2"
        >Methodology</a
      >

      <div class="flex items-center gap-2 pl-4 border-l border-white/10">
        {#if user}
          <div class="relative group">
            <button
              class="flex items-center gap-2 pr-1.5 pl-1.5 py-1 rounded-full bg-zinc-900/50 border border-white/5 hover:border-white/10 hover:bg-zinc-800/50 transition-all peer"
              id="user-menu-button"
            >
              {#if user.picture}
                <img
                  src={user.picture}
                  alt="avatar"
                  class="w-6 h-6 rounded-full border border-zinc-700"
                />
              {:else}
                <div
                  class="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500/30 to-sky-500/30 flex items-center justify-center text-[10px] font-mono text-white shadow-inner border border-white/5"
                >
                  {getUserInitials(user.name)}
                </div>
              {/if}
              <span class="text-[12px] text-white font-medium hidden sm:inline"
                >{user.name}</span
              >
              <i
                class="fa-solid fa-chevron-down text-[8px] text-zinc-600 transition-colors"
              ></i>
            </button>
            <div
              class="absolute right-0 mt-2 w-40 rounded-xl border border-zinc-800 bg-zinc-950/90 shadow-2xl py-1 text-[11px] text-zinc-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <div
                class="px-3 py-1.5 text-zinc-400 border-b border-zinc-800/80 font-medium"
              >
                {user.email || user.name}
              </div>
              <button
                on:click={handleLogout}
                type="button"
                class="w-full text-left px-3 py-1.5 hover:bg-zinc-900 flex items-center gap-2 text-rose-400"
              >
                <i class="fa-solid fa-arrow-right-from-bracket text-[10px]"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        {:else}
          <a
            href="/login"
            class="h-9 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black text-[12px] font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-[0.98] whitespace-nowrap"
          >
            Login
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>
