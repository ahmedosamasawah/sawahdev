{#if project}
    <div class="w-full max-w-4xl space-y-12">
        <!-- Header -->
        <section class="space-y-4">
            <a
                href="/{locale}/projects"
                class="hover:text-foreground text-muted-foreground block text-sm underline decoration-dotted underline-offset-4"
            >
                {translate(locale, 'common.backArrow')}
                {translate(locale, 'projects.title')}
            </a>

            <div class="flex items-start justify-between gap-4">
                <div>
                    <h1 class="mb-2 text-3xl font-semibold">
                        {project.titles[loc]}
                    </h1>
                    <p class="text-muted-foreground text-sm">{project.role[loc]}</p>
                </div>
                {#if project.year}
                    <span class="text-muted-foreground text-sm font-medium">{project.year}</span>
                {/if}
            </div>

            <!-- Tech Stack -->
            <div class="flex flex-wrap gap-2">
                {#each project.tech as tech}
                    <span
                        class="bg-primary/10 text-primary rounded-full px-3 py-1.5 text-sm font-medium"
                    >
                        {tech}
                    </span>
                {/each}
            </div>
        </section>

        <!-- Main Image -->
        {#if project.image}
            <section>
                <img
                    src={project.image}
                    alt={project.titles[loc]}
                    class="w-full rounded-2xl shadow-lg"
                />
            </section>
        {/if}

        <!-- Content Sections -->
        {#if project.detailedContent}
            {@const content = project.detailedContent[loc]}

            <section class="space-y-8">
                <!-- Overview -->
                <div class="space-y-3">
                    <h2 class="text-2xl font-semibold">{translate(locale, 'project.overview')}</h2>
                    <p class="text-muted-foreground leading-relaxed">{content.overview}</p>
                </div>

                <!-- Challenge -->
                <div class="space-y-3">
                    <h2 class="text-2xl font-semibold">{translate(locale, 'project.challenge')}</h2>
                    <p class="text-muted-foreground leading-relaxed">{content.challenge}</p>
                </div>

                <!-- Solution -->
                <div class="space-y-3">
                    <h2 class="text-2xl font-semibold">{translate(locale, 'project.solution')}</h2>
                    <p class="text-muted-foreground leading-relaxed">{content.solution}</p>
                </div>

                <!-- Results -->
                <div class="space-y-3">
                    <h2 class="text-2xl font-semibold">{translate(locale, 'project.results')}</h2>
                    <p class="text-muted-foreground leading-relaxed">{content.results}</p>
                </div>
            </section>
        {/if}

        <!-- Gallery -->
        {#if project.gallery && project.gallery.length > 0}
            <section class="space-y-6">
                <h2 class="text-2xl font-semibold">{translate(locale, 'project.gallery')}</h2>
                <div class="grid gap-6 md:grid-cols-2">
                    {#each project.gallery as image}
                        <div class="border-border overflow-hidden rounded-xl border shadow-md">
                            <img
                                src={image}
                                alt="{project.titles[loc]} screenshot"
                                class="w-full transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        <!-- Links -->
        {#if project.links.demo || project.links.github}
            <section class="border-border border-t pt-8">
                <div class="flex gap-3">
                    {#if project.links.demo}
                        <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noreferrer"
                            class="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all"
                        >
                            <ExternalLink size={18} />
                            {translate(locale, 'projects.viewProject')}
                        </a>
                    {/if}
                    {#if project.links.github}
                        <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            class="hover:bg-muted border-border flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-all"
                        >
                            <Github size={18} />
                            {translate(locale, 'projects.viewGithub')}
                        </a>
                    {/if}
                </div>
            </section>
        {/if}
    </div>
{:else}
    <div class="w-full max-w-4xl">
        <p class="text-muted-foreground">{translate(locale, 'projects.notFound')}</p>
    </div>
{/if}

<script lang="ts">
import {ExternalLink, Github} from '@lucide/svelte'

import {projects, type Project} from '$lib/data/projects'
import {translate, type Locale} from '$lib/i18n/runtime'

const {locale, projectId} = $props<{locale: Locale; projectId: string}>()
const project = $derived<Project | undefined>(projects.find(p => p.id === projectId))

// Helper to safely access localized content
const loc = $derived<Locale>(locale as Locale)
</script>
