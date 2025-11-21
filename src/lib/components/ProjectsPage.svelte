<div class="w-full max-w-4xl space-y-12">
    <section class="space-y-4">
        <h1 class="text-2xl font-semibold">
            {translate(locale, 'projects.title')}
        </h1>
        <p class="text-muted-foreground leading-relaxed">
            {translate(locale, 'projects.subtitle')}
        </p>
        <a
            href="/{locale}"
            class="hover:text-foreground text-muted-foreground block text-sm underline decoration-dotted underline-offset-4"
        >
            {translate(locale, 'common.backArrow')}
            {translate(locale, 'common.nav.home')}
        </a>
    </section>

    <section class="grid gap-6 md:grid-cols-2">
        {#each projects as project (project.id)}
            <article
                class="group border-border bg-card hover:border-primary/50 relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
                <div class="mb-3 flex items-start justify-between gap-3">
                    <h2 class="text-xl leading-tight font-semibold">
                        {project.titles[loc]}
                    </h2>
                    {#if project.year}
                        <span class="text-muted-foreground text-xs font-medium">{project.year}</span
                        >
                    {/if}
                </div>

                <!-- Role -->
                <p class="text-muted-foreground mb-3 text-sm">
                    {project.role[loc]}
                </p>

                <!-- Description -->
                <p class="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {project.descriptions[loc]}
                </p>

                <!-- Tech Stack -->
                <div class="mb-4 flex flex-wrap gap-2">
                    {#each project.tech as tech}
                        <span
                            class="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
                        >
                            {tech}
                        </span>
                    {/each}
                </div>

                <!-- Links -->
                <div class="flex gap-3">
                    {#if project.hasDetailPage}
                        <a
                            href="/{locale}/projects/{project.id}"
                            class="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all"
                        >
                            <ExternalLink size={14} />
                            {translate(locale, 'projects.viewDetails')}
                        </a>
                    {:else}
                        {#if project.links.demo}
                            <a
                                href={project.links.demo}
                                target="_blank"
                                rel="noreferrer"
                                class="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all"
                            >
                                <ExternalLink size={14} />
                                {translate(locale, 'projects.viewProject')}
                            </a>
                        {/if}
                        {#if project.links.github}
                            <a
                                href={project.links.github}
                                target="_blank"
                                rel="noreferrer"
                                class="hover:bg-muted border-border flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                            >
                                <Github size={14} />
                                GitHub
                            </a>
                        {/if}
                    {/if}
                </div>
            </article>
        {/each}
    </section>
</div>

<script lang="ts">
import {ExternalLink, Github} from '@lucide/svelte'

import {projects} from '$lib/data/projects'
import {translate, type Locale} from '$lib/i18n/runtime'

const {locale} = $props<{locale: Locale}>()

// Helper to safely access localized content
const loc = $derived<Locale>(locale as Locale)
</script>
