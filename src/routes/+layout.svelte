<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import TextButton from '$lib/components/TextButton.svelte';
	import NavBarPageLink from '$lib/components/NavBarPageLink.svelte';
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';
	import { SignIn, SignOut } from '@auth/sveltekit/components';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- PAGE ROOT -->
<div class="flex min-h-screen flex-col font-sans">
	<!-- HEADER -->
	<header class="w-full">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
			<a href="/" class="flex items-center gap-4">
				<img src={favicon} width="40" alt="Logo" />
				<h1 class="text-xl font-semibold">DrinkBar</h1>
			</a>

			<nav class="flex gap-4">
				<NavBarPageLink name="first" />
				<NavBarPageLink name="second" />
			</nav>

			<!-- <TextButton handler={signIn}>Log In</TextButton> -->
			<div class="flex space-x-2">
				<ButtonStyle><SignIn signInPage="signin">Log In</SignIn></ButtonStyle>
				<ButtonStyle><SignOut>Log Out</SignOut></ButtonStyle>
				<img
					src={data.session?.user?.image ?? 'https://i.pravatar.cc/300'}
					alt="User Avatar"
					class="inline-block size-10 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10"
				/>
			</div>
		</div>

		<div class="h-1 bg-linear-to-r from-sky-500 via-purple-500 to-pink-500"></div>
	</header>

	<!-- MAIN CONTENT (GROWS) -->
	<main class="w-full flex-1 py-4">
		<div class="mx-auto max-w-4xl rounded-2xl px-4 py-6">
			{@render children()}
		</div>
	</main>

	<!-- FOOTER -->
	<footer class="mt-auto">
		<div class="h-1 bg-linear-to-r from-sky-500 via-purple-500 to-pink-500"></div>
		<p class="p-4">This is the Footer. Here might be a link to the impressum.</p>
		<!-- TODO: add impressum and other necessary information -->
	</footer>
</div>
