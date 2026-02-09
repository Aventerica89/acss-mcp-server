# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-02-09

### Added
- Initial release of ACSS MCP Server
- `search_acss_docs` tool for fuzzy full-text search across documentation
- `get_acss_page` tool for retrieving complete documentation pages
- `list_acss_categories` tool for browsing documentation structure
- `get_acss_variables` tool for searching CSS custom properties
- Pre-scraped ACSS v3.0 documentation data
- Documentation scraper for updating data files
- TypeScript implementation with strict type checking
- Comprehensive README with installation instructions
- Support for Claude Desktop and Claude.ai web interface

### Technical Details
- Built with @modelcontextprotocol/sdk v1.12+
- Uses Fuse.js for fuzzy search functionality
- Zod schema validation for tool inputs
- Vitest for testing framework

[1.0.0]: https://github.com/YOUR_USERNAME/acss-mcp-server/releases/tag/v1.0.0
