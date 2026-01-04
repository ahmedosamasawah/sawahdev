import fs from 'node:fs/promises'
import path from 'node:path'

import { build as vite_build } from 'vite'

import { base_path, copy_dir, dist_dir, file_exists, root_dir } from './fs-utils.js'

async function build_client_assets() {
  const client_out_dir = path.join(dist_dir, 'client')

  await vite_build({
    configFile: path.join(root_dir, 'vite.config.ts'),
    build: {
      outDir: client_out_dir,
      manifest: true,
    },
  })

  const manifest_path = path.join(client_out_dir, '.vite', 'manifest.json')
  const manifest_raw = await fs.readFile(manifest_path, 'utf8')
  const manifest = JSON.parse(manifest_raw)
  const entries = Object.values(manifest)
  const entry = entries.find(e => e.isEntry) || entries.find(e => e.file?.endsWith('.js'))

  const assets_src = path.join(client_out_dir, 'assets')
  const assets_dest = path.join(dist_dir, 'assets')

  if (await file_exists(assets_src))
    await copy_dir(assets_src, assets_dest)

  // Ensure base_path ends with / and doesn't duplicate if already present
  const clean_base = base_path.endsWith('/') ? base_path : `${base_path}/`

  const entry_js = `${clean_base}assets/${path.basename(entry.file)}`
  const css = Array.isArray(entry.css)
    ? entry.css.map((href) => `${clean_base}assets/${path.basename(href)}`)
    : []

  return { entry_js, css }
}

export { build_client_assets }
