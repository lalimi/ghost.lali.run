import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '../lib/ghost'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = process.env.SITE_URL || 'https://lali.run'
  const posts = await api.posts.browse({ limit: 'all' })
  const urls = posts.map((p: any) => `<url><loc>${siteUrl}/${p.slug}</loc></url>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  res.setHeader('Content-Type', 'application/xml')
  res.status(200).send(xml)
}