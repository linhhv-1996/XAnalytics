<script lang="ts">
	import type { Tweet } from '$lib/types';
	export let data: { mostViral: Tweet | null; mostDiscussion: Tweet | null; hiddenGem: Tweet | null };

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
	{#if data.mostViral}
	<div class="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-yellow-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-yellow-500/40 transition-all">
		<div class="absolute top-0 right-0 bg-yellow-500/10 text-yellow-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
			🔥 MOST VIRAL
		</div>
		<div class="text-xs text-zinc-500 mb-2">{formatDate(data.mostViral.createdAt)}</div>
		<p class="text-sm text-zinc-300 line-clamp-3 mb-4 min-h-[60px]">
			{data.mostViral.text}
		</p>
		<div class="flex items-center gap-4 text-xs font-medium text-zinc-400">
			<span>👀 {(data.mostViral.views / 1000).toFixed(1)}k</span>
			<span>❤️ {data.mostViral.likes}</span>
		</div>
	</div>
	{/if}

	{#if data.mostDiscussion}
	<div class="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-blue-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
		<div class="absolute top-0 right-0 bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
			💬 TOP DISCUSSION
		</div>
		<div class="text-xs text-zinc-500 mb-2">{formatDate(data.mostDiscussion.createdAt)}</div>
		<p class="text-sm text-zinc-300 line-clamp-3 mb-4 min-h-[60px]">
			{data.mostDiscussion.text}
		</p>
		<div class="flex items-center gap-4 text-xs font-medium text-zinc-400">
			<span>💬 {data.mostDiscussion.replies} Replies</span>
			<span>❤️ {data.mostDiscussion.likes}</span>
		</div>
	</div>
	{/if}

	{#if data.hiddenGem}
	<div class="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
		<div class="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
			💎 HIDDEN GEM
		</div>
		<div class="text-xs text-zinc-500 mb-2">{formatDate(data.hiddenGem.createdAt)}</div>
		<p class="text-sm text-zinc-300 line-clamp-3 mb-4 min-h-[60px]">
			{data.hiddenGem.text}
		</p>
		<div class="flex items-center gap-4 text-xs font-medium text-zinc-400">
			<span>⚡ High Quality</span>
			<span>🔖 {data.hiddenGem.bookmarks} Saves</span>
		</div>
	</div>
	{/if}
</div>
