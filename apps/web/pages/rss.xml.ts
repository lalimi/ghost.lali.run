import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '../lib/ghost'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = process.env.SITE_URL || 'https://lali.run'
  const posts = await api.posts.browse({ limit: 20, order: 'published_at desc' })
  const items = posts.map((p: any) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteUrl}/${p.slug}</link>
      <guid>${p.id}</guid>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt || ''}]]></description>
    </item>
  `).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>lali.run</title><link>${siteUrl}</link><description>RSS</description>${items}</channel></rss>`
  res.setHeader('Content-Type', 'application/rss+xml')
  res.status(200).send(xml)
}