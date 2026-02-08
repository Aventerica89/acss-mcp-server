import { SITEMAP_URL, VERSION_PREFIX } from '../constants.js'

interface SitemapEntry {
  url: string
  slug: string
  category: string
}

export async function fetchSitemapUrls(): Promise<SitemapEntry[]> {
  const response = await fetch(SITEMAP_URL)
  if (!response.ok) {
    throw new Error(`Sitemap fetch failed: ${response.status}`)
  }

  const xml = await response.text()
  const urls = extractUrls(xml)

  return urls
    .filter((url) => url.includes(VERSION_PREFIX))
    .map(parseUrl)
    .filter((entry): entry is SitemapEntry => entry !== null)
}

function extractUrls(xml: string): string[] {
  const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g)
  return Array.from(matches, (m) => m[1])
}

function parseUrl(url: string): SitemapEntry | null {
  const versionIndex = url.indexOf(VERSION_PREFIX)
  if (versionIndex === -1) return null

  const path = url.slice(versionIndex + VERSION_PREFIX.length).replace(/\/$/, '')
  if (!path) return null

  const parts = path.split('/')
  const category = parts.length > 1 ? parts[0] : 'general'
  const slug = path

  return { url, slug, category }
}
