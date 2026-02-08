import { getSlugMap } from '../search/fuse-index.js'
import { CHARACTER_LIMIT } from '../constants.js'

interface GetPageInput {
  slug: string
}

export function getPage(input: GetPageInput): string {
  const map = getSlugMap()
  const page = map.get(input.slug)

  if (!page) {
    const available = [...map.keys()]
      .filter((k) => k.includes('/'))
      .slice(0, 20)
      .map((k) => `  - ${k}`)
      .join('\n')

    return [
      `Page not found: "${input.slug}"`,
      '',
      'Available slugs (sample):',
      available,
      '',
      '_Use `list_acss_categories` to browse all pages._',
    ].join('\n')
  }

  const lines: string[] = [
    `# ${page.title}`,
    `**Category:** ${page.category} | **URL:** ${page.url}`,
    '',
  ]

  if (page.headings.length > 0) {
    lines.push('## Table of Contents')
    for (const h of page.headings) {
      lines.push(`- ${h}`)
    }
    lines.push('')
  }

  lines.push('## Content')
  lines.push(page.content)
  lines.push('')

  if (page.codeBlocks.length > 0) {
    lines.push('## Code Examples')
    for (const block of page.codeBlocks) {
      lines.push(`\`\`\`${block.language}`)
      lines.push(block.code)
      lines.push('```')
      lines.push('')
    }
  }

  if (page.classes.length > 0) {
    lines.push('## CSS Classes Found')
    lines.push(page.classes.map((c) => `\`.${c}\``).join(', '))
    lines.push('')
  }

  if (page.variables.length > 0) {
    lines.push('## CSS Variables Found')
    lines.push(page.variables.map((v) => `\`${v}\``).join(', '))
    lines.push('')
  }

  return truncate(lines.join('\n'))
}

function truncate(text: string): string {
  if (text.length <= CHARACTER_LIMIT) return text
  return text.slice(0, CHARACTER_LIMIT - 20) + '\n\n_[Truncated]_'
}
