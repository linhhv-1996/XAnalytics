<script lang="ts">
	export let data: { threadRatio: number; visualRatio: number; promoRatio: number };
</script>

<div class="bg-zinc-900 rounded-xl p-6 border border-zinc-800 h-full">
	<h3 class="text-lg font-bold text-white mb-6">Content Strategy Mix</h3>
	
	<div class="grid grid-cols-3 gap-4 text-center">
		<div class="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
			<div class="text-2xl mb-2">📸</div>
			<div class="text-2xl font-bold text-white">{data.visualRatio}%</div>
			<div class="text-xs text-zinc-500 uppercase tracking-wider mt-1">Visuals</div>
		</div>

		<div class="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
			<div class="text-2xl mb-2">🧵</div>
			<div class="text-2xl font-bold text-white">{data.threadRatio}%</div>
			<div class="text-xs text-zinc-500 uppercase tracking-wider mt-1">Threads</div>
		</div>

		<div class="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
			<div class="text-2xl mb-2">🔗</div>
			<div class="text-2xl font-bold text-white">{data.promoRatio}%</div>
			<div class="text-xs text-zinc-500 uppercase tracking-wider mt-1">Promos</div>
		</div>
	</div>

	<div class="mt-6 p-4 bg-zinc-950 rounded border border-zinc-800/50">
		<div class="text-sm text-zinc-400">
			<span class="text-yellow-500 font-bold">Insight:</span>
			{#if data.promoRatio > 30}
				Tài khoản này bán hàng khá aggressive (Promo > 30%).
			{:else if data.threadRatio > 50}
				Tài khoản tập trung xây dựng Authority bằng kiến thức sâu (High Thread).
			{:else}
				Tài khoản cân bằng, tập trung vào tương tác ngắn hạn.
			{/if}
		</div>
	</div>
</div>
