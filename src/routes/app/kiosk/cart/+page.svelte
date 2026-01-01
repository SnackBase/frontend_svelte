<script lang="ts">
	import type { PageProps } from './$types';
	import Cart from '$lib/components/Cart.svelte';

	let { data }: PageProps = $props();
	let selectedUserId = $state<string>('');
	let password = $state<string>('');
</script>

{#snippet userSelectionSnippet()}
	<!-- User Selection and Authentication -->
	<div class="mb-4 space-y-4">
		<!-- User Selection Dropdown -->
		<div>
			<label for="user-select" class="mb-2 block text-sm font-semibold">
				Select User for Checkout:
			</label>
			<select
				id="user-select"
				name="userId"
				bind:value={selectedUserId}
				required
				class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
			>
				<option value="" disabled>Choose a user...</option>
				{#each data.users as user}
					<option value={user.id}>
						{user.name} ({user.email})
					</option>
				{/each}
			</select>
		</div>

		<!-- Password Field -->
		<div>
			<label for="user-password" class="mb-2 block text-sm font-semibold">
				User Password:
			</label>
			<input
				id="user-password"
				name="userPassword"
				type="password"
				bind:value={password}
				required
				placeholder="Enter password to confirm identity"
				class="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
			/>
			<p class="mt-1 text-xs text-gray-500">
				For security, the selected user must authenticate with their password.
			</p>
		</div>
	</div>
{/snippet}

<Cart mode="kiosk" shopUrl="/app/kiosk/shop" {userSelectionSnippet} />
