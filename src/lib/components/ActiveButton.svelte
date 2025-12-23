<script lang="ts">
	import TextButton from "./TextButton.svelte";
	let { color = "text-green-600", children } = $props();
	let active = $state(false);

	const handler = () => {
		active = !active;
	};
</script>

<TextButton handler={handler} style={active ? color : ''}>
	{@render children()}
</TextButton>
