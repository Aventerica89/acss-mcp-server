export const BASE_URL = 'https://docs.automaticcss.com'
export const SITEMAP_URL = `${BASE_URL}/sitemap.xml`
export const VERSION_PREFIX = '/3.0/'

export const CHARACTER_LIMIT = 8000
export const DEFAULT_LIMIT = 10
export const MAX_LIMIT = 50

export const SCRAPE_CONCURRENCY = 2
export const SCRAPE_DELAY_MS = 500

export const FUSE_OPTIONS = {
  threshold: 0.4,
  keys: [
    { name: 'title', weight: 3 },
    { name: 'headings', weight: 2 },
    { name: 'classes', weight: 2 },
    { name: 'category', weight: 1.5 },
    { name: 'content', weight: 1 },
  ],
  includeScore: true,
  ignoreLocation: true,
}

export const DATA_DIR = new URL('../../data/', import.meta.url)
