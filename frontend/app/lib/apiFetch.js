export default async function apiFetch(path, options = {}) {
    const apiUrl = import.meta.env.VITE_API_URL;

    const fullUrl = `${apiUrl}${path}`
}