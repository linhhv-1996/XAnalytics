<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores"; // [!code ++]

    export let compact = false;
    let handle = "";

    function handleSubmit() {
        if (!handle) return;
        
        // Clean handle (bỏ @ nếu user lỡ nhập)
        const cleanHandle = handle.replace('@', '').trim();
        const user = $page.data.user;

        if (user) {
            // [!code ++] Thêm &ref=timestamp để luôn kích hoạt thay đổi URL
            goto(`/analytics?handle=${cleanHandle}&ref=${Date.now()}`);
        } else {
            const targetUrl = encodeURIComponent(`/analytics?handle=${cleanHandle}`);
            goto(`/login?redirectTo=${targetUrl}`);
        }
    }
</script>

{#if compact}
    <form
        on:submit|preventDefault={handleSubmit}
        class="modern-input flex items-center px-2 py-1.5 max-w-xl mx-auto"
    >
        <div class="pl-2 pr-2 text-slate-400">
            <i class="fa-brands fa-x-twitter text-[18px]"></i>
        </div>
        <input
            bind:value={handle}
            type="text"
            placeholder="Enter X handle (e.g. elonmusk, levelsio, naval)"
            class="flex-1 bg-transparent border-none outline-none h-9 text-[13px] text-slate-50 placeholder-slate-500"
        />
        <button
            type="submit"
            class="btn-primary h-8 ml-2 flex items-center justify-center whitespace-nowrap"
        >
            Run analysis
        </button>
    </form>
{:else}
    <div class="modern-input flex items-center px-2 py-1.5 max-w-xl mx-auto">
        <div class="pl-2 pr-2 text-slate-400">
            <i class="fa-brands fa-twitter text-[18px]"></i>
        </div>
        <input
            bind:value={handle}
            on:keydown={(e) => e.key === "Enter" && handleSubmit()}
            type="text"
            placeholder="Enter X handle (e.g. elonmusk, levelsio, naval)"
            class="flex-1 bg-transparent border-none outline-none h-10 text-[14px] text-slate-50 placeholder-slate-500"
        />
        <button
            on:click={handleSubmit}
            class="btn-primary h-8 ml-2 flex items-center justify-center whitespace-nowrap"
        >
            Run free analysis
        </button>
    </div>
{/if}
