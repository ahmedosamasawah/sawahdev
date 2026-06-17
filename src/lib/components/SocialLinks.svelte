<script>
	import { Github, Linkedin, Twitter } from '@lucide/svelte';
</script>

<div class="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm">
	<a
		href="https://github.com/AhmedOsamaDev"
		target="_blank"
		rel="noreferrer"
		class="hover:text-foreground flex items-center gap-2"
	>
		<Github class="h-4 w-4" />
		<span>GitHub</span>
	</a>
	<a
		href="https://www.linkedin.com/in/ahmedosamadev"
		target="_blank"
		rel="noreferrer"
		class="hover:text-foreground flex items-center gap-2"
	>
		<Linkedin class="h-4 w-4" />
		<span>LinkedIn</span>
	</a>
	<a
		href="https://x.com/ahmedosamadev"
		target="_blank"
		rel="noreferrer"
		class="hover:text-foreground flex items-center gap-2"
	>
		<Twitter class="h-4 w-4" />
		<span>Twitter</span>
	</a>
</div>
