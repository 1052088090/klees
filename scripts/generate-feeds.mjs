import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://klee727.cn').replace(/\/$/, '');
const SITE_TITLE = '可莉档案袋';
const SITE_DESCRIPTION = '西风骑士团火花骑士档案记录';

const root = process.cwd();
const blogDir = path.join(root, 'content/blog');
const publicDir = path.join(root, 'public');

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function getPosts() {
  if (!fs.existsSync(blogDir)) return [];
  return fs.readdirSync(blogDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const { data } = matter(fs.readFileSync(path.join(blogDir, f), 'utf8'));
      return { slug: f.replace(/\.mdx$/, ''), title: data.title || '', date: data.date || new Date().toISOString(), excerpt: data.excerpt || '' };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

const posts = getPosts();

const rssItems = posts.map((p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/content', priority: '0.8', changefreq: 'weekly' },
  { path: '/friends', priority: '0.5', changefreq: 'monthly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`).join('\n')}
${posts.map((p) => `  <url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${new Date(p.date).toISOString().split('T')[0]}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'rss.xml'), rss);
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log(`Generated rss.xml and sitemap.xml (${posts.length} posts)`);
