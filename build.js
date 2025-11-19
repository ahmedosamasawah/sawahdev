import { clean_dist } from './fs-utils.js'
import { load_i18n } from './i18n.js'
import { load_blog_posts } from './blog.js'
import { build_manifest, write_manifest } from './manifest.js'
import { build_client_assets } from './client-build.js'
import { ssg_routes } from './ssg.js'
import { generate_og_images } from './og.js'
import { generate_sitemap_and_robots } from './sitemap.js'

async function main() {
  try {
    await clean_dist()

    const i18n = await load_i18n()
    const blog_posts = await load_blog_posts()
    const manifest = build_manifest(blog_posts)

    await write_manifest(manifest)

    const assets = await build_client_assets()

    await ssg_routes(manifest, i18n, assets)
    await generate_og_images(manifest)
    await generate_sitemap_and_robots(manifest)
  } catch (error) {
    console.error('build failed', error)
    process.exitCode = 1
  }
}

await main()
