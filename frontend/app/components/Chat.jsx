function Message(props) {
  return (
    <div className={`message ${props.type}-message`}>
      <div className="message-content">{props.children}</div>
    </div>
  );
}

export function ChatMessages(props) {
  return (
    <div className="chat-messages">
     {props.messages.map((message)=>(<Message key={message.id} type={message.type}>{message.content}</Message>))}
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
