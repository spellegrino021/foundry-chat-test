import { Chat } from "./components/Chat";
import "./App.css";

export const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <svg
            className="app-logo"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h1>Foundry Chat</h1>
          <span className="app-badge">Test</span>
        </div>
      </header>
      <main className="app-main">
        <Chat />
      </main>
    </div>
  );
};
