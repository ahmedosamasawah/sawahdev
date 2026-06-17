<script lang="ts">
	let mouseX = $state(-200);
	let mouseY = $state(-200);

	const shapes = Array.from({ length: 18 }, () => ({
		top: Math.random() * 100,
		left: Math.random() * 100,
		size: 3 + Math.random() * 3,
		duration: 5 + Math.random() * 4,
		delay: Math.random() * 3
	}));

	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}
</script>

<div
	class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
	aria-hidden="true"
	role="presentation"
>
	<div
		class="absolute -top-40 -left-40 h-[50rem] w-[50rem] rotate-45 opacity-30 blur-3xl"
		style="background: linear-gradient(135deg, oklch(0.88 0.12 85), transparent 70%);"
	></div>
	<div
		class="absolute -right-40 -bottom-40 h-[50rem] w-[50rem] -rotate-12 opacity-35 blur-3xl"
		style="background: linear-gradient(315deg, oklch(0.88 0.12 85), transparent 70%);"
	></div>
	<div
		class="absolute inset-0"
		style="background: radial-gradient(ellipse at center, transparent, oklch(var(--background) / 0.6));"
	></div>

	<div
		class="pointer-events-none fixed h-96 w-96 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl transition-all duration-300 ease-out"
		style="left: {mouseX}px; top: {mouseY}px; background: radial-gradient(circle, oklch(0.88 0.12 85), transparent 70%);"
	></div>

	{#each shapes as shape, i (i)}
		<div
			class="shape absolute rounded-full"
			style="top:{shape.top}%;left:{shape.left}%;width:{shape.size}px;height:{shape.size}px;animation-duration:{shape.duration}s;animation-delay:{shape.delay}s;"
		></div>
	{/each}
</div>

<svelte:window onmousemove={handleMouseMove} />

<style>
	@keyframes float-fade {
		0% {
			opacity: 0;
			transform: translateY(0);
		}
		20% {
			opacity: 0.5;
		}
		80% {
			opacity: 0.4;
		}
		100% {
			opacity: 0;
			transform: translateY(-60px);
		}
	}

	.shape {
		background: var(--accent-foreground);
		animation: float-fade linear infinite;
		opacity: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.shape {
			display: none;
		}
	}
</style>
