import { getCategories } from '../search/fuse-index.js'
import { CHARACTER_LIMIT } from '../constants.js'

interface ListCategoriesInput {
  include_pages?: boolean
}

export function listCategories(input: ListCategoriesInput): string {
  const categories = getCategories()
  const includePgs = input.include_pages ?? false

  const lines: string[] = [
    '# ACSS v3.0 Documentation Categories',
    `${categories.length} categories, ${categories.reduce((sum, c) => sum + c.pageCount, 0)} total pages\n`,
  ]

  if (!includePgs) {
    lines.push('| Category | Pages |')
    lines.push('|----------|-------|')
    for (const cat of categories) {
      lines.push(`| ${cat.name} | ${cat.pageCount} |`)
    }
    lines.push('')
    lines.push('_Use `include_pages: true` to see page listings._')
  } else {
    for (const cat of categories) {
      lines.push(`## ${cat.name} (${cat.pageCount} pages)`)
      for (const page of cat.pages) {
        lines.push(`- \`${page.slug}\` — ${page.title}`)
      }
      lines.push('')
    }
  }

  return truncate(lines.join('\n'))
}

function truncate(text: string): string {
  if (text.length <= CHARACTER_LIMIT) return text
  return text.slice(0, CHARACTER_LIMIT - 20) + '\n\n_[Truncated]_'
}
