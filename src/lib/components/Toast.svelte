<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	interface Props {
		message: string;
		type?: 'success' | 'error' | 'info' | 'warning';
		position?: 'top' | 'bottom';
		duration?: number;
		onClose?: () => void;
	}

	let {
		message,
		type = 'success',
		position = 'bottom',
		duration = 3000,
		onClose
	}: Props = $props();

	// Auto-close after duration
	$effect(() => {
		const timer = setTimeout(() => {
			onClose?.();
		}, duration);

		return () => clearTimeout(timer);
	});

	// Style configurations for different toast types
	const typeStyles = {
		success: 'bg-green-50 text-green-800 border-green-200',
		error: 'bg-red-50 text-red-800 border-red-200',
		info: 'bg-blue-50 text-blue-800 border-blue-200',
		warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
	};

	// Icon SVGs for different types
	const icons = {
		success: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />`,
		error: `<circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />`,
		info: `<circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />`,
		warning: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />`
	};
</script>

<div
	class="fixed left-1/2 z-50 mx-auto w-full max-w-md -translate-x-1/2 px-4 {position === 'top'
		? 'top-4'
		: 'bottom-4'}"
	in:fly={{ y: position === 'top' ? -20 : 20, duration: 300 }}
	out:fade={{ duration: 200 }}
>
	<div
		class="flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg {typeStyles[type]}"
		role="alert"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="flex-shrink-0"
		>
			{@html icons[type]}
		</svg>
		<span class="flex-1">{message}</span>
		<button
			onclick={onClose}
			class="flex-shrink-0 rounded p-1 transition-colors hover:bg-black/10"
			aria-label="Close"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>
	</div>
</div>