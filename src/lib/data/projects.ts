type Project = {
    id: string
    titles: {en: string; ar: string}
    descriptions: {en: string; ar: string}
    role: {en: string; ar: string}
    tech: string[]
    links: {
        demo?: string
        github?: string
    }
}

const projects: Project[] = [
    {
        id: 'svelte-ssg',
        titles: {
            en: 'Custom Svelte Static Site Generator',
            ar: 'مولد مواقع ثابتة بسفيلت',
        },
        descriptions: {
            en: 'Manifest-driven SSG with localized routes, OG images, and Navgo hydration.',
            ar: 'مولد مواقع ثابتة يعتمد على manifest مع مسارات متعددة اللغات وصور OG وهيدرشن Navgo.',
        },
        role: {
            en: 'Lead developer',
            ar: 'المطور الرئيسي',
        },
        tech: ['svelte 5', 'vite', 'navgo', 'wuchale'],
        links: {
            github: 'https://github.com/AhmedOsamaDev',
        },
    },
    {
        id: 'portfolio',
        titles: {
            en: 'Personal Portfolio & Blog',
            ar: 'الملف الشخصي والمدونة',
        },
        descriptions: {
            en: 'Bilingual portfolio with blog, TOC, meta tags, and light decoration.',
            ar: 'ملف شخصي ومدونة بلغتين مع فهرس محتوى ووسوم ميتا وزخارف خفيفة.',
        },
        role: {
            en: 'Design & build',
            ar: 'تصميم وتنفيذ',
        },
        tech: ['svelte 5', 'tailwind', 'lucide'],
        links: {
            demo: 'https://ahmedosama.dev',
            github: 'https://github.com/AhmedOsamaDev',
        },
    },
    {
        id: 'perf-tooling',
        titles: {
            en: 'Web Perf Audit Toolkit',
            ar: 'حزمة تدقيق أداء الويب',
        },
        descriptions: {
            en: 'Scripts to trace, analyze, and budget bundle size and CWV.',
            ar: 'سكربتات لتتبع الأداء وتحليل حجم الحزم ومؤشرات الويب الحيوية.',
        },
        role: {
            en: 'Engineer',
            ar: 'مهندس',
        },
        tech: ['playwright', 'terser', 'rollup'],
        links: {
            github: 'https://github.com/AhmedOsamaDev',
        },
    },
]

export {projects}
