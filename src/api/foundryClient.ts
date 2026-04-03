export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Streams chat completions from the Foundry chat proxy via SSE.
 *
 * Yields individual content tokens as they arrive. The caller is responsible
 * for accumulating them into a full assistant message.
 */
export async function* streamChat(
  apiUrl: string,
  projectId: string,
  messages: ChatMessage[]
): AsyncGenerator<string, void, unknown> {
  const url = `${apiUrl}/projects/${projectId}/foundry/chat`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Chat request failed (${response.status}): ${errorText}`
    );
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
      // Keep the last (potentially incomplete) line in the buffer
      buffer = lines.pop() || "";

      let currentEvent = "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
          continue;
        }

        if (line.startsWith("data: ")) {
          const raw = line.slice(6);

          // Handle terminal events
          if (currentEvent === "done" || raw === "[DONE]") {
            return;
          }

          if (currentEvent === "error") {
            throw new Error(`Stream error: ${raw}`);
          }

          try {
            const data = JSON.parse(raw) as { content?: string };
            if (data.content) {
              yield data.content;
            }
          } catch {
            // Non-JSON data line — could be a plain-text token
            if (raw.trim()) {
              yield raw;
            }
          }

          currentEvent = "";
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
