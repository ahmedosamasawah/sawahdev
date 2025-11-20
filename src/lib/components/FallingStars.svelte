<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    {#each stars as star, i (i)}
        <div
            class="star absolute rounded-full"
            style="top:{star.top}%;left:{star.left}%;width:{star.size}px;height:{star.size}px;animation-duration:{star.duration}s;animation-delay:{star.delay}s;"
        ></div>
    {/each}
</div>

<script>
const stars = Array.from({length: 18}, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 3 + Math.random() * 3,
    duration: 5 + Math.random() * 4,
    delay: Math.random() * 3,
}))
</script>

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

.star {
    background: var(--accent-foreground);
    animation: float-fade linear infinite;
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .star {
        display: none;
    }
}
</style>
