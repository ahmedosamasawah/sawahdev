import en from '$lib/i18n/en.json'
import ar from '$lib/i18n/ar.json'

const messages = { en, ar } as const

type Locale = keyof typeof messages

function get_nested(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, segment) => {
    if (
      acc &&
      typeof acc === 'object' &&
      segment in (acc as Record<string, unknown>)
    )
      return (acc as Record<string, unknown>)[segment]
    return undefined
  }, obj)
}

function translate(locale: Locale, key: string): string {
  const value = get_nested(messages[locale], key)
  if (value == null) return key
  if (typeof value === 'string') return value
  return String(value)
}

export { messages, translate, type Locale }
