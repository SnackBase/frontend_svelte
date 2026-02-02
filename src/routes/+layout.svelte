<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavBarPageLink from '$lib/components/NavBarPageLink.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { cartStore } from '$lib/stores/cartStore.svelte';
	import { configStore } from '$lib/stores/configStore.svelte';
	import { formatCurrency } from '$lib/constants/product';

	let { children, data } = $props();

	let mobileMenuOpen = $state(false);

	// Set currency config from server data
	$effect(() => {
		if (data.currencyConfig) {
			configStore.setCurrency(data.currencyConfig);
		}
	});

	const formattedBalance = $derived(
		data.balance !== null && data.balance !== undefined
			? formatCurrency(data.balance, configStore.currency)
			: null
	);

	const alwaysBurger = $derived((data.navbarLinks?.length ?? 0) > 3);

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
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
		<div
			class="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-4 sm:gap-4"
		>
			<!-- Left Section: Logo -->
			<a
				href="/"
				class="flex shrink-0 items-center justify-start gap-2 hover:text-blue-500 sm:gap-4"
			>
				<!-- <img src="/favicon.ico" width="40" alt="Logo" class="hover:fill-blue-500 dark:invert" /> -->
				<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M7 21q-1.25 0-2.125-.875T4 18H3q-.825 0-1.412-.587T1 16v-3q0-.825.588-1.412T3 11h9V7q0-.825.588-1.412T14 5h2V4q0-.425.288-.712T17 3h1q.425 0 .713.288T19 4v1h.55q.65 0 1.175.375t.725 1l1.45 4.3q.05.15.075.313t.025.337V16q0 .825-.587 1.413T21 18h-1q0 1.25-.875 2.125T17 21t-2.125-.875T14 18h-4q0 1.25-.875 2.125T7 21m0-2q.425 0 .713-.288T8 18t-.288-.712T7 17t-.712.288T6 18t.288.713T7 19m10 0q.425 0 .713-.288T18 18t-.288-.712T17 17t-.712.288T16 18t.288.713T17 19m-3-8h6.9l-1.35-4H14zM2 8.5v-2h-.25q-.325 0-.537-.213T1 5.75t.213-.537T1.75 5h8.5q.325 0 .538.213T11 5.75t-.213.538t-.537.212H10v2h.25q.325 0 .538.213T11 9.25t-.213.538t-.537.212h-8.5q-.325 0-.537-.213T1 9.25t.213-.537t.537-.213zm1.5 0h1.75v-2H3.5zm3.25 0H8.5v-2H6.75z"
					/>
				</svg>
				<h1 class="hidden text-xl font-semibold sm:block">DrinkBar</h1>
			</a>

			<!-- Center Section: Navigation Links (hidden on mobile, visible md+ unless >3 links) -->
			{#if data.navbarLinks && data.navbarLinks.length > 0 && !alwaysBurger}
				<nav class="hidden justify-center gap-2 sm:gap-3 md:flex lg:gap-4">
					{#each data.navbarLinks as link}
						<NavBarPageLink name={link.name} route={link.route} />
					{/each}
				</nav>
				<div class="md:hidden"></div>
			{:else}
				<div></div>
			{/if}

			<!-- Right Section: Balance, Cart, Auth and Burger -->
			<div class="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
				{#if formattedBalance !== null}
					<!-- Account Balance -->
					<a
						href="/app/customer/payments"
						class="text-sm font-semibold {data.balance! >= 0 ? 'text-green-500' : 'text-red-500'}"
						title="Account Balance"
					>
						{formattedBalance}
					</a>
				{/if}

				{#if data.showShoppingCart}
					<!-- Shopping Cart Icon with Badge -->
					<a
						href={data.cartUrl}
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
				{/if}

				<!-- Auth buttons (hidden on mobile; also hidden on desktop when >3 links) -->
				{#if !alwaysBurger}
					{#if data.session?.user?.email}
						<button
							onclick={() => signOut({ callbackUrl: '/', redirect: true })}
							class="hidden shrink-0 items-center justify-center rounded-full p-2 transition-colors hover:text-blue-500 md:flex md:gap-2 md:px-4"
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
						</button>
					{:else}
						<button
							onclick={() => signIn('keycloak')}
							class="hidden shrink-0 items-center justify-center rounded-full p-2 transition-colors hover:text-blue-500 md:flex md:gap-2 md:px-4"
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
						</button>
					{/if}
				{/if}

				<!-- Burger button: always on mobile, always on desktop when >3 links -->
				{#if data.navbarLinks && data.navbarLinks.length > 0}
					<button
						onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
						class="rounded-md p-2 transition-colors hover:text-blue-500 {alwaysBurger
							? ''
							: 'md:hidden'}"
						aria-label="Toggle navigation menu"
						aria-expanded={mobileMenuOpen}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							{#if mobileMenuOpen}
								<path
									fill="currentColor"
									d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
								/>
							{:else}
								<path fill="currentColor" d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z" />
							{/if}
						</svg>
					</button>
				{/if}
			</div>
		</div>

		{@render colorGradientHorizontalLine()}
	</header>

	<!-- Burger Navigation Menu (above all page content) -->
	{#if mobileMenuOpen && data.navbarLinks && data.navbarLinks.length > 0}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-50 {alwaysBurger ? '' : 'md:hidden'}"
			onclick={closeMobileMenu}
			onkeydown={(e) => e.key === 'Escape' && closeMobileMenu()}
		>
			<!-- Backdrop -->
			<div class="absolute inset-0 bg-black/30"></div>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- Menu panel: right-aligned, ~3/4 width, full height -->
			<div
				class="absolute top-0 right-0 bottom-0 flex w-xs flex-col border-l bg-white shadow-lg dark:border-gray-700 dark:bg-gray-950"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.key === 'Escape' && closeMobileMenu()}
			>
				<!-- Nav links -->
				<nav class="flex flex-col gap-1 p-4">
					{#each data.navbarLinks as link}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<span onclick={closeMobileMenu}>
							<NavBarPageLink name={link.name} route={link.route} />
						</span>
					{/each}
				</nav>

				<!-- Logout/Login at bottom (matches footer height) -->
				<div class="mt-auto">
					<div class="p-4">
						{#if data.session?.user?.email}
							<button
								onclick={() => {
									closeMobileMenu();
									signOut({ callbackUrl: '/', redirect: true });
								}}
								class="flex w-full items-center gap-3 font-semibold transition-colors hover:text-blue-500"
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
								Log Out
							</button>
						{:else}
							<button
								onclick={() => {
									closeMobileMenu();
									signIn('keycloak');
								}}
								class="flex w-full items-center gap-3 font-semibold transition-colors hover:text-blue-500"
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
								Log In
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- MAIN CONTENT (GROWS) -->
	<main class="flex w-full flex-1 flex-col py-4">
		<div class="mx-auto flex h-full max-w-4xl flex-col rounded-2xl px-4 py-6">
			{@render children()}
		</div>
	</main>

	<!-- FOOTER -->
	<footer class="mt-auto">
		{@render colorGradientHorizontalLine()}
		<p class="p-4">This is the Footer. Here might be a link to the imprint.</p>
		<!-- TODO: add imprint and other necessary information -->
	</footer>
</div>

<!-- Toast Container -->
<ToastContainer />
