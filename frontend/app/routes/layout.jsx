import { Outlet, useLoaderData } from "react-router";
import Sidebar from "../components/Sidebar";

export async function clientLoader(){
    await new Promise((resolve) => setTimeout(resolve, 300));

return [
  {
    id: "1",
    title: "How to learn programming?",
  },
  {
    id: "2",
    title: "What are the best pizza toppings?",
  },
  {
    id: "3",
    title: "Can you explain quantum physics?",
  },
  {
    id: "4",
    title: "Help me create a morning routine",
  },
  {
    id: "5",
    title: "What should I do this weekend?",
  },
  {
    id: "6",
    title: "Why is the sky blue?",
  },
  {
    id: "7",
    title: "How do I learn a new language?",
  },
  {
    id: "8",
    title: "What's the meaning of life?",
  },
  {
    id: "9",
    title: "Tell me a funny joke",
  },
  {
    id: "10",
    title: "What's a healthy dinner idea?",
  },
  {
    id: "11",
    title: "Recommend me a good book",
  },
  {
    id: "12",
    title: "Give me a creative writing prompt",
  },
  {
    id: "13",
    title: "My computer is slow, help?",
  },
  {
    id: "14",
    title: "Tell me an interesting history fact",
  },
  {
    id: "15",
    title: "Tell me an interesting history fact",
  },
  {
    id: "16",
    title: "Tell me an interesting history fact",
  },
];
}

export default function Layout() {
  const threads = useLoaderData();

  function deleteThread(id) {
    const updatedThreads = threads.filter((thread) => thread.id !== id);
    setThreads(updatedThreads);
  }

  return (
    <div className="app-layout">
      <Sidebar threads={threads} deleteThread={deleteThread} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
