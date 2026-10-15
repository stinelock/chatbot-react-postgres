import { ChatMessages, ChatInput } from "../components/Chat";
import ChatThread from "../components/ChatThread";
import { useLoaderData } from "react-router";

export async function clientLoader({ params }) {
    const threadId = params.threadId;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const messagesUrl =
    `${supabaseUrl}/rest/v1/messages` +
    `?thread_id=eq.${threadId}&order=created_at.asc`;

  const threadUrl = `${supabaseUrl}/rest/v1/threads?id=eq.${threadId}`;

  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const messagesRes = await fetch(messagesUrl, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  const threadRes = await fetch(threadUrl, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!threadRes.ok) {
    throw new Response("Kunne ikke hente tråden", { status: threadRes.status });
  }

  if (!messagesRes.ok) {
    throw new Response("Kunne ikke hente beskeder", { status: messagesRes.status });
  }

  const messagesData = await messagesRes.json();
  const threadData = await threadRes.json();
  const thread = threadData[0];

  return { thread, messages: messagesData };
}

export default function chatThread() {
  const { thread, messages } = useLoaderData();

  return (
    <section className="chat-container">
      <ChatThread thread={thread}/>
      <ChatMessages messages={messages} />
      <ChatInput />
    </section>
  );
}
