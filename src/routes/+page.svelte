<script lang="ts">
	import ActiveButton from '$lib/components/ActiveButton.svelte';
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';
</script>

<div class="w-full justify-start space-y-4 space-x-1 px-1 py-1">
	<p>
		<ActiveButton>Click Me!</ActiveButton>
		<ActiveButton color="text-red-600">Click Me!</ActiveButton>
		<a href="/first"><ButtonStyle>first</ButtonStyle></a>
	</p>
</div>
