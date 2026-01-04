/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {{en: string; ar: string}} titles
 * @property {{en: string; ar: string}} descriptions
 * @property {{en: string; ar: string}} role
 * @property {string[]} tech
 * @property {string} [year]
 * @property {string} [image]
 * @property {boolean} [hasDetailPage]
 * @property {{
 *   en: {overview: string; challenge: string; solution: string; results: string};
 *   ar: {overview: string; challenge: string; solution: string; results: string}
 * }} [detailedContent]
 * @property {string[]} [gallery]
 * @property {{demo?: string; github?: string}} links
 */

/** @type {Project[]} */
const projects = [
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
        year: '2024',
        image: '/en-logo.gif',
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
        year: '2025',
        image: '/en-logo.gif',
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
        year: '2024',
        image: '/en-logo.gif',
        hasDetailPage: true,
        detailedContent: {
            en: {
                overview:
                    'A comprehensive toolkit for auditing web performance, built to help developers identify and fix performance bottlenecks in their applications.',
                challenge:
                    'Manual performance audits were time-consuming and inconsistent. Teams needed automated tools to track bundle sizes, analyze performance metrics, and enforce budgets across different environments.',
                solution:
                    'Built a suite of scripts leveraging Playwright for real-world testing, Terser for bundle analysis, and Rollup for build optimization. The toolkit provides automated reports, performance budgets, and actionable insights.',
                results:
                    'Reduced average page load times by 40% across projects. Automated performance testing saved 10+ hours per week for the team.',
            },
            ar: {
                overview:
                    'مجموعة أدوات شاملة لتدقيق أداء الويب، تم بناؤها لمساعدة المطورين على تحديد وإصلاح مشاكل الأداء في تطبيقاتهم.',
                challenge:
                    'كانت عمليات تدقيق الأداء اليدوية تستغرق وقتًا طويلاً وغير متسقة. احتاجت الفرق إلى أدوات آلية لتتبع أحجام الحزم وتحليل مقاييس الأداء وفرض الميزانيات عبر بيئات مختلفة.',
                solution:
                    'تم بناء مجموعة من السكربتات باستخدام Playwright للاختبار في العالم الحقيقي، وTerser لتحليل الحزم، وRollup لتحسين البناء. توفر المجموعة تقارير آلية وميزانيات أداء ورؤى قابلة للتنفيذ.',
                results:
                    'تم تقليل متوسط أوقات تحميل الصفحة بنسبة 40٪ عبر المشاريع. وفر اختبار الأداء الآلي أكثر من 10 ساعات أسبوعيًا للفريق.',
            },
        },
        links: {},
    },
]

export {projects}
