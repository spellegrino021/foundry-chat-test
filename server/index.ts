import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
// Load .env for local dev (in prod, env vars are injected at container startup)
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "8080", 10);

// Base OpenAI-compatible endpoint for the published Foundry agent application.
// Format: https://{resource}.services.ai.azure.com/api/projects/{project}/applications/{agent}/protocols/openai
const AGENT_ENDPOINT = process.env.FOUNDRY_AGENT_ENDPOINT;
const API_KEY = process.env.FOUNDRY_API_KEY;

if (!AGENT_ENDPOINT || !API_KEY) {
  console.error("❌ Missing required environment variables:");
  if (!AGENT_ENDPOINT) console.error("  - FOUNDRY_AGENT_ENDPOINT");
  if (!API_KEY) console.error("  - FOUNDRY_API_KEY");
  process.exit(1);
}

// Strip any accidentally-included suffix so the env var can be the full published URL
// or just the base path — both work.
const baseEndpoint = AGENT_ENDPOINT.replace(/\/responses(\?.*)?$/, "");
const RESPONSES_URL = `${baseEndpoint}/responses?api-version=2025-11-15-preview`;

app.use(cors());
app.use(express.json());

// Chat endpoint — proxies to the published Foundry agent using the Responses API
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body as {
    messages: Array<{ role: string; content: string }>;
  };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  try {
    const agentResponse = await fetch(RESPONSES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify({ input: messages, stream: true }),
    });

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error(`Foundry API error: ${agentResponse.status} ${errorText}`);
      res.status(agentResponse.status).json({ error: errorText });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = agentResponse.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
            continue;
          }

          if (line.startsWith("data: ")) {
            const raw = line.slice(6).trim();

            if (raw === "[DONE]") {
              res.write("data: [DONE]\n\n");
              res.end();
              return;
            }

            // Extract text tokens from Responses API delta events
            if (currentEvent === "response.output_text.delta") {
              try {
                const delta = JSON.parse(raw) as { delta?: string };
                if (delta.delta) {
                  res.write(
                    `data: ${JSON.stringify({ content: delta.delta })}\n\n`
                  );
                }
              } catch {
                // skip malformed delta
              }
            }

            currentEvent = "";
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Agent proxy error:", message);
    if (!res.headersSent) {
      res.status(500).json({ error: `Failed to forward request: ${message}` });
    } else {
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`
      );
      res.end();
    }
  }
});

// Serve static files from the Vite build
const distPath = join(__dirname, "..", "dist");
app.use(express.static(distPath));

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`   Responses URL: ${RESPONSES_URL}`);
});
