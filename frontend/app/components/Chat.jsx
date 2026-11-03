import React from "react";
import { Form } from "react-router";

function Message({ type = "user", children }) {
  return (
    <div className={`message ${type}-message`}>
      <div className="message-content">{children}</div>
    </div>
  );
}


function ChatMessages({ messages = [] }) {
  return (
    <div className="chat-messages">
      {/* Using destructured messages with safe default! */}
      {messages.map((message) => (
        <Message key={message.id} type={message.type}>
          {message.content}
        </Message>
      ))}
    </div>
  );
}


function ChatInput({ theme, onToggleTheme }) {
  return (
    <div className="chat-input-container">
      <Form method="post" className="chat-input-wrapper">
        <input
          name="message"
          className="chat-input"
          placeholder="Type your message here..."
          rows="1"
          required
        />
        <button className="send-button" type="submit">
          Send
        </button>
      </Form>
      <button
        type="button"
        className="theme-toggle-btn"
        aria-label="Toggle theme"
        title="Toggle light/dark theme"
        onClick={onToggleTheme}
      >
        {theme === "light" ? "🌞" : "🌙"}
      </button>
    </div>
  );
}


export { Message, ChatMessages, ChatInput };
