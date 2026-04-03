import { useCallback, useRef, useState } from "react";
import { streamChat, type ChatMessage } from "../api/foundryClient";

interface UseChatResult {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChat = (): UseChatResult => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    setError(null);
    abortRef.current = false;

    const userMessage: ChatMessage = { role: "user", content: trimmed };

    // Capture full conversation history including the new user message,
    // then kick off streaming. The Responses API requires the full history
    // on every call since the published agent endpoint doesn't store state.
    setMessages((prev) => {
      const history = [...prev, userMessage];
      void doStream(history);
      return history;
    });

    async function doStream(conversationHistory: ChatMessage[]) {
      setMessages([...conversationHistory, { role: "assistant", content: "" }]);
      setIsStreaming(true);

      try {
        const stream = streamChat(conversationHistory);
        let accumulated = "";

        for await (const token of stream) {
          if (abortRef.current) break;
          accumulated += token;
          const snapshot = accumulated;
          setMessages([
            ...conversationHistory,
            { role: "assistant", content: snapshot },
          ]);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
      } finally {
        setIsStreaming(false);
      }
    }
  }, []);

  const clearMessages = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setError(null);
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, error, sendMessage, clearMessages };
};
