# Contributing to ACSS MCP Server

Thank you for your interest in contributing to the ACSS MCP Server! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and inclusive. We're all here to build something useful for the ACSS community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/acss-mcp-server.git
   cd acss-mcp-server
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/my-feature-name
   ```

## Development Workflow

### Running Locally

```bash
# Run in development mode (auto-reload)
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Testing Your Changes

1. Build the project: `npm run build`
2. Configure your MCP client to use the local build
3. Test the tools by asking Claude to use them
4. Verify the responses are accurate and well-formatted

### Code Style

- Write TypeScript with strict type checking
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Follow the existing code structure and patterns
- Keep functions focused and single-purpose

### Commit Messages

Use clear, descriptive commit messages:

```
Add support for filtering by multiple categories
Fix search pagination offset calculation
Update documentation for get_variables tool
```

## Types of Contributions

### Bug Fixes
- Check existing issues before starting
- Include reproduction steps in your PR
- Add tests that verify the fix

### New Features
- Open an issue to discuss the feature first
- Ensure it aligns with the project goals
- Update documentation and tests

### Documentation
- Fix typos, improve clarity
- Add examples and use cases
- Keep README.md up to date

### Tests
- Increase test coverage
- Add edge case testing
- Ensure tests are reliable

## Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Run tests** and ensure they pass: `npm test`
3. **Build successfully**: `npm run build`
4. **Update CHANGELOG** if applicable
5. **Submit your PR** with a clear description of changes
6. **Respond to review feedback** promptly

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
How did you test these changes?

## Checklist
- [ ] Tests pass locally
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] No breaking changes (or documented if unavoidable)
```

## Project Structure

```
src/
├── index.ts          # Server entry point
├── server.ts         # MCP server setup
├── tools/            # Tool implementations
│   ├── search-docs.ts
│   ├── get-page.ts
│   ├── list-categories.ts
│   └── get-variables.ts
└── scraper/          # Documentation scraper
```

## Adding New Tools

To add a new MCP tool:

1. Create implementation in `src/tools/your-tool.ts`
2. Register it in `src/server.ts` using `server.tool()`
3. Define input schema with Zod
4. Return formatted text results
5. Add documentation to README.md
6. Add tests for the tool

Example:
```typescript
server.tool(
  'tool_name',
  'Description of what this tool does',
  {
    param: z.string().describe('Parameter description'),
  },
  async (input) => ({
    content: [{ type: 'text' as const, text: yourToolFunction(input) }],
  })
)
```

## Questions?

- Open an issue for discussion
- Check existing issues and PRs
- Refer to [MCP documentation](https://modelcontextprotocol.io/docs)

Thank you for contributing! 🎉
