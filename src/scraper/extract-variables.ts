import type { AcssPage, CssVariable } from '../types.js'

const VARIABLE_DEFINITION_PATTERN =
  /--([\w-]+)\s*:\s*([^;}\n]+)/g

const KNOWN_CATEGORIES: Record<string, string[]> = {
  spacing: ['space', 'gap', 'margin', 'padding', 'section-space'],
  typography: ['font', 'text', 'heading', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'line-height', 'letter-spacing'],
  colors: ['primary', 'secondary', 'accent', 'neutral', 'shade', 'trans', 'base', 'bg', 'white', 'black'],
  buttons: ['btn'],
  containers: ['container', 'content-width', 'grid'],
  borders: ['border', 'radius'],
  shadows: ['shadow'],
  transitions: ['transition'],
  breakpoints: ['breakpoint', 'bp'],
}

export function extractVariables(pages: AcssPage[]): CssVariable[] {
  const variableMap = new Map<string, CssVariable>()

  for (const page of pages) {
    const allCode = page.codeBlocks.map((b) => b.code).join('\n')
    const allText = `${page.content}\n${allCode}`

    for (const match of allText.matchAll(VARIABLE_DEFINITION_PATTERN)) {
      const name = `--${match[1]}`
      const defaultValue = match[2].trim()

      if (variableMap.has(name)) continue

      variableMap.set(name, {
        name,
        category: categorizeVariable(name, page.category),
        description: buildDescription(name, page.title, page.category),
        defaultValue: defaultValue.length < 100 ? defaultValue : undefined,
        deprecated: allText.includes(`${name}`) && allText.includes('deprecat'),
      })
    }

    // Also capture variables mentioned but not defined with values
    for (const varName of page.variables) {
      if (variableMap.has(varName)) continue

      variableMap.set(varName, {
        name: varName,
        category: categorizeVariable(varName, page.category),
        description: buildDescription(varName, page.title, page.category),
        deprecated: false,
      })
    }
  }

  return [...variableMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

function categorizeVariable(name: string, pageCategory: string): string {
  const lower = name.toLowerCase()

  for (const [category, keywords] of Object.entries(KNOWN_CATEGORIES)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category
    }
  }

  return pageCategory || 'other'
}

function buildDescription(
  name: string,
  pageTitle: string,
  pageCategory: string
): string {
  const clean = name
    .replace(/^--/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return `${clean} (from ${pageTitle || pageCategory})`
}
