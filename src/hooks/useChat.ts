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
        // Server now handles the Azure API key injection
        const stream = streamChat(conversationHistory);

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
