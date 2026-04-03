import type { ChatMessage as ChatMessageType } from "../api/foundryClient";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`chat-message ${isUser ? "chat-message--user" : "chat-message--assistant"}`}>
      {!isUser && (
        <div className="chat-message-avatar chat-message-avatar--assistant">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          </svg>
        </div>
      )}
      <div className={`chat-message-bubble ${isUser ? "chat-message-bubble--user" : "chat-message-bubble--assistant"}`}>
        <div className="chat-message-content">
          {message.content || "\u00A0"}
        </div>
      </div>
      {isUser && (
        <div className="chat-message-avatar chat-message-avatar--user">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
};
