import { supabase } from "./supabase";

const apiUrl = import.meta.env.VITE_API_URL;

export default async function apiFetch(path, options = {}) {
  const fullUrl = `${apiUrl}${path}`;

  fetch(`${apiUrl}${path}`, options);

 
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    const headers = {
      ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

   return fetch(`${apiUrl}${path}`, {...options, headers});
}
