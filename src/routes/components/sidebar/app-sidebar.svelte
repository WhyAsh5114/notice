<script lang="ts">
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { BellIcon, GithubIcon, HandCoinsIcon, SettingsIcon } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
	const sidebar = useSidebar();

	const data = {
		navMain: [
			{
				title: 'Application',
				items: [
					{
						title: 'All notifications',
						url: '/',
						icon: BellIcon
					},
					{
						title: 'Settings',
						url: '/settings',
						icon: SettingsIcon
					}
				]
			},
			{
				title: 'Developer',
				items: [
					{
						title: 'Github',
						url: 'https://github.com/WhyAsh5114/notice',
						icon: GithubIcon
					},
					{
						title: 'Donate',
						url: '/donate',
						icon: HandCoinsIcon
					}
				]
			}
		]
	};
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					class="h-fit w-full justify-start bg-muted text-start"
					onclick={() => sidebar.setOpenMobile(false)}
				>
					<a class="flex w-full items-center gap-2 px-2 py-0 text-xl font-semibold" href="/">
						<img src="/favicon.png" alt="logo" class="h-12 w-12 invert dark:invert-0" />
						Notice
					</a>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each data.navMain as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as link (link.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									onclick={() => sidebar.setOpenMobile(false)}
									isActive={page.url.pathname === link.url}
								>
									{#snippet child({ props })}
										<a href={link.url} {...props}>
											<link.icon />
											<span>{link.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
