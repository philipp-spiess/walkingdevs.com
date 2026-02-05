import type { APIRoute } from 'astro'
import { parseEpisodeTitle } from '@/lib/slugify'

const RSS_SOURCE = 'https://api.riverside.fm/hosting/aXkNVfVi.rss'
const SITE_URL = 'https://walkingdevs.com'

export const GET: APIRoute = async () => {
  const response = await fetch(RSS_SOURCE)
  let xml = await response.text()

  // Replace Riverside atom:link with our own URL
  xml = xml.replace(
    /<atom:link href="https:\/\/api\.riverside\.fm\/hosting\/[^"]*"/,
    `<atom:link href="${SITE_URL}/rss.xml"`
  )

  // Remove itunes:email element
  xml = xml.replace(/<itunes:email>[^<]*<\/itunes:email>/, '')

  // Remove generator tag
  xml = xml.replace(/<generator>[^<]*<\/generator>/, '')

  // Fix main channel link to include https://
  xml = xml.replace(/<link>walkingdevs\.com<\/link>/, `<link>${SITE_URL}</link>`)

  // Add link to each episode item pointing to the blog post
  xml = xml.replace(/<item>[\s\S]*?<title><!\[CDATA\[([^\]]+)\]\]><\/title>/g, (match, title) => {
    const { slug } = parseEpisodeTitle(title)
    const link = `<link>${SITE_URL}/${slug}/</link>`
    // Insert link after the title
    return match + link
  })

  // Replace Riverside cover image with our own
  xml = xml.replace(
    /https:\/\/hosting-media\.rs-prod\.riverside\.fm\/media\/podcasts\/[^"]+\.png/g,
    `${SITE_URL}/cover.png`
  )

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}
