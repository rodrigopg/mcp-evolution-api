# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Development (run without building)
npm run dev

# Build TypeScript to dist/
npm run build

# Run built server
npm start

# Docker
npm run docker:build
npm run docker:run
```

No test suite is currently configured (`npm test` exits with error).

## Architecture

This is a **TypeScript MCP (Model Context Protocol) server** that bridges LLMs to the **Evolution API v2** (WhatsApp gateway). The server exposes Evolution API capabilities as MCP tools and resources.

### Source layout (`src/`)

| File | Role |
|------|------|
| `index.ts` | MCP server definition — registers all tools and resources, exports `startServer()` (STDIO) and `startWebSocketServer()` (SSE) |
| `cli.ts` | Entry point when run via `npx`/`bin`; reads env vars and calls the exports from `index.ts` |
| `config.ts` | Single config object built from env vars (`EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_API_INSTANCE`) |
| `types.ts` | TypeScript interfaces for all Evolution API request/response shapes |
| `services/evolutionApiService.ts` | `EvolutionApiService` class — wraps every Evolution API HTTP endpoint using axios |

### Transport modes

- **STDIO** (default): used for local tools like Claude Desktop; always started
- **SSE** (Server-Sent Events): enabled via `ENABLE_WEBSOCKET=true`; listens on `GET /sse` and `POST /message?sessionId=...`

The naming is historical — despite the env var `ENABLE_WEBSOCKET`, the remote transport actually uses SSE (`SSEServerTransport`), not WebSocket frames.

### MCP surface

Tools registered in `index.ts` map 1-to-1 to `EvolutionApiService` methods. Zod schemas in `index.ts` define and validate tool inputs. Resources (`contacts://list`, `chats://list`, `groups://list`, `profile://info`, `privacy://settings`) are read-only and fetch live data from the API.

### Key patterns

- All imports use `.js` extensions (required by `"module": "NodeNext"`)
- `config.ts` is the single source of truth for env vars; don't read `process.env` elsewhere
- `EvolutionApiService` is instantiated once at module load in `index.ts`
- Tool handlers always return `{ content: [{ type: "text", text: "..." }] }` — errors are caught and surfaced as text responses rather than thrown

## Environment setup

Copy `.env.example` to `.env` (note: the example file has an unresolved git merge conflict that should be cleaned up):

```bash
EVOLUTION_API_URL=https://your-evolution-api-server.com
EVOLUTION_API_KEY=your-api-key
EVOLUTION_API_INSTANCE=your-instance-name
ENABLE_WEBSOCKET=false   # set true to also start SSE server
PORT=3000
```
