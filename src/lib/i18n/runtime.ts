import ar from '$lib/i18n/ar.json'
import en from '$lib/i18n/en.json'

const messages = {en, ar} as const

type Locale = keyof typeof messages

function get_nested(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((acc, key) => acc?.[key] as Record<string, unknown>, obj)
}

function translate(locale: Locale, key: string): string {
    const value = get_nested(messages[locale], key)
    return typeof value === 'string' ? value : key
}

function locale_from_path(pathname: string): Locale {
    const segment = pathname.split('/').filter(Boolean)[0]
    return segment && segment in messages ? (segment as Locale) : 'en'
}

function build_path_for_locale(pathname: string, locale: Locale): string {
    const segments = pathname.split('/').filter(Boolean)
    const current = locale_from_path(pathname)

    if (segments[0] === current) segments[0] = locale
    else segments.unshift(locale)

    return '/' + segments.join('/')
}

export {build_path_for_locale, type Locale, locale_from_path, messages, translate}
