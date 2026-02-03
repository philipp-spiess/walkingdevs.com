export interface Episode {
  episodeNumber: number
  title: string
  slug: string
  description: string
  publishedAt: Date
  audioUrl: string
  duration: string
}

export interface PodcastInfo {
  title: string
  description: string
  author: string
  coverUrl: string
  episodes: Episode[]
}
