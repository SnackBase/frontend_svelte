<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import person from '$lib/assets/person.svg';
	import NavBarPageLink from '$lib/components/NavBarPageLink.svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { cartStore } from '$lib/stores/cartStore.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#snippet colorGradientHorizontalLine()}
	<div class="h-1 bg-linear-to-r from-sky-500 via-purple-500 to-pink-500"></div>
{/snippet}

<!-- PAGE ROOT -->
<div class="flex min-h-screen flex-col font-sans dark:bg-gray-950 dark:text-white">
	<!-- HEADER -->
	<header class="w-full">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4">
			<a href="/" class="flex shrink-0 items-center gap-2 sm:gap-4">
				<img src="/favicon.ico" width="40" alt="Logo" class="dark:invert" />
				<h1 class="hidden text-xl font-semibold sm:block">DrinkBar</h1>
			</a>

			{#if data.navbarLinks && data.navbarLinks.length > 0}
				<nav class="flex gap-2 sm:gap-3 lg:gap-4">
					{#each data.navbarLinks as link}
						<NavBarPageLink name={link.name} route={link.route} />
					{/each}
				</nav>
			{/if}

			<div class="flex shrink-0 items-center gap-1 sm:gap-2">
				{#if data.session?.user?.email}
					<!-- Shopping Cart Icon with Badge -->
					<a
						href="/app/customer/cart"
						class="relative p-2 transition-colors hover:text-blue-500"
						aria-label="Shopping Cart"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M7 22q-.825 0-1.412-.587T5 20t.588-1.412T7 18t1.413.588T9 20t-.587 1.413T7 22m10 0q-.825 0-1.412-.587T15 20t.588-1.412T17 18t1.413.588T19 20t-.587 1.413T17 22M6.15 6l2.4 5h7l2.75-5zM5.2 4h14.75q.575 0 .875.513t.025 1.037l-3.55 6.4q-.275.5-.737.775T15.55 13H8.1L7 15h12v2H7q-1.125 0-1.7-.987t-.05-1.963L6.6 11.6L3 4H1V2h3.25z"
							/>
						</svg>
						{#if cartStore.totalItems > 0}
							<span
								class="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-xs font-bold text-white"
							>
								{cartStore.totalItems}
							</span>
						{/if}
					</a>

					<button
						onclick={() => signOut()}
						class="w-max-1 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-white p-2 transition-colors hover:bg-gray-100 sm:size-full sm:w-auto sm:gap-2 sm:px-4 dark:hover:bg-gray-800"
						aria-label="Log Out"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="shrink-0"
						>
							<path
								fill="currentColor"
								d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
							/>
						</svg>
						<div class="hidden sm:block">Log Out</div>
					</button>
					<img
						src={data.session?.user?.image ?? person}
						alt="User Avatar"
						class="hidden size-10 shrink-0 rounded-full ring-2 outline -outline-offset-1 outline-white/10 sm:inline-block"
					/>
				{:else}
					<button
						onclick={() => signIn()}
						class="flex size-10 shrink-0 items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100 sm:w-auto sm:gap-2 sm:rounded-lg sm:px-4 dark:hover:bg-gray-800"
						aria-label="Log In"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="shrink-0"
						>
							<path
								fill="currentColor"
								d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z"
							/>
						</svg>
						<div class="hidden sm:block">Log In</div>
					</button>
				{/if}
			</div>
		</div>

		{@render colorGradientHorizontalLine()}
	</header>

	<!-- MAIN CONTENT (GROWS) -->
	<main class="flex w-full flex-1 flex-col py-4">
		<div class="mx-auto flex h-full max-w-4xl flex-col rounded-2xl px-4 py-6">
			{@render children()}
		</div>
	</main>

	<!-- FOOTER -->
	<footer class="mt-auto">
		{@render colorGradientHorizontalLine()}
		<p class="p-4">This is the Footer. Here might be a link to the impressum.</p>
		<!-- TODO: add impressum and other necessary information -->
	</footer>
</div>
