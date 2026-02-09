# Quick Start Guide

Get the ACSS MCP Server running in 5 minutes!

## Prerequisites Check

```bash
# Verify Node.js version (need 18+)
node --version

# Verify npm is installed
npm --version
```

## Installation (3 steps)

### 1. Clone and Install

```bash
git clone <repository-url>
cd acss-mcp-server
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Configure Claude

#### For Claude Desktop:

**MacOS**: Edit `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: Edit `%APPDATA%\Claude\claude_desktop_config.json`

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

**Important**: Replace `/absolute/path/to/acss-mcp-server` with your actual path!

#### For Claude.ai Web:

1. Go to Settings > MCP Servers
2. Click "+ ADD SERVER"
3. Fill in:
   - **Server name**: `acss-docs`
   - **Command**: `node /absolute/path/to/acss-mcp-server/dist/index.js`
4. Click "Add Server"

### 4. Restart Claude

- **Claude Desktop**: Quit and relaunch the app
- **Claude.ai**: Reload the page

## Verify It Works

Ask Claude:

> "What ACSS classes are available for buttons?"

If Claude responds with ACSS button classes, you're all set! 🎉

## Troubleshooting

### "Server not found" error

- Check that you used an **absolute path**, not relative
- Verify `dist/index.js` exists (run `npm run build` again)
- Make sure Node.js is in your system PATH

### "Cannot find module" error

```bash
rm -rf node_modules
npm install
npm run build
```

### Still having issues?

Check the full troubleshooting guide in [README.md](README.md#troubleshooting)

## What's Next?

Try these example queries:

- "Show me all ACSS spacing utilities"
- "What's the variable for the primary button color?"
- "Search the ACSS docs for grid layouts"
- "List all ACSS documentation categories"

Happy building! 🚀
