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
    const base = '/sawahdev/'
    let clean_path = pathname
    if (pathname.startsWith(base)) {
        clean_path = pathname.slice(base.length)
        if (!clean_path.startsWith('/')) clean_path = '/' + clean_path
    }

    const segment = clean_path.split('/').filter(Boolean)[0]
    const [defaultLocale] = Object.keys(messages) as Locale[]
    return segment in messages ? (segment as Locale) : defaultLocale
}

function build_path_for_locale(pathname: string, locale: Locale): string {
    const base = '/sawahdev/'
    let clean_path = pathname

    if (pathname.startsWith(base)) {
        clean_path = pathname.slice(base.length)
        if (!clean_path.startsWith('/')) clean_path = '/' + clean_path
    }

    const segments = clean_path.split('/').filter(Boolean)

    const clean_segment = segments[0]
    const is_locale_segment = clean_segment in messages

    if (is_locale_segment) segments[0] = locale
    else segments.unshift(locale)

    let new_path = '/' + segments.join('/')

    const base_no_slash = base.endsWith('/') ? base.slice(0, -1) : base
    new_path = base_no_slash + new_path

    return new_path
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

export const base_url = '/sawahdev/'

export {build_path_for_locale, format_date, type Locale, locale_from_path, messages, translate}
