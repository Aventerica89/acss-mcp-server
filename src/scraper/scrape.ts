import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { fetchSitemapUrls } from './fetch-sitemap.js'
import { extractContent } from './extract-content.js'
import { extractVariables } from './extract-variables.js'
import { SCRAPE_CONCURRENCY, SCRAPE_DELAY_MS } from '../constants.js'
import type { AcssPage, AcssCategory } from '../types.js'

const DATA_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../data'
)

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'acss-mcp-server/1.0 (documentation indexer)',
    },
  })
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status}: ${url}`)
  }
  return response.text()
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function scrapeInBatches(
  entries: Array<{ url: string; slug: string; category: string }>
): Promise<AcssPage[]> {
  const pages: AcssPage[] = []
  const errors: Array<{ url: string; error: string }> = []

  for (let i = 0; i < entries.length; i += SCRAPE_CONCURRENCY) {
    const batch = entries.slice(i, i + SCRAPE_CONCURRENCY)
    const progress = `[${i + 1}-${Math.min(i + SCRAPE_CONCURRENCY, entries.length)}/${entries.length}]`

    const results = await Promise.allSettled(
      batch.map(async (entry) => {
        const html = await fetchPage(entry.url)
        return extractContent(html, entry.url, entry.slug, entry.category)
      })
    )

    for (let j = 0; j < results.length; j++) {
      const result = results[j]
      const entry = batch[j]
      if (result.status === 'fulfilled') {
        pages.push(result.value)
        console.log(`${progress} OK: ${entry.slug} (${result.value.title})`)
      } else {
        const msg =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason)
        errors.push({ url: entry.url, error: msg })
        console.error(`${progress} FAIL: ${entry.slug} - ${msg}`)
      }
    }

    if (i + SCRAPE_CONCURRENCY < entries.length) {
      await sleep(SCRAPE_DELAY_MS)
    }
  }

  if (errors.length > 0) {
    console.warn(`\n${errors.length} pages failed:`)
    for (const e of errors) {
      console.warn(`  ${e.url}: ${e.error}`)
    }
  }

  return pages
}

function buildCategories(pages: AcssPage[]): AcssCategory[] {
  const categoryMap = new Map<string, AcssCategory>()

  for (const page of pages) {
    const existing = categoryMap.get(page.category)
    if (existing) {
      existing.pageCount++
      existing.pages.push({ slug: page.slug, title: page.title })
    } else {
      categoryMap.set(page.category, {
        slug: page.category,
        name: formatCategoryName(page.category),
        pageCount: 1,
        pages: [{ slug: page.slug, title: page.title }],
      })
    }
  }

  return [...categoryMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

function formatCategoryName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

async function main() {
  console.log('Fetching sitemap...')
  const entries = await fetchSitemapUrls()
  console.log(`Found ${entries.length} v3.0 pages\n`)

  if (entries.length === 0) {
    console.error('No v3.0 pages found in sitemap. Aborting.')
    process.exit(1)
  }

  console.log('Scraping pages...')
  const pages = await scrapeInBatches(entries)
  console.log(`\nSuccessfully scraped ${pages.length} pages`)

  console.log('Extracting variables...')
  const variables = extractVariables(pages)
  console.log(`Found ${variables.length} CSS variables`)

  console.log('Building categories...')
  const categories = buildCategories(pages)
  console.log(`Found ${categories.length} categories`)

  mkdirSync(DATA_DIR, { recursive: true })

  writeFileSync(
    path.join(DATA_DIR, 'pages.json'),
    JSON.stringify(pages, null, 2)
  )
  writeFileSync(
    path.join(DATA_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2)
  )
  writeFileSync(
    path.join(DATA_DIR, 'variables.json'),
    JSON.stringify(variables, null, 2)
  )

  console.log(`\nData written to ${DATA_DIR}/`)
  console.log(`  pages.json: ${pages.length} pages`)
  console.log(`  categories.json: ${categories.length} categories`)
  console.log(`  variables.json: ${variables.length} variables`)
}

main().catch((err) => {
  console.error('Scrape failed:', err)
  process.exit(1)
})
