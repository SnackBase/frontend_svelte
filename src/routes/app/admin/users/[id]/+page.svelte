<script lang="ts">
	import { User } from '$lib/types/userData.svelte';
	import LockPerson from '$lib/icons/lock-person.svelte';
	import ButtonStyle from '$lib/styles/ButtonStyle.svelte';
	import { INPUT_NUMBER_CLASS } from '$lib/constants/product';
	import { enhance } from '$app/forms';
	import { createFormEnhanceHandler } from '$lib/utils/formEnhanceHandler';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const user = $derived(new User(data.user));
</script>

<div class="flex min-w-xs flex-col gap-4">
	<!-- User Details Card -->
	<div class="flex flex-col gap-4 rounded-2xl border p-4">
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
			{#if user.emailVerified}
				<span>Email verified</span>
			{:else}
				<span>Email not verified</span>
			{/if}
		</div>
	</div>

	<!-- Edit User Card -->
	<form
		method="POST"
		action="?/update"
		class="flex flex-col gap-4 rounded-2xl border p-4"
		use:enhance={createFormEnhanceHandler({
			failureMessage: 'Failed to update user',
			errorMessage: 'An unexpected error occurred while updating the user',
			successMessage: 'User updated successfully'
		})}
	>
		<div class="font-semibold">Edit User</div>

		<div class="flex flex-col gap-1">
			<label for="allowed_overdraw" class="block">Allowed Overdraw</label>
			<input
				id="allowed_overdraw"
				name="allowed_overdraw"
				type="number"
				step="0.01"
				min="0"
				value={user.allowed_overdraw ?? 0}
				required
				class="{INPUT_NUMBER_CLASS} w-full"
			/>
		</div>

		<div class="flex flex-row items-center gap-2">
			<input
				id="age_restrict"
				name="age_restrict"
				type="checkbox"
				checked={user.age_restrict}
				class="h-4 w-4 rounded-full border border-black focus:ring-2 dark:border-white"
			/>
			<label for="age_restrict" class="block">Age Restricted</label>
		</div>

		<button type="submit">
			<ButtonStyle>Save Changes</ButtonStyle>
		</button>
	</form>
</div>
