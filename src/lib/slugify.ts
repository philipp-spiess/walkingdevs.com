/**
 * Parse episode title and generate slug
 * "001 Pilot" → { number: 1, title: "Pilot", slug: "001-pilot" }
 * "042: Building a SaaS" → { number: 42, title: "Building a SaaS", slug: "042-building-a-saas" }
 */
export function parseEpisodeTitle(rawTitle: string): {
  number: number
  title: string
  slug: string
} {
  // Match pattern: "001 Title" or "001: Title" or "001 - Title"
  const match = rawTitle.match(/^(\d{3})[\s:\-]+(.+)$/)

  if (!match) {
    // Fallback: just slugify the whole title
    const slug = slugify(rawTitle)
    return { number: 0, title: rawTitle, slug }
  }

  const [, numStr, title] = match
  const number = parseInt(numStr, 10)
  const paddedNumber = numStr // Keep original padding (e.g., "001")
  const slug = `${paddedNumber}-${slugify(title)}`

  return { number, title: title.trim(), slug }
}

/**
 * Convert string to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
}
