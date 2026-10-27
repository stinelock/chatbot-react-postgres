import { useActionData, redirect } from "react-router";
import { ChatInput, ChatMessages } from "../components/Chat.jsx";

const api_url = import.meta.env.VITE_API_URL;

export async function clientAction({ request }) {

  // Extract form data
  const formData = await request.formData();
  const content = formData.get("message");

  // Validate message content
  if (!content || !content.trim()) {
    return { error: "Message cannot be empty" };
  }

  // Generate thread title from first message (truncate to 50 chars)
  const title =
    content.trim().length > 50
      ? content.trim().slice(0, 50) + "..."
      : content.trim();

  try {
    // Step 1: Create the thread
    const response = await fetch(`${api_url}/api/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: title, content: content.trim()}),
    });

    if (!response.ok) {
      return { error: `Failed to create thread: ${response.status}` };
    }

    // Step 2: Extract the thread ID and from the response
    const data = await response.json();
    const threadId = data.thread.id;

    // Step 3: Redirect to the new thread
    return redirect(`/chat/${threadId}`);
  } catch (error) {
    return { error: error.message };
  }
}

export default function ChatNew() {
  // Access action result for error display
  const actionData = useActionData();

  return (
    <main className="chat-container">
      <div className="chat-thread-header">
        <h2>Start a new conversation</h2>
        <p>Type a message below to begin chatting</p>
      </div>
      <ChatMessages />
      <ChatInput />
      {actionData?.error && (
        <div className="error-message">{actionData.error}</div>
      )}
    </main>
  );
}
