import { getVariables as loadVariables } from '../search/fuse-index.js'
import {
  CHARACTER_LIMIT,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from '../constants.js'
import type { CssVariable } from '../types.js'

interface GetVariablesInput {
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export function getVariables(input: GetVariablesInput): string {
  const { category, search, offset = 0 } = input
  const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT)

  let vars: CssVariable[] = loadVariables()

  if (category) {
    vars = vars.filter((v) => v.category === category)
  }

  if (search) {
    const lower = search.toLowerCase()
    vars = vars.filter(
      (v) =>
        v.name.toLowerCase().includes(lower) ||
        v.description.toLowerCase().includes(lower) ||
        v.category.toLowerCase().includes(lower)
    )
  }

  const total = vars.length
  const slice = vars.slice(offset, offset + limit)

  if (slice.length === 0) {
    const allCategories = [
      ...new Set(loadVariables().map((v) => v.category)),
    ].sort()

    return [
      'No variables found matching your criteria.',
      '',
      'Available variable categories:',
      ...allCategories.map((c) => `  - ${c}`),
    ].join('\n')
  }

  const lines: string[] = [
    '## CSS Custom Properties',
    `Showing ${offset + 1}-${offset + slice.length} of ${total} variables\n`,
  ]

  // Group by category for readability
  const grouped = new Map<string, CssVariable[]>()
  for (const v of slice) {
    const group = grouped.get(v.category) ?? []
    group.push(v)
    grouped.set(v.category, group)
  }

  for (const [cat, catVars] of grouped) {
    lines.push(`### ${cat}`)
    for (const v of catVars) {
      const parts = [`\`${v.name}\``]
      if (v.defaultValue) parts.push(`default: \`${v.defaultValue}\``)
      if (v.deprecated) parts.push('**(deprecated)**')
      parts.push(`— ${v.description}`)
      lines.push(`- ${parts.join(' | ')}`)
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

function truncate(text: string): string {
  if (text.length <= CHARACTER_LIMIT) return text
  return text.slice(0, CHARACTER_LIMIT - 20) + '\n\n_[Truncated]_'
}
