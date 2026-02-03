/**
 * Generate deterministic waveform peaks based on a seed string (e.g., episode slug)
 * This runs at build time so the waveform is consistent
 */
export function generatePeaks(seed: string, length = 200): number[] {
  // Simple seeded PRNG based on the seed string
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  const peaks: number[] = []
  for (let i = 0; i < length; i++) {
    // LCG random number generator with the seed
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    const random = (hash % 1000) / 1000

    // Create natural-looking waveform pattern
    const base = 0.3 + random * 0.5
    const variation = Math.sin(i / 8) * 0.15
    peaks.push(Math.min(1, Math.max(0.15, base + variation)))
  }

  return peaks
}
