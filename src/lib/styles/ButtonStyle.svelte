<script lang="ts">
	let { style = '', children } = $props();
</script>

<span
	class="inline-flex rounded-full border-2 bg-transparent px-4 py-2 font-bold hover:border-blue-500 hover:text-blue-500 {style}"
>
	{@render children()}
</span>
