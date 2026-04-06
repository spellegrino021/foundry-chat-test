import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useChat } from '../hooks/useChat';
import styles from './ChatWidget.module.css';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isStreaming, error, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    void sendMessage(trimmed);
    setInput('');
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <>
      {/* Floating action button */}
      {!isOpen && (
        <button
          className={styles.fab}
          onClick={() => setIsOpen(true)}
          aria-label="Chat with our agent"
        >
          <span className={styles.fabIcon}>💬</span>
          <span className={styles.fabLabel}>Chat with an agent</span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.headerInfo}>
              <span className={styles.headerDot} />
              <span className={styles.headerTitle}>Ember Roast Agent</span>
            </div>
            <div className={styles.headerActions}>
              {messages.length > 0 && (
                <button
                  className={styles.clearBtn}
                  onClick={clearMessages}
                  title="Clear conversation"
                >
                  🗑
                </button>
              )}
              <button
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.messageArea}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>☕</span>
                <p>Hi! Ask me about our coffee, brewing tips, or your order.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.message} ${
                  msg.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div className={styles.messageBubble}>
                  {msg.content || '\u00A0'}
                </div>
              </div>
            ))}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={`${styles.messageBubble} ${styles.typing}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
            {error && (
              <div className={styles.errorMsg}>
                ⚠️ {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
            />
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
