import { getAllPosts } from '@/lib/mdx';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(): Promise<Response> {
  const siteUrl = 'https://khadafidaffa.com';
  const posts = await getAllPosts();

  const itemsXml = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.metadata.slug}`;
      const pubDate = new Date(post.metadata.date).toUTCString();
      const title = escapeXml(post.metadata.title);
      const description = escapeXml(post.metadata.excerpt || '');
      const category = post.metadata.category ? escapeXml(post.metadata.category) : 'General';

      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${category}</category>
      <description>${description}</description>
    </item>`;
    })
    .join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Daffa Dhiyaulhaq Khadafi — Digital Grimoire</title>
    <link>${siteUrl}/blog</link>
    <description>Catatan arsitektur kecerdasan buatan, sistem rekayasa perangkat lunak, dan pemikiran independen.</description>
    <language>id-ID</language>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
