function Message({type, children}) {
  return (
    <div className={`message ${type}-message`}>
      <div className="message-content">{children}</div>
    </div>
  );
}

export function ChatMessages({messages}) {
  return (
    <div className="chat-messages">
     {messages.map((message)=>(<Message key={message.id} type={message.type}>{message.content}</Message>))}
    </div>
  );
}

export function ChatInput() {
  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          className="chat-input"
          placeholder="Type your message here..."
          rows="1"
        />
        <button className="send-button" type="button">
          Send
        </button>
      </div>
    </div>
  );
}
