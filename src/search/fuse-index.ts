import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Fuse from 'fuse.js'
import { FUSE_OPTIONS } from '../constants.js'
import type { AcssPage, AcssCategory, CssVariable } from '../types.js'

const DATA_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../data'
)

function loadJson<T>(filename: string): T {
  const raw = readFileSync(path.join(DATA_DIR, filename), 'utf-8')
  return JSON.parse(raw) as T
}

let pages: AcssPage[] | null = null
let categories: AcssCategory[] | null = null
let variables: CssVariable[] | null = null
let fuseIndex: Fuse<AcssPage> | null = null
let slugMap: Map<string, AcssPage> | null = null

export function getPages(): AcssPage[] {
  if (!pages) {
    pages = loadJson<AcssPage[]>('pages.json')
  }
  return pages
}

export function getCategories(): AcssCategory[] {
  if (!categories) {
    categories = loadJson<AcssCategory[]>('categories.json')
  }
  return categories
}

export function getVariables(): CssVariable[] {
  if (!variables) {
    variables = loadJson<CssVariable[]>('variables.json')
  }
  return variables
}

export function getFuseIndex(): Fuse<AcssPage> {
  if (!fuseIndex) {
    fuseIndex = new Fuse(getPages(), FUSE_OPTIONS)
  }
  return fuseIndex
}

export function getSlugMap(): Map<string, AcssPage> {
  if (!slugMap) {
    slugMap = new Map<string, AcssPage>()
    for (const page of getPages()) {
      // Full slug: "buttons-links/button-variables"
      slugMap.set(page.slug, page)
      // Bare slug: "button-variables"
      const bare = page.slug.split('/').pop()
      if (bare && !slugMap.has(bare)) {
        slugMap.set(bare, page)
      }
    }
  }
  return slugMap
}
