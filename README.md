# Foundry Chat Test

A standalone Vite + React + TypeScript app for testing Azure AI Foundry agent chat integration.

## Architecture

This is a **hybrid app** with:
- **Frontend**: Vite + React SPA
- **Backend**: Express server that securely proxies to Azure AI

The server injects your API key server-side, so secrets never reach the browser. Conversation history is maintained in an Azure AI Foundry thread — the agent remembers previous messages automatically.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Azure AI Foundry values:
   - `FOUNDRY_PROJECT_ENDPOINT` — Your project endpoint  
     Example: `https://my-resource.services.ai.azure.com/api/projects/my-project`
   - `FOUNDRY_AGENT_ID` — Your agent ID from Foundry Portal → Agents  
     Example: `asst_xxxxxxxxxxxxxxxxxxxx`
   - `FOUNDRY_API_KEY` — Your Azure AI API key

3. **Build the frontend:**
   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The app runs at [http://localhost:8080](http://localhost:8080).

## Development

For local development with hot reload:

```bash
# Terminal 1: Vite dev server (frontend)
npm run dev

# Terminal 2: Express server (backend)
npm run dev:server
```

> **Note:** In dev mode, you'll need to configure Vite to proxy `/api` requests to the Express server.

## Deploying to Embr

1. Push your code to GitHub
2. Create a project in Embr Portal
3. Go to **Variables** tab and add:
   - `FOUNDRY_PROJECT_ENDPOINT` (Secret, Runtime)
   - `FOUNDRY_AGENT_ID` (Secret, Runtime)
   - `FOUNDRY_API_KEY` (Secret, Runtime)
4. Deploy — Embr injects the env vars at container startup

## Tech Stack

- [Vite](https://vitejs.dev/) 6
- [React](https://react.dev/) 19
- [Express](https://expressjs.com/) 5
- TypeScript 5.8
- Custom CSS (Copilot-like dark theme)
