import type { APIRoute, GetStaticPaths } from 'astro'
import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'
import { fetchPodcastData } from '../../lib/rss'
import { generatePeaks } from '../../lib/waveform'
import { coverBase64 } from '../../lib/cover-og'

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
  const peaks = generatePeaks(episode.slug, 58)

  // Generate waveform bars
  const waveformBars = peaks.map((peak, i) => ({
    type: 'div',
    props: {
      key: i,
      style: {
        width: '10px',
        height: `${Math.round(peak * 80)}px`,
        backgroundColor: i < peaks.length * 0.35 ? '#1f2937' : '#d1d5db',
        borderRadius: '5px',
      },
    },
  }))

  const html = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFEFA',
        padding: '70px 100px',
        fontFamily: 'system-ui, sans-serif',
        overflow: 'hidden',
      },
      children: [
        // Header row with cover/info and platform icons
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            },
            children: [
              // Left side: cover and info
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'flex-start',
                    flex: 1,
                    minWidth: 0,
                  },
                  children: [
              {
                type: 'div',
                props: {
                  style: {
                    position: 'relative',
                    display: 'flex',
                    width: '180px',
                    height: '180px',
                    marginRight: '32px',
                  },
                  children: [
                    {
                      type: 'img',
                      props: {
                        src: coverBase64,
                        width: 180,
                        height: 180,
                        style: {
                          borderRadius: '16px',
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: '16px',
                          border: '1px solid rgba(0,0,0,0.1)',
                        },
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: '12px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '24px',
                          color: '#6b7280',
                          marginBottom: '8px',
                        },
                        children: `Episode ${episodeNumber}`,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '56px',
                          fontWeight: 'bold',
                          color: '#111827',
                          lineHeight: 1.1,
                        },
                        children: episode.title,
                      },
                    },
                  ],
                },
              },
                  ],
                },
              },
              // Right side: platform icons
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexShrink: 0,
                    marginLeft: '24px',
                  },
                  children: [
                    // Apple Podcasts
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '40px',
                          height: '40px',
                          borderRadius: '20px',
                          backgroundColor: '#1f2937',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        children: [
                          {
                            type: 'svg',
                            props: {
                              width: 22,
                              height: 22,
                              viewBox: '0 0 24 24',
                              fill: 'white',
                              children: [
                                {
                                  type: 'path',
                                  props: {
                                    d: 'M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z',
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    // Spotify
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '40px',
                          height: '40px',
                          borderRadius: '20px',
                          backgroundColor: '#1DB954',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        children: [
                          {
                            type: 'svg',
                            props: {
                              width: 22,
                              height: 22,
                              viewBox: '0 0 24 24',
                              fill: 'white',
                              children: [
                                {
                                  type: 'path',
                                  props: {
                                    d: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z',
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    // RSS
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '40px',
                          height: '40px',
                          borderRadius: '20px',
                          backgroundColor: 'transparent',
                          border: '2px solid #d1d5db',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        children: [
                          {
                            type: 'svg',
                            props: {
                              width: 20,
                              height: 20,
                              viewBox: '0 0 24 24',
                              fill: '#6b7280',
                              children: [
                                {
                                  type: 'path',
                                  props: {
                                    d: 'M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z',
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Waveform section
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginTop: 'auto',
              gap: '6px',
            },
            children: [
              // Play button
              {
                type: 'div',
                props: {
                  style: {
                    width: '56px',
                    height: '56px',
                    borderRadius: '28px',
                    backgroundColor: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                    flexShrink: 0,
                  },
                  children: [
                    {
                      type: 'svg',
                      props: {
                        width: 28,
                        height: 28,
                        viewBox: '0 0 24 24',
                        fill: 'white',
                        style: {
                          marginLeft: '2px',
                        },
                        children: [
                          {
                            type: 'path',
                            props: {
                              d: 'M8 5v14l11-7z',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              ...waveformBars,
            ],
          },
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '32px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '26px',
                          fontWeight: '600',
                          color: '#374151',
                        },
                        children: podcast.title,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '24px',
                          color: '#9ca3af',
                          marginLeft: '12px',
                        },
                        children: `· ${episode.duration}`,
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    color: '#9ca3af',
                  },
                  children: 'walkingdevs.com',
                },
              },
            ],
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
