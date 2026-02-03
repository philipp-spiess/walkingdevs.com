import type { APIRoute } from 'astro'

const RSS_SOURCE = 'https://api.riverside.fm/hosting/aXkNVfVi.rss'

export const GET: APIRoute = async () => {
  const response = await fetch(RSS_SOURCE)
  const xml = await response.text()

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}
