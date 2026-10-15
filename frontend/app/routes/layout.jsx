import { Outlet, useLoaderData } from "react-router";
import Sidebar from "../components/Sidebar";

export async function clientLoader() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const url =
    `${supabaseUrl}/rest/v1/threads` + "?select=*&order=created_at.desc";

  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const res = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!res.ok) {
    throw new Error("Kunne ikke hente data");
  }

  const threadsData = await res.json();

  return threadsData;
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
