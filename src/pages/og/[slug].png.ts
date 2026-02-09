import type { APIRoute, GetStaticPaths } from 'astro'
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'
import { fetchPodcastData } from '../../lib/rss'

const SITE_URL = 'https://walkingdevs.com'

export const prerender = true

export const getStaticPaths: GetStaticPaths = async () => {
  const podcast = await fetchPodcastData()
  return podcast.episodes.map((episode) => ({
    params: { slug: episode.slug },
  }))
}

export const GET: APIRoute = async ({ params }) => {
  const podcast = await fetchPodcastData()
  const episode = podcast.episodes.find((e) => e.slug === params.slug)

  if (!episode) {
    return new Response('Not found', { status: 404 })
  }

  const episodeNumber = episode.episodeNumber.toString().padStart(3, '0')
  const coverImageUrl = new URL(podcast.coverUrl, SITE_URL).toString()

  const html = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#111827',
        padding: '60px',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            },
            children: [
              {
                type: 'img',
                props: {
                  src: coverImageUrl,
                  width: 120,
                  height: 120,
                  style: {
                    borderRadius: '12px',
                    marginRight: '24px',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '28px',
                          color: '#9ca3af',
                          marginBottom: '8px',
                        },
                        children: podcast.title,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '20px',
                          color: '#6b7280',
                        },
                        children: `Episode ${episodeNumber}`,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.2,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            },
            children: episode.title,
          },
        },
      ],
    },
  }

  return new ImageResponse(html, {
    width: 1200,
    height: 630,
  })
}
