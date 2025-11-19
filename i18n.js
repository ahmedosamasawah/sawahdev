import fs from 'node:fs/promises'
import path from 'node:path'
import { root_dir } from './fs-utils.js'
import { locales } from './manifest.js'

async function load_i18n() {
  const base_path = path.join(root_dir, 'src', 'lib', 'i18n')
  const messages = {}

  for (const locale of locales) {
    const file_path = path.join(base_path, `${locale}.json`)
    let raw

    try {
      raw = await fs.readFile(file_path, 'utf8')
    } catch (error) {
      console.error(`failed to read i18n file ${file_path}`, error)
      throw error
    }

    try {
      messages[locale] = JSON.parse(raw)
    } catch (error) {
      console.error(`failed to parse i18n file ${file_path}`, error)
      throw error
    }
  }

  const html_meta = Object.fromEntries(
    locales.map((locale) => [
      locale,
      { lang: locale, dir: locale === 'ar' ? 'rtl' : 'ltr' },
    ]),
  )

  return { messages, html_meta }
}

export { load_i18n }
