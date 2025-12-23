<script lang="ts">
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';
	let { style = '', handler = undefined, children } = $props();
</script>

<button onclick={handler}>
	<ButtonStyle {style}>
		{@render children()}
	</ButtonStyle>
</button>
