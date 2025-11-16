import GhostContentAPI from '@tryghost/content-api'

export const api = new GhostContentAPI({
  url: process.env.GHOST_API_URL || '',
  key: process.env.GHOST_CONTENT_KEY || '',
  version: 'v5'
})