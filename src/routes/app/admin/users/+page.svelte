<script lang="ts">
	import { User, type UserData } from '$lib/types/userData.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import LockPerson from '$lib/icons/lock-person.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let searchQuery = $state('');

	const allUsers = $derived(data.users.map((u: UserData) => new User(u)));

	const filteredUsers = $derived(
		allUsers.filter((user) => {
			if (!searchQuery) return true;
			return User.matchesSearch(user, searchQuery);
		})
	);
</script>

<div class="flex w-xs flex-col gap-4">
	<h1 class="text-2xl font-bold">Users</h1>

	<SearchInput bind:value={searchQuery} placeholder="Search by username, name, or email..." />

	{#each filteredUsers as user}
		<a
			href="/app/admin/users/{user.id}"
			class="flex flex-col gap-2 rounded-2xl border p-4 transition-colors hover:border-blue-500"
		>
			<div class="flex flex-row justify-between">
				<div class="flex flex-col gap-1">
					<div class="font-semibold">{user.getFullName()}</div>
					<div class="text-sm text-gray-500">@{user.username}</div>
					{#if user.email}
						<div class="text-sm text-gray-500">{user.email}</div>
					{/if}
				</div>
				<div class="flex flex-col items-end gap-1">
					<div class="text-sm text-gray-500">Overdraw</div>
					<div class="text-xl font-bold">{user.allowed_overdraw ?? 0}</div>
				</div>
			</div>

			<div class="flex flex-row justify-between text-sm text-gray-500">
				{#if user.age_restrict}
					<div class="flex items-center gap-1">
						<LockPerson />
						<span>Age restricted</span>
					</div>
				{:else}
					<span>No age restriction</span>
				{/if}
			</div>
		</a>
	{/each}

	{#if filteredUsers.length === 0}
		<p class="text-center text-gray-500">
			{searchQuery ? 'No users found matching your search' : 'No users yet'}
		</p>
	{/if}
</div>
