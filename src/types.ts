export interface AcssPage {
  slug: string
  category: string
  title: string
  url: string
  headings: string[]
  content: string
  codeBlocks: CodeBlock[]
  classes: string[]
  variables: string[]
}

export interface CodeBlock {
  language: string
  code: string
}

export interface CssVariable {
  name: string
  category: string
  description: string
  defaultValue?: string
  deprecated?: boolean
}

export interface AcssCategory {
  slug: string
  name: string
  pageCount: number
  pages: CategoryPage[]
}

export interface CategoryPage {
  slug: string
  title: string
}

export interface SearchResult {
  page: AcssPage
  score: number
  excerpt: string
}

export interface PaginatedResponse<T> {
  results: T[]
  total: number
  offset: number
  limit: number
  hasMore: boolean
}
