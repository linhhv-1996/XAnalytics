<script lang="ts">
	export let data: { viewToLike: number; viewToReply: number };
</script>

<div class="bg-zinc-900 rounded-xl p-6 border border-zinc-800 h-full">
	<h3 class="text-lg font-bold text-white mb-6">Audience Funnel</h3>
	
	<div class="space-y-6">
		<div class="relative group">
			<div class="flex justify-between text-sm mb-1 text-zinc-400">
				<span>Impressions</span>
				<span class="text-white">100%</span>
			</div>
			<div class="h-3 bg-zinc-700 rounded-full w-full overflow-hidden">
				<div class="h-full bg-blue-500 w-full"></div>
			</div>
		</div>

		<div class="relative group">
			<div class="flex justify-between text-sm mb-1 text-zinc-400">
				<span>Like Conversion</span>
				<span class="text-pink-400 font-bold">{data.viewToLike}%</span>
			</div>
			<div class="h-3 bg-zinc-700 rounded-full w-full overflow-hidden">
				<div class="h-full bg-pink-500" style="width: {Math.min(data.viewToLike * 5, 100)}%"></div>
			</div>
			<p class="text-xs text-zinc-500 mt-1">Độ hấp dẫn của nội dung (Benchmark: 1.5 - 2%)</p>
		</div>

		<div class="relative group">
			<div class="flex justify-between text-sm mb-1 text-zinc-400">
				<span>Reply Conversion</span>
				<span class="text-purple-400 font-bold">{data.viewToReply}%</span>
			</div>
			<div class="h-3 bg-zinc-700 rounded-full w-full overflow-hidden">
				<div class="h-full bg-purple-500" style="width: {Math.min(data.viewToReply * 10, 100)}%"></div>
			</div>
			<p class="text-xs text-zinc-500 mt-1">Mức độ thảo luận cộng đồng</p>
		</div>
	</div>
</div>
