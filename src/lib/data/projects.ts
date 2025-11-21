import type {Locale} from '$lib/types/manifest'

import {projects as projects_data} from './projects.js'

type LocalizedString = Record<Locale, string>

type DetailedContent = Record<
    Locale,
    {
        overview: string
        challenge: string
        solution: string
        results: string
    }
>

type Project = {
    id: string
    titles: LocalizedString
    descriptions: LocalizedString
    role: LocalizedString
    tech: string[]
    year?: string
    image?: string
    hasDetailPage?: boolean
    detailedContent?: DetailedContent
    gallery?: string[]
    links: {
        demo?: string
        github?: string
    }
}

const projects = projects_data as Project[]

export type {Project}
export {projects}
