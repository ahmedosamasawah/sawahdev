import { absolute_url, sitemap_paths } from '$lib/seo';

export const prerender = true;

export function GET() {
	const lastmod = new Date().toISOString().split('T')[0];
	const urls = Array.from(new Set(sitemap_paths()))
		.sort()
		.map((path) => `<url><loc>${absolute_url(path)}</loc><lastmod>${lastmod}</lastmod></url>`)
		.join('');
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		urls,
		'</urlset>',
		''
	].join('\n');

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8'
		}
	});
}
