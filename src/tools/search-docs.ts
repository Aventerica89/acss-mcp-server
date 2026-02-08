import { getFuseIndex, getPages } from '../search/fuse-index.js'
import { CHARACTER_LIMIT, DEFAULT_LIMIT, MAX_LIMIT } from '../constants.js'
import type { AcssPage } from '../types.js'

interface SearchDocsInput {
  query: string
  category?: string
  limit?: number
  offset?: number
}

export function searchDocs(input: SearchDocsInput): string {
  const { query, category, offset = 0 } = input
  const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT)

  const fuse = getFuseIndex()
  const raw = fuse.search(query)

  const filtered = category
    ? raw.filter((r) => r.item.category === category)
    : raw

  const total = filtered.length
  const slice = filtered.slice(offset, offset + limit)

  if (slice.length === 0) {
    return `No results found for "${query}"${category ? ` in category "${category}"` : ''}.`
  }

  const lines: string[] = [
    `## Search Results for "${query}"`,
    `Showing ${offset + 1}-${offset + slice.length} of ${total} results\n`,
  ]

  for (const result of slice) {
    const page = result.item
    const score = result.score ?? 0
    const confidence = Math.round((1 - score) * 100)

    lines.push(`### ${page.title}`)
    lines.push(`- **Category:** ${page.category}`)
    lines.push(`- **Slug:** \`${page.slug}\``)
    lines.push(`- **Relevance:** ${confidence}%`)

    const excerpt = generateExcerpt(page, query)
    if (excerpt) {
      lines.push(`- **Excerpt:** ${excerpt}`)
    }

    if (page.classes.length > 0) {
      const topClasses = page.classes.slice(0, 8).join(', ')
      lines.push(`- **Classes:** \`${topClasses}\`${page.classes.length > 8 ? '...' : ''}`)
    }

    if (page.variables.length > 0) {
      const topVars = page.variables.slice(0, 6).join(', ')
      lines.push(`- **Variables:** \`${topVars}\`${page.variables.length > 6 ? '...' : ''}`)
    }

    lines.push('')
  }

  if (offset + limit < total) {
    lines.push(
      `_Use offset=${offset + limit} to see more results._`
    )
  }

  return truncate(lines.join('\n'))
}

function generateExcerpt(page: AcssPage, query: string): string {
  const lower = query.toLowerCase()
  const contentLower = page.content.toLowerCase()
  const idx = contentLower.indexOf(lower)

  if (idx === -1) {
    return page.content.slice(0, 200) + (page.content.length > 200 ? '...' : '')
  }

  const start = Math.max(0, idx - 80)
  const end = Math.min(page.content.length, idx + query.length + 120)
  const prefix = start > 0 ? '...' : ''
  const suffix = end < page.content.length ? '...' : ''

  return `${prefix}${page.content.slice(start, end)}${suffix}`
}

function truncate(text: string): string {
  if (text.length <= CHARACTER_LIMIT) return text
  return text.slice(0, CHARACTER_LIMIT - 20) + '\n\n_[Truncated]_'
}
