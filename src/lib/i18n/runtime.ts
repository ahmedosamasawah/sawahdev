import ar from '$lib/i18n/ar.json'
import en from '$lib/i18n/en.json'

const messages = {en, ar} as const

type Locale = keyof typeof messages

function get_nested(obj: any, path: string): unknown {
    return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

function translate(locale: Locale, key: string): string {
    const value = get_nested(messages[locale], key)
    return typeof value === 'string' ? value : key
}

function locale_from_path(pathname: string): Locale | undefined {
    const segment = pathname.split('/').filter(Boolean)[0]
    const [defaultLocale] = Object.keys(messages) as Locale[]
    return segment in messages ? (segment as Locale) : defaultLocale
}

function build_path_for_locale(pathname: string, locale: Locale): string {
    const segments = pathname.split('/').filter(Boolean)
    const current = locale_from_path(pathname)

    if (segments[0] === current) segments[0] = locale
    else segments.unshift(locale)

    return '/' + segments.join('/')
}

function format_date(locale: Locale, value: string | Date): string {
    if (!value) return ''
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    const intl_locale = locale === 'ar' ? 'ar' : 'en'
    return new Intl.DateTimeFormat(intl_locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date)
}

export {build_path_for_locale, format_date, type Locale, locale_from_path, messages, translate}
