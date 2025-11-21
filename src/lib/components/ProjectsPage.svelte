<div class="w-full max-w-2xl space-y-12">
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

    <section class="space-y-8">
        {#each projects as project (project.id)}
            <article class="space-y-2">
                <div class="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 class="text-lg font-semibold">{project.titles[locale]}</h2>
                    <span class="text-muted-foreground text-xs">{project.role[locale]}</span>
                </div>

                <p class="text-muted-foreground text-sm leading-relaxed">
                    {project.descriptions[locale]}
                </p>

                <div class="flex flex-wrap items-center gap-3 text-xs">
                    <span class="text-muted-foreground">{project.tech.join(', ')}</span>
                    {#if project.links.github}
                        <a
                            class="hover:text-foreground text-muted-foreground underline decoration-dotted underline-offset-4"
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                        >
                            github
                        </a>
                    {/if}
                    {#if project.links.demo}
                        <a
                            class="hover:text-foreground text-muted-foreground underline decoration-dotted underline-offset-4"
                            href={project.links.demo}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {translate(locale, 'projects.viewProject')}
                        </a>
                    {/if}
                </div>
            </article>
        {/each}
    </section>
</div>

<script>
import {projects} from '$lib/data/projects'
import {translate} from '$lib/i18n/runtime'

const {locale} = $props()
</script>
