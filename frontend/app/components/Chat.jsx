import { useState } from "react";

function Message({ type, children }) {
  return (
    <div className={`message ${type}-message`}>
      <div className="message-content">{children}</div>
    </div>
  );
}

export function ChatMessages({ messages = [] }) {
  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <Message key={message.id} type={message.type}>
          {message.content}
        </Message>
      ))}
    </div>
  );
}

export function ChatInput({ onAddMessage }) {
  const [isSubmitting, setisSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const message = formData.get("message").trim();

    if (!message) {
      return;
    }

    onAddMessage(message);
    event.target.reset();

    setisSubmitting(true);

    setTimeout(() => {
      setisSubmitting(false);
    }, 1000);
  }

  return (
    <div className="chat-input-container">
      <form className="chat-input-wrapper" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          placeholder="Type your message here..."
          rows="1"
          name="message"
        />
        <button
          className="send-button"
          type="submit"
          disabled={isSubmitting ? "disabled" : ""}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
