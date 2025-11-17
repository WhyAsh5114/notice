<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Coffee, Heart, Smartphone, Star } from '@lucide/svelte';
</script>

<article class="mx-auto prose max-w-2xl px-4 dark:prose-invert">
	<h1>Donate</h1>

	<p>
		I wanted to build something like this, because I often found myself needing a simple way to
		manage and view notifications on my Android. Existing solutions were either filled with ads or
		just didn't work properly.
	</p>

	<p>
		I've kept this open source (here's the <a href="https://github.com/whyash5114/notice">
			GitHub repository
		</a>), since notifications contain personal data and I wanted to be transparent about how the
		app works. There's no analytics or tracking of any kind; your privacy is respected. The app
		doesn't even connect to the internet at all!
	</p>

	<p><i>At least for now, until I add optional cloud syncing/backup features.</i></p>

	<p>
		If you find this project useful and would like to support its development, you can buy me a
		coffee or sponsor me on GitHub. You can even star this repository or rate it on Play Store! Your
		support helps keep this project maintained and improved.
	</p>

	<h2>Ways to Support</h2>

	<h3>Buy Me a Coffee</h3>
	<p>A one-time donation to show your appreciation and help fuel development.</p>
	<p>
		<Button
			href="https://buymeacoffee.com/whyash5114"
			target="_blank"
			rel="noopener noreferrer"
			size="lg"
		>
			<Coffee />
			Buy Me a Coffee
		</Button>
	</p>

	<h3>GitHub Sponsors</h3>
	<p>Become a recurring sponsor and help ensure continued development and maintenance.</p>
	<p>
		<Button
			href="https://github.com/sponsors/whyash5114"
			target="_blank"
			rel="noopener noreferrer"
			size="lg"
		>
			<Heart />
			Sponsor on GitHub
		</Button>
	</p>

	<h3>Star on GitHub</h3>
	<p>Show your support by starring the repository. It helps others discover the project!</p>
	<p>
		<Button
			href="https://github.com/whyash5114/notice"
			target="_blank"
			rel="noopener noreferrer"
			size="lg"
		>
			<Star />
			Star on GitHub
		</Button>
	</p>

	<h3>Rate on Play Store</h3>
	<p>If you enjoy using the app, please leave a rating on the Google Play Store.</p>
	<p>
		<Button
			href="https://play.google.com/store/apps/details?id=com.whyash5114.notice"
			target="_blank"
			rel="noopener noreferrer"
			size="lg"
		>
			<Smartphone />
			Rate on Play Store
		</Button>
	</p>

	<h2>Thank You!</h2>
	<p>
		Every contribution, no matter the size, is greatly appreciated and motivates me to continue
		improving this project. Thank you for your support!
	</p>
</article>
