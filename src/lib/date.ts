const VIENNA_TIME_ZONE = 'Europe/Vienna'

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: VIENNA_TIME_ZONE,
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: VIENNA_TIME_ZONE,
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export function formatShortDateInVienna(date: Date): string {
  return shortDateFormatter.format(date)
}

export function formatLongDateInVienna(date: Date): string {
  return longDateFormatter.format(date)
}
