import * as cheerio from 'cheerio'
import type { AcssPage, CodeBlock } from '../types.js'

export function extractContent(
  html: string,
  url: string,
  slug: string,
  category: string
): AcssPage {
  const $ = cheerio.load(html)

  // Remove noise elements
  $('script, style, nav, header, footer, .navbar, .sidebar, .menu').remove()

  const article = $('article').first()
  const main = article.length ? article : $('main').first()
  const container = main.length ? main : $('body')

  const title = extractTitle($, container)
  const headings = extractHeadings($, container)
  const codeBlocks = extractCodeBlocks($, container)
  const content = extractText($, container)
  const classes = extractClasses(content, codeBlocks)
  const variables = extractVariableNames(content, codeBlocks)

  return {
    slug,
    category,
    title,
    url,
    headings,
    content,
    codeBlocks,
    classes,
    variables,
  }
}

function extractTitle(
  $: cheerio.CheerioAPI,
  container: cheerio.Cheerio<any>
): string {
  const h1 = container.find('h1').first().text().trim()
  if (h1) return h1

  const metaTitle = $('meta[property="og:title"]').attr('content')
  if (metaTitle) return metaTitle.trim()

  return $('title').text().trim().replace(/ \|.*$/, '')
}

function extractHeadings(
  $: cheerio.CheerioAPI,
  container: cheerio.Cheerio<any>
): string[] {
  const headings: string[] = []
  container.find('h2, h3, h4').each((_, el) => {
    const text = $(el).text().trim()
    if (text) headings.push(text)
  })
  return headings
}

function extractCodeBlocks(
  $: cheerio.CheerioAPI,
  container: cheerio.Cheerio<any>
): CodeBlock[] {
  const blocks: CodeBlock[] = []
  container.find('pre code, code[class*="language-"]').each((_, el) => {
    const code = $(el).text().trim()
    if (!code) return

    const classAttr = $(el).attr('class') ?? ''
    const langMatch = classAttr.match(/language-(\w+)/)
    const language = langMatch ? langMatch[1] : 'css'

    blocks.push({ language, code })
  })
  return blocks
}

function extractText(
  $: cheerio.CheerioAPI,
  container: cheerio.Cheerio<any>
): string {
  // Clone to avoid mutating
  const clone = container.clone()
  clone.find('pre, code, script, style').remove()

  return clone
    .text()
    .replace(/\s+/g, ' ')
    .trim()
}

const CSS_CLASS_PATTERN = /\.([\w-]+(?:--[\w-]+)?)/g
const CSS_VARIABLE_PATTERN = /--([\w-]+)/g

function extractClasses(content: string, codeBlocks: CodeBlock[]): string[] {
  const allText = [content, ...codeBlocks.map((b) => b.code)].join(' ')
  const matches = new Set<string>()

  for (const match of allText.matchAll(CSS_CLASS_PATTERN)) {
    const cls = match[1]
    // Filter out common non-ACSS classes
    if (cls.length > 2 && !cls.startsWith('hljs')) {
      matches.add(cls)
    }
  }

  return [...matches].sort()
}

function extractVariableNames(
  content: string,
  codeBlocks: CodeBlock[]
): string[] {
  const allText = [content, ...codeBlocks.map((b) => b.code)].join(' ')
  const matches = new Set<string>()

  for (const match of allText.matchAll(CSS_VARIABLE_PATTERN)) {
    matches.add(`--${match[1]}`)
  }

  return [...matches].sort()
}
