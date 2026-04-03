import { useCallback, useRef, useState } from "react";
import { streamChat, type ChatMessage } from "../api/foundryClient";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID ?? "";

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

    if (!API_URL || !PROJECT_ID) {
      setError(
        "Missing configuration. Set VITE_API_URL and VITE_PROJECT_ID in your .env file."
      );
      return;
    }

    setError(null);
    abortRef.current = false;

    const userMessage: ChatMessage = { role: "user", content: trimmed };

    // Capture current messages + user message for the API call
    setMessages((prev) => {
      const updated = [...prev, userMessage];
      // Kick off streaming with the full conversation history
      void doStream(updated);
      return updated;
    });

    async function doStream(conversationHistory: ChatMessage[]) {
      // Add an empty assistant placeholder
      const assistantMessage: ChatMessage = { role: "assistant", content: "" };
      setMessages([...conversationHistory, assistantMessage]);
      setIsStreaming(true);

      try {
        const stream = streamChat(API_URL, PROJECT_ID, conversationHistory);

        for await (const token of stream) {
          if (abortRef.current) break;

          assistantMessage.content += token;
          // Update with the accumulated content
          setMessages([...conversationHistory, { ...assistantMessage }]);
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
