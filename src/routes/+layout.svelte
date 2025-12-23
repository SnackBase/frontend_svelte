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
				<NavBarPageLink name="app - first" route="app/first" />
				<NavBarPageLink name="app - first - lower" route="app/first/lower" />
			</nav>

			<!-- <TextButton handler={signIn}>Log In</TextButton> -->
			<div class="flex space-x-2">
				<!-- <TextButton handler={() => signIn()}>Log In</TextButton>
				<TextButton handler={() => signOut()}>Log Out</TextButton> -->
				<ButtonStyle><SignIn /></ButtonStyle>
				<ButtonStyle><SignOut /></ButtonStyle>
				<img
					src={data.session?.user?.image ?? person}
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
