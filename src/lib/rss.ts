import { XMLParser } from 'fast-xml-parser'
import { parseEpisodeTitle } from './slugify'
import type { Episode, PodcastInfo } from './types'

const RSS_URL = 'https://api.riverside.fm/hosting/aXkNVfVi.rss'

interface RssItem {
  title: string
  description: string
  pubDate: string
  enclosure: {
    '@_url': string
    '@_type': string
  }
  'itunes:duration'?: string
  'itunes:summary'?: string
}

interface RssChannel {
  title: string
  description: string
  'itunes:author'?: string
  'itunes:image'?: {
    '@_href': string
  }
  item: RssItem | RssItem[]
}

interface RssFeed {
  rss: {
    channel: RssChannel
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function formatDuration(duration: string | undefined): string {
  if (!duration) return ''

  // If it's in HH:MM:SS format with leading 00:, strip it
  if (duration.match(/^00:\d{2}:\d{2}$/)) {
    return duration.slice(3) // Remove "00:"
  }

  // If it's already in MM:SS or HH:MM:SS format
  if (duration.includes(':')) return duration

  // If it's in seconds, convert to MM:SS
  const totalSeconds = parseInt(duration, 10)
  if (isNaN(totalSeconds)) return duration

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export async function fetchPodcastData(): Promise<PodcastInfo> {
  const response = await fetch(RSS_URL)
  const xml = await response.text()

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  })

  const feed: RssFeed = parser.parse(xml)
  const channel = feed.rss.channel

  // Handle single item or array of items
  const items = Array.isArray(channel.item) ? channel.item : [channel.item]

  const episodes: Episode[] = items
    .filter((item) => item && item.title)
    .map((item) => {
      const { number, title, slug } = parseEpisodeTitle(item.title)

      return {
        episodeNumber: number,
        title,
        slug,
        description: stripHtml(item['itunes:summary'] || item.description || ''),
        publishedAt: new Date(item.pubDate),
        audioUrl: item.enclosure['@_url'],
        duration: formatDuration(item['itunes:duration']),
      }
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  return {
    title: channel.title,
    description: stripHtml(channel.description),
    author: channel['itunes:author'] || '',
    coverUrl: channel['itunes:image']?.['@_href'] || '',
    episodes,
  }
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | undefined> {
  const data = await fetchPodcastData()
  return data.episodes.find((ep) => ep.slug === slug)
}

export async function getAllEpisodes(): Promise<Episode[]> {
  const data = await fetchPodcastData()
  return data.episodes
}
