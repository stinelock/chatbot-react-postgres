function Message(props) {
  return (
    <div className={`message ${props.type}-message`}>
      <div className="message-content">{props.children}</div>
    </div>
  );
}

export function ChatMessages() {
  return (
    <div className="chat-messages">
      {/* Chat message 1 */}
      <Message type="user">
        Hello! Can you help me understand React Router v7?
      </Message>
      <Message type="bot">
        Of course! React Router v7 is the latest version that introduces several
        improvements including better data loading, enhanced nested routing, and
        improved TypeScript support. What specific aspect would you like to
        learn about?
      </Message>
      {/* Chat message 2 */}
      <Message type="user">How do nested routes work in v7?</Message>
      <Message type="bot">
        Nested routes in React Router v7 allow you to create hierarchical UI
        structures. You define parent routes that contain child routes, and use
        the `&lt;Outlet /&gt;` component to render child components. The parent
        route acts as a layout component that wraps its children.
      </Message>

      {/* Chat message 3 */}
      <Message type="user">
        What's the difference between route() and layout() helpers?
      </Message>
      <Message type="bot">
        Great question! The `route()` helper creates routes that add URL
        segments, while `layout()` creates routes that only provide UI structure
        without affecting the URL. Layout routes are perfect for shared
        components like sidebars or headers that should appear across multiple
        pages.
      </Message>
      {/* Chat message 4 */}
      <Message type="user">
        Can you show me an example of a routes.js configuration?
      </Message>
      <Message type="bot">
        Sure! Here's a basic example: You can use route(), index(), and layout()
        helpers to create nested route structures. The layout() function creates
        wrapper components, while route() adds URL segments. This approach gives
        you clean, hierarchical routing that's easy to maintain."
      </Message>
      {/* Chat message 5 */}
      <Message type="user" text="">
        How do I handle data loading in React Router v7?
      </Message>
      <Message type="bot">
        React Router v7 provides excellent data loading capabilities through
        loader functions. You can define a `loader` function in your route
        component that runs before the component renders, ensuring your data is
        available immediately. You can access the loaded data using the
        `useLoaderData()` hook within your component.
      </Message>
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
