import { ChatMessages, ChatInput } from "../components/Chat";
import ChatThread from "../components/ChatThread";
import { initialMessages } from "./home";
import { useLoaderData } from "react-router";

export async function clientLoader({ params }) {
  const threadId = params.threadId;

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    threadId,
    messages: [
      {
        id: "1",
        type: "user",
        content: " Hello! Can you help me understand React Router v7?",
      },
      {
        id: "2",
        type: "bot",
        content:
          "Of course! React Router v7 is the latest version that introduces several improvements including better data loading, enhanced nested routing, and improved TypeScript support. What specific aspect would you like to learn about?",
      },
      {
        id: "3",
        type: "user",
        content: "How do nested routes work in v7?",
      },
      {
        id: "4",
        type: "bot",
        content:
          "Nested routes in React Router v7 allow you to create hierarchical UI structures. You define parent routes that contain child routes, and use the `&lt;Outlet /&gt;` component to render child components. The parent route acts as a layout component that wraps its children.",
      },
    ],
  };
}

export default function chatThread() {
const { threadId, messages } = useLoaderData();

console.log("Thread ID:", threadId, "Messages:", messages);

  return (
    <section className="chat-container">
      <ChatThread />
      <ChatMessages messages={messages} />
      <ChatInput />
    </section>
  );
}
