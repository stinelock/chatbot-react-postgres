import { supabase } from "./supabase";
import { redirect } from "react-router";

const apiUrl = import.meta.env.VITE_API_URL;

export default async function apiFetch(path, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}${path}`, { ...options, headers });

  if (response.status === 401) {
    const currentPath = window.location.pathname + window.location.search; //Pathname er alt erfter '/' search er query string (altså alt efter ?)
    throw redirect(`/login?redirect=${encodeURIComponent(currentPath)}`);
  }

  return response;
}
