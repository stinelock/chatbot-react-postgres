import { Outlet, useLoaderData, redirect } from "react-router";
import Sidebar from "../components/Sidebar.jsx";
import { useState } from "react";

const api_url = import.meta.env.VITE_API_URL;


export async function clientLoader() {
  const url = `${api_url}/api/threads`;
  const response = await fetch(url);

  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`Failed to fetch threads: ${response.status}`);
  }

  // Parse the JSON response
  const threads = await response.json();

  return { threads };
}


export async function clientAction({ request }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Extract form data
  const formData = await request.formData();
  const intent = formData.get("intent");
  const threadId = formData.get("threadId");

  // Handle delete intent
  if (intent === "delete" && threadId) {
    try {
      // DELETE request to Supabase
      // Messages are automatically deleted due to CASCADE
      const response = await fetch(
        `${supabaseUrl}/rest/v1/threads?id=eq.${threadId}`,
        {
          method: "DELETE",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        },
      );

      if (!response.ok) {
        return { error: `Failed to delete thread: ${response.status}` };
      }

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  return null;
}

export default function Layout() {
  // Access threads data from the loader
  const { threads } = useLoaderData();

  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar threads={threads} theme={theme} onToggleTheme={toggleTheme} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
