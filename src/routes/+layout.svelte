<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import person from '$lib/assets/person.svg';
	import TextButton from '$lib/components/TextButton.svelte';
	import NavBarPageLink from '$lib/components/NavBarPageLink.svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';

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
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
			<a href="/" class="flex items-center gap-4">
				<img src="/favicon.ico" width="40" alt="Logo" class="dark:invert" />
				<h1 class="text-xl font-semibold">DrinkBar</h1>
			</a>

			{#if data.session?.user?.email}
				<nav class="flex gap-4">
					<NavBarPageLink name="app - first" route="app/first" />
					<NavBarPageLink name="Shop" route="app/customer/shop" />
				</nav>
			{/if}

			<!-- <TextButton handler={signIn}>Log In</TextButton> -->
			<div class="flex space-x-2">
				{#if data.session?.user?.email}
					<TextButton handler={() => signOut()}
						><div class="flex gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
								/>
							</svg>
							<div>Log Out</div>
						</div></TextButton
					>
					<img
						src={data.session?.user?.image ?? person}
						alt="User Avatar"
						class="inline-block size-10 rounded-full ring-2 outline -outline-offset-1 outline-white/10"
					/>
				{:else}
					<TextButton handler={() => signIn()}
						><div class="flex gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z"
								/>
							</svg>
							<div>Log In</div>
						</div></TextButton
					>
				{/if}
			</div>
		</div>

		{@render colorGradientHorizontalLine()}
	</header>

	<!-- MAIN CONTENT (GROWS) -->
	<main class="w-full flex-1 py-4">
		<div class="mx-auto max-w-4xl rounded-2xl px-4 py-6">
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
