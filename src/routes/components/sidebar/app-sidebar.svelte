<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import type { IconProps } from '@lucide/svelte';
	import {
		BellIcon,
		CodeXmlIcon,
		GithubIcon,
		GlobeIcon,
		GlobeLockIcon,
		HandCoinsIcon,
		PlayIcon,
		SettingsIcon
	} from '@lucide/svelte';
	import type { Component, ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
	const sidebar = useSidebar();

	type InternalNavLink = {
		title: string;
		url: '/' | '/settings' | '/donate';
		icon: Component<IconProps>;
		external?: false;
	};

	type ExternalNavLink = {
		title: string;
		url: string;
		icon: Component<IconProps>;
		external: true;
	};

	type NavLink = InternalNavLink | ExternalNavLink;

	type NavGroup = {
		title: string;
		items: NavLink[];
	};

	const data: { navMain: NavGroup[] } = {
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
					},
					{
						title: 'Donate',
						url: '/donate',
						icon: HandCoinsIcon
					}
				]
			},
			{
				title: 'External',
				items: [
					{
						title: 'Github',
						url: 'https://github.com/WhyAsh5114/notice',
						icon: GithubIcon,
						external: true
					},
					{
						title: 'Website',
						url: 'https://notice.whyash5114.com',
						icon: GlobeIcon,
						external: true
					},
					{
						title: 'Privacy policy',
						url: 'https://notice.whyash5114.com/privacy-policy',
						icon: GlobeLockIcon,
						external: true
					},
					{
						title: 'Play store',
						url: 'https://play.google.com/store/apps/details?id=com.whyash5114.notice',
						icon: PlayIcon,
						external: true
					},
					{
						title: 'Developer site',
						url: 'https://whyash5114.com',
						icon: CodeXmlIcon,
						external: true
					}
				]
			}
		]
	};

	function isExternal(link: NavLink): link is ExternalNavLink {
		return link.external === true;
	}
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					class="h-fit w-full justify-start bg-muted text-start"
					onclick={() => sidebar.setOpenMobile(false)}
				>
					<a
						class="flex w-full items-center gap-2 px-2 py-0 text-xl font-semibold"
						href={resolve('/')}
					>
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
										{#if isExternal(link)}
											<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
											<a href={link.url} target="_blank" {...props}>
												<link.icon />
												<span>{link.title}</span>
											</a>
										{:else}
											<a href={resolve(link.url)} {...props}>
												<link.icon />
												<span>{link.title}</span>
											</a>
										{/if}
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
