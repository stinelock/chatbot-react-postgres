import {
  useLoaderData,
  useActionData,
  Link,
  useRouteError,
  href,
} from "react-router";
import { ChatMessages, ChatInput } from "../components/Chat.jsx";

export function ErrorBoundary() {
  const error = useRouteError();

  // Check if this is a 404 error (thread not found)
  const isNotFound = error?.status === 404;

  return (
    <div className="chat-container">
      <div className="chat-thread-header">
        <h2>{isNotFound ? "Thread Not Found" : "Something Went Wrong"}</h2>
        <p>
          {isNotFound
            ? "This conversation may have been deleted or never existed."
            : error?.message || "An unexpected error occurred."}
        </p>
        <p>
          <Link to={href("/chat/new")}>Start a new chat</Link>
        </p>
      </div>
    </div>
  );
}

export async function clientLoader({ params }) {
  const api_url = import.meta.env.VITE_API_URL;

  console.log(`Fetching thread and messages for thread ID: ${params.threadId}`);

  const threadUrl = `${api_url}/api/threads/${params.threadId}`;

  const threadResponse = await fetch(threadUrl);

  if (!threadResponse.ok) {
    throw new Error(`Failed to fetch thread: ${threadResponse.status}`);
  }

  const thread = await threadResponse.json();

  console.log(`Fetched thread:`, thread);

  // If thread not found, throw error (will be caught by ErrorBoundary)
  if (!thread) {
    console.error(`Thread with ID ${params.threadId} not found.`);
    throw new Response("Thread not found", { status: 404 });
  }

  const messagesUrl = `${api_url}/api/threads/${params.threadId}/messages`;

  const messagesResponse = await fetch(messagesUrl);

  if (!messagesResponse.ok) {
    throw new Response(`Failed to fetch messages: ${messagesResponse.status}`);
  }

  const messages = await messagesResponse.json();

  return {
    thread,
    messages,
  };
}

export async function clientAction({ params, request }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Extract form data from the request
  const formData = await request.formData();
  const content = formData.get("message");

  // Validate message content
  if (!content || !content.trim()) {
    return { error: "Message cannot be empty" };
  }

  // Create the message object
  const newMessage = {
    thread_id: params.threadId,
    type: "user",
    content: content.trim(),
  };

  // POST to Supabase to create the message
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/messages`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });

    if (!response.ok) {
      return { error: `Failed to create message: ${response.status}` };
    }

    // Return success - loader will automatically revalidate
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export default function ChatThread() {
  // Access the thread and messages data from the loader
  const { thread, messages } = useLoaderData();

  // Access the action result (success or error)
  const actionData = useActionData();

  return (
    <main className="chat-container">
      <div className="chat-thread-header">
        <h2>{thread.title}</h2>
      </div>
      <ChatMessages messages={messages} />
      <ChatInput />
      {actionData?.error && (
        <div className="error-message">{actionData.error}</div>
      )}
    </main>
  );
}
