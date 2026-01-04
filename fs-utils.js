import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root_dir = __dirname
const dist_dir = path.join(root_dir, 'dist')

async function file_exists(file_path) {
  try {
    await fs.access(file_path)
    return true
  } catch {
    return false
  }
}

async function copy_dir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const items = await fs.readdir(src, { withFileTypes: true })

  for (const item of items) {
    const src_path = path.join(src, item.name)
    const dest_path = path.join(dest, item.name)

    if (item.isDirectory()) {
      await copy_dir(src_path, dest_path)
    } else if (item.isFile()) {
      await fs.copyFile(src_path, dest_path)
    }
  }
}

async function clean_dist() {
  await fs.rm(dist_dir, { recursive: true, force: true })
  await fs.mkdir(dist_dir, { recursive: true })
}

const base_path = '/sawahdev/'

export { base_path,clean_dist, copy_dir, dist_dir, file_exists, root_dir }

