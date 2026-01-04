import { load_blog_posts } from '../blog.js'
import { build_manifest, write_manifest } from '../manifest.js'

async function main() {
  console.log('Generating route manifest...')
  const posts = await load_blog_posts()
  const manifest = build_manifest(posts)
  await write_manifest(manifest)
  console.log('Done.')
}

main().catch(console.error)
