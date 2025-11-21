<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
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

    <!-- Mouse cursor glow -->
    <div
        class="pointer-events-none fixed h-96 w-96 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl transition-all duration-300 ease-out"
        style="left: {mouseX}px; top: {mouseY}px; background: radial-gradient(circle, oklch(0.88 0.12 85), transparent 70%);"
    ></div>
</div>

<svelte:window onmousemove={handleMouseMove} />

<script>
let mouseX = $state(-200)
let mouseY = $state(-200)

function handleMouseMove(e) {
    mouseX = e.clientX
    mouseY = e.clientY
}
</script>
