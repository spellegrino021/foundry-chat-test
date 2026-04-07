# Foundry Chat Test

A demo coffee-shop storefront ("Embr Roasting Co.") with an embedded AI chat widget powered by an [Azure AI Foundry](https://ai.azure.com/) published agent.

## Architecture

```
Browser (React SPA)
  └─ ChatWidget  ──POST /api/chat──▶  Express server  ──Responses API──▶  Azure AI Foundry Agent
```

- **Frontend** — Vite + React SPA with a hero section, product grid, and a floating chat widget.
- **Backend** — Express server that proxies chat requests to the published Foundry agent via the OpenAI-compatible [Responses API](https://learn.microsoft.com/azure/ai-services/agents/). The API key stays server-side and never reaches the browser.
- **Streaming** — Responses are streamed back as Server-Sent Events (SSE), so tokens appear in real time.
- **Conversation history** — Maintained in the browser (`useChat` hook) and sent with every request. The published agent endpoint is stateless.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   | Variable | Description |
   |---|---|
   | `FOUNDRY_AGENT_ENDPOINT` | Base OpenAI-protocol URL for your published agent. Format: `https://{resource}.services.ai.azure.com/api/projects/{project}/applications/{agent}/protocols/openai` |
   | `FOUNDRY_API_KEY` | API key for your Azure AI Foundry resource |
   | `PORT` | *(optional)* Server port, defaults to `8080` |

3. **Build & run:**
   ```bash
   npm run build   # TypeScript check + Vite production build
   npm start        # Start Express on http://localhost:8080
   ```

## Development

Run the frontend and backend in parallel with hot reload:

```bash
# Terminal 1 — Vite dev server (port 5174)
npm run dev

# Terminal 2 — Express server (watches for changes)
npm run dev:server
```

> In dev mode, configure a Vite proxy or point the browser at the Express server so `/api/chat` requests reach the backend.

## Project Structure

```
├── server/
│   └── index.ts            # Express server — proxies /api/chat to Foundry
├── src/
│   ├── api/
│   │   └── foundryClient.ts  # SSE streaming client (async generator)
│   ├── components/
│   │   ├── ChatWidget.tsx    # Floating chat panel + FAB
│   │   ├── Hero.tsx          # Landing hero section
│   │   ├── ProductGrid.tsx   # Coffee product cards
│   │   ├── Footer.tsx        # Page footer
│   │   └── *.module.css      # Scoped CSS modules
│   ├── hooks/
│   │   └── useChat.ts        # Chat state & streaming orchestration
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
├── index.html                # Vite HTML shell
├── vite.config.ts
└── tsconfig.json
```

## Tech Stack

- [Vite](https://vitejs.dev/) 6 — build tooling
- [React](https://react.dev/) 19 — UI
- [Express](https://expressjs.com/) 5 — API proxy
- TypeScript 5.8
- CSS Modules — component-scoped styling
