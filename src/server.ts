import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { searchDocs } from './tools/search-docs.js'
import { getPage } from './tools/get-page.js'
import { listCategories } from './tools/list-categories.js'
import { getVariables } from './tools/get-variables.js'

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'acss-docs',
    version: '1.0.0',
  })

  server.tool(
    'search_acss_docs',
    'Fuzzy full-text search across all ACSS v3.0 documentation pages. Returns ranked results with excerpts, classes, and variables found on each page.',
    {
      query: z.string().describe('Search query (e.g. "flexbox grid", "btn variables", "spacing classes")'),
      category: z.string().optional().describe('Filter by category slug (e.g. "buttons-links", "spacing", "grids")'),
      limit: z.number().min(1).max(50).optional().describe('Max results to return (default 10, max 50)'),
      offset: z.number().min(0).optional().describe('Skip N results for pagination (default 0)'),
    },
    async (input) => ({
      content: [{ type: 'text' as const, text: searchDocs(input) }],
    })
  )

  server.tool(
    'get_acss_page',
    'Get the full content of a specific ACSS documentation page by slug. Returns title, headings, content, code examples, CSS classes, and variables.',
    {
      slug: z.string().describe('Page slug — full (e.g. "buttons-links/button-variables") or bare (e.g. "button-variables")'),
    },
    async (input) => ({
      content: [{ type: 'text' as const, text: getPage(input) }],
    })
  )

  server.tool(
    'list_acss_categories',
    'List all ACSS v3.0 documentation categories. Optionally include page listings per category for browsing the full doc structure.',
    {
      include_pages: z.boolean().optional().describe('Include page listings per category (default false)'),
    },
    async (input) => ({
      content: [{ type: 'text' as const, text: listCategories(input) }],
    })
  )

  server.tool(
    'get_acss_variables',
    'Search and browse ACSS CSS custom properties (variables). Filter by category or search term. Returns variable names, defaults, and descriptions.',
    {
      category: z.string().optional().describe('Filter by variable category (e.g. "spacing", "colors", "typography", "buttons")'),
      search: z.string().optional().describe('Search term to filter variables (e.g. "btn", "space", "primary")'),
      limit: z.number().min(1).max(50).optional().describe('Max results (default 10, max 50)'),
      offset: z.number().min(0).optional().describe('Skip N results for pagination (default 0)'),
    },
    async (input) => ({
      content: [{ type: 'text' as const, text: getVariables(input) }],
    })
  )

  return server
}
