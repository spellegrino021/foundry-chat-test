import { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import "../chat.css";

export const Chat = () => {
  const { messages, isStreaming, error, sendMessage, clearMessages } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.74.5 3.37 1.22 4.78L2 22l5.22-1.22C8.63 21.5 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M8 12h.01M12 12h.01M16 12h.01" />
              </svg>
            </div>
            <h2>Start a conversation</h2>
            <p>Send a message to test your Foundry agent integration.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {isStreaming && <TypingIndicator />}

        {error && (
          <div className="chat-error">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        {messages.length > 0 && (
          <button
            className="chat-clear-btn"
            onClick={clearMessages}
            title="Clear conversation"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear
          </button>
        )}
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
};
