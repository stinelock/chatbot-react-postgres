export function Message({ type, text }) {
  return (
    <div className={type}>
      <div className="message-content">{text}</div>
    </div>
  );
}

export function ChatMessages() {
  return (
    <div className="chat-messages">
      {/* Chat message 1 */}
      <Message
        type="message user-message"
        text="Hello! Can you help me understand React Router v7?"
      />
      <Message
        type="message bot-message"
        text="Of course! React Router v7 is the latest version that introduces several improvements including better data loading, enhanced nested routing, and improved TypeScript support. What specific aspect would you like to learn about?"
      />

      {/* Chat message 2 */}
      <Message
        type="message user-message"
        text="How do nested routes work in v7?"
      />
      <Message
        type="message bot-message"
        text="Nested routes in React Router v7 allow you to create hierarchical UI structures. You define parent routes that contain child routes, and use the `&lt;Outlet /&gt;` component to render child components. The parent route acts as a layout component that wraps its children."
      />

      {/* Chat message 3 */}
      <Message
        type="message user-message"
        text="What's the difference between route() and layout() helpers?"
      />
      <Message
        type="message bot-message"
        text="Great question! The `route()` helper creates routes that add URL segments, while `layout()` creates routes that only provide UI structure without affecting the URL. Layout routes are perfect for shared components like sidebars or headers that should appear across multiple pages."
      />

      {/* Chat message 4 */}
      <Message
        type="message user-message"
        text="Can you show me an example of a routes.js configuration?"
      />
      <Message
        type="message bot-message"
        text="Sure! Here's a basic example: You can use route(), index(), and layout() helpers to create nested route structures. The layout() function creates wrapper components, while route() adds URL segments. This approach gives you clean, hierarchical routing that's easy to maintain."
      />

      {/* Chat message 5 */}
      <Message
        type="message user-message"
        text="How do I handle data loading in React Router v7?"
      />
      <Message
        type="message bot-message"
        text="React Router v7 provides excellent data loading capabilities through loader functions. You can define a `loader` function in your route component that runs before the component renders, ensuring your data is available immediately. You can access the loaded data using the `useLoaderData()` hook within your component."
      />
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
