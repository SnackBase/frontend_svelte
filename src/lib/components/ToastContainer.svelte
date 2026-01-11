<script lang="ts">
	import { toastStore } from '$lib/stores/toast.svelte';
	import Toast from './Toast.svelte';
</script>

{#each toastStore.toasts as toast (toast.id)}
	<Toast
		message={toast.message}
		type={toast.type}
		position={toast.position}
		duration={toast.duration}
		onClose={() => toastStore.dismiss(toast.id)}
	/>
{/each}