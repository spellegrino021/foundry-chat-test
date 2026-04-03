export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Streams chat tokens from the Express server, which proxies the full
 * conversation history to the published Azure AI Foundry agent via the
 * Responses API. Yields individual content tokens as they arrive.
 */
export async function* streamChat(
  messages: ChatMessage[]
): AsyncGenerator<string, void, unknown> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Chat request failed (${response.status}): ${errorText}`);
  }

  if (!response.body) {
    throw new Error("Response body is null — SSE streaming is not supported.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const raw = line.slice(6).trim();
        if (raw === "[DONE]") return;

        try {
          const data = JSON.parse(raw) as { content?: string; error?: string };
          if (data.error) throw new Error(`Stream error: ${data.error}`);
          if (data.content) yield data.content;
        } catch (err) {
          // Rethrow application-level errors; skip unparseable lines
          if (err instanceof Error && err.message.startsWith("Stream error:")) {
            throw err;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
