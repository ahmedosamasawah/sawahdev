{#if headings.length}
    <aside class="text-muted-foreground sticky top-24 hidden w-52 space-y-2 text-xs md:block">
        <div class="flex items-center justify-between">
            <button
                type="button"
                class="border-border hover:bg-muted rounded border p-1"
                onclick={() => scroll_relative(-1)}
                aria-label={translate(locale, 'blog.prevSection')}
            >
                <ChevronUp class="h-3 w-3" />
            </button>
            <span>{translate(locale, 'blog.toc')}</span>
            <button
                type="button"
                class="border-border hover:bg-muted rounded border p-1"
                onclick={() => scroll_relative(1)}
                aria-label={translate(locale, 'blog.nextSection')}
            >
                <ChevronDown class="h-3 w-3" />
            </button>
        </div>

        <ul class="border-border space-y-1 border-l pl-2">
            {#each headings as heading (heading.id)}
                <li>
                    <button
                        type="button"
                        class="hover:text-foreground w-full text-left transition {active_id ===
                        heading.id
                            ? 'text-foreground'
                            : ''}"
                        onclick={() => scroll_to(heading.id)}
                    >
                        {heading.text}
                    </button>
                </li>
            {/each}
        </ul>
    </aside>
{/if}

<script lang="ts">
import {ChevronDown, ChevronUp} from '@lucide/svelte'
import {onMount} from 'svelte'

import {translate} from '$lib/i18n/runtime'

const {headings, locale} = $props()

let active_id = $state(headings[0]?.id ?? '')

function scroll_to(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({behavior: 'smooth', block: 'start'})
    active_id = id
}

function scroll_relative(offset: number) {
    const idx = headings.findIndex(h => h.id === active_id)
    const next = Math.max(0, Math.min(idx + offset, headings.length - 1))
    if (headings[next]) scroll_to(headings[next].id)
}

onMount(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
        entries => {
            for (const e of entries) if (e.isIntersecting) active_id = e.target.id
        },
        {rootMargin: '0px 0px -60% 0px', threshold: 0.1},
    )

    headings.forEach(h => {
        const el = document.getElementById(h.id)
        if (el) observer.observe(el)
    })

    return () => observer.disconnect()
})
</script>
