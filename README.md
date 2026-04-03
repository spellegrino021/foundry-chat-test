# Foundry Chat Test

A standalone Vite + React + TypeScript app for testing Foundry agent integration via the Embr chat proxy.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual values:
   - `VITE_API_URL` — Base URL for the Embr API (e.g. `https://your-embr-instance.com/api`)
   - `VITE_PROJECT_ID` — The project ID to use for Foundry chat

3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The app runs at [http://localhost:5174](http://localhost:5174).

## API Integration

The app connects to the Embr Foundry chat proxy:

- **Endpoint:** `POST {VITE_API_URL}/projects/{VITE_PROJECT_ID}/foundry/chat`
- **Request body:**
  ```json
  {
    "messages": [
      { "role": "user", "content": "Hello!" }
    ]
  }
  ```
- **Response:** SSE stream with events:
  - `event: token` / `data: {"content": "..."}` — individual tokens
  - `event: done` — stream complete
  - `event: error` — error occurred

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Tech Stack

- [Vite](https://vitejs.dev/) 6
- [React](https://react.dev/) 19
- TypeScript 5.8
- Custom CSS (Copilot-like dark theme)
