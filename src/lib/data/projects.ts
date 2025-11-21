import {projects as projects_data} from './projects.js'

type Project = {
    id: string
    titles: {en: string; ar: string}
    descriptions: {en: string; ar: string}
    role: {en: string; ar: string}
    tech: string[]
    year?: string
    image?: string
    hasDetailPage?: boolean
    detailedContent?: {
        en: {
            overview: string
            challenge: string
            solution: string
            results: string
        }
        ar: {
            overview: string
            challenge: string
            solution: string
            results: string
        }
    }
    gallery?: string[]
    links: {
        demo?: string
        github?: string
    }
}

const projects = projects_data as Project[]

export type {Project}
export {projects}
