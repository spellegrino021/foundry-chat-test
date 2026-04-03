import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env for local dev (in prod, Embr injects env vars)
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "8080", 10);

// Required env vars
const FOUNDRY_ENDPOINT = process.env.FOUNDRY_ENDPOINT;
const FOUNDRY_API_KEY = process.env.FOUNDRY_API_KEY;

if (!FOUNDRY_ENDPOINT || !FOUNDRY_API_KEY) {
  console.error("❌ Missing required environment variables:");
  if (!FOUNDRY_ENDPOINT) console.error("  - FOUNDRY_ENDPOINT");
  if (!FOUNDRY_API_KEY) console.error("  - FOUNDRY_API_KEY");
  console.error("\nSet these in your environment or .env file.");
  process.exit(1);
}

// Parse the Foundry endpoint to extract deployment name
// Endpoint format: https://{resource}.openai.azure.com/openai/deployments/{deployment}
const endpointMatch = FOUNDRY_ENDPOINT.match(
  /^(https:\/\/[^/]+)\/openai\/deployments\/([^/]+)/
);

if (!endpointMatch) {
  console.error("❌ Invalid FOUNDRY_ENDPOINT format.");
  console.error(
    "   Expected: https://{resource}.openai.azure.com/openai/deployments/{deployment}"
  );
  process.exit(1);
}

const [, azureBaseUrl, deploymentName] = endpointMatch;

app.use(cors());
app.use(express.json());

// Chat API endpoint - proxies to Azure OpenAI
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  try {
    const azureUrl = `${azureBaseUrl}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`;

    const response = await fetch(azureUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": FOUNDRY_API_KEY,
      },
      body: JSON.stringify({
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Azure API error: ${response.status} ${errorText}`);
      res.status(response.status).json({ error: errorText });
      return;
    }

    // Stream the response back to the client
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = response.body?.getReader();
    if (!reader) {
      res.status(500).json({ error: "No response body" });
      return;
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
    } finally {
      reader.releaseLock();
    }

    res.end();
  } catch (error) {
    console.error("Chat proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve static files from the Vite build
const distPath = join(__dirname, "..", "dist");
app.use(express.static(distPath));

// SPA fallback - serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`   Foundry endpoint: ${azureBaseUrl}/.../${deploymentName}`);
});
