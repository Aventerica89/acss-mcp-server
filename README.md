# ACSS MCP Server

[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

An MCP (Model Context Protocol) server that provides AI assistants with access to the complete Automatic CSS v3.0 documentation. This server enables Claude and other MCP-compatible AI assistants to search, browse, and retrieve detailed information about ACSS classes, variables, and documentation.

## Table of Contents

- [What is This?](#what-is-this)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Standard Installation](#standard-installation)
  - [Configuration for Claude Desktop](#configuration-for-claude-desktop)
  - [Configuration for Claude.ai Web](#configuration-for-claudeai-web-mcp-servers-settings)
- [Usage](#usage)
- [Available Tools](#available-tools)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Data Files](#data-files)
- [Contributing](#contributing)
- [License](#license)

## Features

✨ **Comprehensive Search** - Fuzzy full-text search across all ACSS documentation
📖 **Page Retrieval** - Get complete documentation pages with code examples
🗂️ **Category Browsing** - Explore the full documentation structure
🎨 **Variable Lookup** - Search and filter CSS custom properties with defaults
🚀 **Fast & Local** - Pre-indexed data for instant responses
🔧 **Easy Integration** - Works with Claude Desktop and Claude.ai web

## What is This?

This MCP server exposes four powerful tools for interacting with Automatic CSS documentation:

- **`search_acss_docs`** - Fuzzy full-text search across all ACSS v3.0 documentation pages
- **`get_acss_page`** - Retrieve the complete content of a specific documentation page
- **`list_acss_categories`** - Browse all documentation categories and their structure
- **`get_acss_variables`** - Search and filter ACSS CSS custom properties (variables)

With this server, AI assistants can help you:
- Find the right ACSS classes for your design needs
- Look up CSS variable names and their defaults
- Understand ACSS features and best practices
- Get code examples and implementation guidance

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or another package manager

### Standard Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd acss-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript project:
```bash
npm run build
```

4. Configure your MCP client (e.g., Claude Desktop) to use this server.

### Configuration for Claude Desktop

Add this server to your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "acss-docs": {
      "command": "node",
      "args": ["/absolute/path/to/acss-mcp-server/dist/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/acss-mcp-server` with the actual path where you cloned this repository.

### Configuration for Claude.ai Web (MCP Servers Settings)

If you're using the Claude.ai web interface with MCP support, you can add this server using the following fields:

**Server name:**
```
acss-docs
```

**Command (for local servers):**
```
node /absolute/path/to/acss-mcp-server/dist/index.js
```

Replace `/absolute/path/to/acss-mcp-server` with the actual path where you cloned and built this repository.

**Note:** Leave the "HTTP URL (for remote servers)" field empty when running locally.

## Usage

After installation and configuration, restart your MCP client (Claude Desktop or reload Claude.ai). The server will automatically connect and make the ACSS documentation tools available.

You can then ask Claude questions like:

- "What ACSS classes are available for creating buttons?"
- "Show me the spacing variables in ACSS"
- "How do I use ACSS grid utilities?"
- "What's the default value for the primary button color variable?"

Claude will use the MCP server to search the documentation and provide accurate, detailed answers.

## Available Tools

### search_acss_docs
Full-text fuzzy search across all documentation.

**Parameters:**
- `query` (required) - Search query (e.g., "flexbox grid", "btn variables")
- `category` (optional) - Filter by category slug
- `limit` (optional) - Max results to return (default 10, max 50)
- `offset` (optional) - Skip N results for pagination

### get_acss_page
Get the full content of a specific documentation page.

**Parameters:**
- `slug` (required) - Page slug (e.g., "buttons-links/button-variables")

### list_acss_categories
List all documentation categories.

**Parameters:**
- `include_pages` (optional) - Include page listings per category

### get_acss_variables
Search and browse CSS custom properties.

**Parameters:**
- `category` (optional) - Filter by variable category
- `search` (optional) - Search term to filter variables
- `limit` (optional) - Max results (default 10, max 50)
- `offset` (optional) - Skip N results for pagination

## Development

### Project Structure

```
acss-mcp-server/
├── src/
│   ├── index.ts           # Server entry point
│   ├── server.ts          # MCP server setup and tool registration
│   ├── tools/             # Tool implementations
│   │   ├── search-docs.ts
│   │   ├── get-page.ts
│   │   ├── list-categories.ts
│   │   └── get-variables.ts
│   └── scraper/           # Documentation scraper
├── data/                  # Pre-scraped documentation data
│   ├── pages.json
│   ├── categories.json
│   └── variables.json
├── dist/                  # Compiled JavaScript (generated)
└── package.json
```

### Commands

**Run in development mode (without building):**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Start the server (after building):**
```bash
npm start
```

**Update documentation data:**
```bash
npm run scrape
```

**Run tests:**
```bash
npm test
```

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.7
- **MCP SDK**: @modelcontextprotocol/sdk v1.12+
- **Search**: Fuse.js (fuzzy search)
- **Scraping**: Cheerio (HTML parsing)
- **Validation**: Zod (schema validation)
- **Testing**: Vitest

## Troubleshooting

### Server Not Connecting

**Problem**: Claude can't connect to the MCP server

**Solutions**:
1. Verify the path in your configuration is absolute (not relative)
2. Ensure you've run `npm run build` and the `dist/` folder exists
3. Check that Node.js is in your system PATH
4. Restart Claude Desktop or reload Claude.ai after configuration changes

### Module Not Found Errors

**Problem**: Getting "Cannot find module" errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Server Crashes on Startup

**Problem**: Server exits immediately with errors

**Solutions**:
1. Check Node.js version: `node --version` (must be 18+)
2. Verify data files exist in the `data/` directory
3. Check server logs in Claude Desktop (Help > View Logs)

### Wrong Documentation Version

**Problem**: Documentation seems outdated

**Solution**:
```bash
# Re-scrape the latest documentation
npm run scrape
npm run build
```

## Data Files

The server uses pre-scraped documentation data stored in the `/data` directory:

- **`pages.json`** - All documentation pages with full content, code examples, and metadata
- **`categories.json`** - Category structure, slugs, and organization
- **`variables.json`** - CSS custom properties with defaults and descriptions

To update this data, run `npm run scrape` (requires access to the ACSS documentation source).

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/my-new-feature`
3. **Make your changes** and add tests if applicable
4. **Run tests**: `npm test`
5. **Build to verify**: `npm run build`
6. **Commit your changes**: `git commit -am 'Add some feature'`
7. **Push to the branch**: `git push origin feature/my-new-feature`
8. **Submit a pull request**

### Areas for Contribution

- 🐛 Bug fixes and error handling improvements
- 📚 Additional tool implementations
- 🧪 Test coverage expansion
- 📖 Documentation improvements
- ⚡ Performance optimizations
- 🌐 Support for additional MCP clients

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Built with the [Model Context Protocol SDK](https://modelcontextprotocol.io)
- Documentation content from [Automatic CSS](https://automaticcss.com/)
- Powered by [Claude](https://claude.ai) and Anthropic

## Support

**For MCP Server Issues**: Open an issue on this GitHub repository

**For ACSS Product Support**: Visit [Automatic CSS](https://automaticcss.com/) or contact their support team

**For MCP Protocol Questions**: Check the [MCP Documentation](https://modelcontextprotocol.io/docs)

---

Made with ❤️ for the ACSS community
