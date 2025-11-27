<script>
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { page } from '$app/stores';
  import '../app.css';
</script>

{#if $page.url.pathname.startsWith('/login')}
    <slot />
{:else}
    <div class="flex flex-col min-h-screen">
      <Header />
      <main class="flex-grow pt-8">
        <slot />
      </main>
      <Footer />
    </div>
{/if}
