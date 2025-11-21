{#if headings.length}
    <!-- Desktop: Sidebar navigation (Brittany Chiang style) -->
    <nav class="hidden lg:block" aria-label="Table of contents navigation">
        <ul class="space-y-0">
            {#each headings as heading (heading.id)}
                <li>
                    <button
                        type="button"
                        class="group flex items-center py-3 transition-all duration-200"
                        class:active={heading.id === active_id}
                        aria-label={heading.text}
                        aria-current={heading.id === active_id ? 'true' : undefined}
                        onclick={() => scroll_to(heading.id)}
                    >
                        <!-- Horizontal line indicator (like Brittany's nav) -->
                        <span
                            class="mr-4 h-px rounded-full transition-all duration-300 motion-reduce:transition-none"
                            class:w-16={heading.id === active_id}
                            class:bg-foreground={heading.id === active_id}
                            class:w-8={heading.id !== active_id}
                            class:bg-muted-foreground={heading.id !== active_id}
                            class:group-hover:w-16={heading.id !== active_id}
                            class:group-hover:bg-foreground={heading.id !== active_id}
                            class:group-focus-visible:w-16={heading.id !== active_id}
                            class:group-focus-visible:bg-foreground={heading.id !== active_id}
                        ></span>

                        <!-- Text label -->
                        <span
                            class="text-xs font-bold tracking-widest uppercase transition-colors duration-200"
                            class:text-foreground={heading.id === active_id}
                            class:text-muted-foreground={heading.id !== active_id}
                            class:group-hover:text-foreground={heading.id !== active_id}
                            class:group-focus-visible:text-foreground={heading.id !== active_id}
                        >
                            {heading.text}
                        </span>
                    </button>
                </li>
            {/each}
        </ul>
    </nav>

    <!-- Mobile: Collapsible TOC -->
    <div class="lg:hidden">
        <button
            type="button"
            class="bg-background border-border hover:bg-muted mb-4 flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
            aria-label="Toggle table of contents"
            onclick={() => (is_mobile_open = !is_mobile_open)}
        >
            <span>{translate(locale, 'blog.toc')}</span>
            <svg
                class="h-4 w-4 transition-transform duration-200"
                class:rotate-180={is_mobile_open}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                ></path>
            </svg>
        </button>

        {#if is_mobile_open}
            <ul class="mb-8 space-y-0">
                {#each headings as heading (heading.id)}
                    <li>
                        <button
                            type="button"
                            class="group flex w-full items-center py-2 text-left transition-all duration-200"
                            onclick={() => {
                                scroll_to(heading.id)
                                is_mobile_open = false
                            }}
                        >
                            <!-- Line indicator -->
                            <span
                                class="mr-3 h-px rounded-full transition-all duration-200"
                                class:w-12={heading.id === active_id}
                                class:bg-foreground={heading.id === active_id}
                                class:w-6={heading.id !== active_id}
                                class:bg-muted-foreground={heading.id !== active_id}
                            ></span>

                            <!-- Text -->
                            <span
                                class="text-xs transition-colors"
                                class:text-foreground={heading.id === active_id}
                                class:font-medium={heading.id === active_id}
                                class:text-muted-foreground={heading.id !== active_id}
                            >
                                {heading.text}
                            </span>
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
{/if}

<script lang="ts">
import {onMount} from 'svelte'

import {translate, type Locale} from '$lib/i18n/runtime'
import type {Heading} from '$lib/types/manifest'

const {headings, locale} = $props<{headings: Heading[]; locale: Locale}>()

let active_id = $state(headings[0]?.id ?? '')
let is_mobile_open = $state(false)

function get_element(id: string) {
    return document.getElementById(id)
}

function scroll_to(id: string) {
    const el = get_element(id)
    if (!el) return
    el.scrollIntoView({behavior: 'smooth', block: 'start'})
    active_id = id
}

onMount(() => {
    const observer = new IntersectionObserver(
        entries => {
            const intersecting = entries.find(e => e.isIntersecting)
            if (intersecting) active_id = intersecting.target.id
        },
        {rootMargin: '0px 0px -60% 0px', threshold: 0.1},
    )

    headings.forEach((h: Heading) => {
        const el = get_element(h.id)
        if (el) observer.observe(el)
    })

    return () => {
        observer.disconnect()
    }
})
</script>
