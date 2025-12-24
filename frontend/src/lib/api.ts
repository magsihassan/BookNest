const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchBooks() {
  const res = await fetch(`${API_URL}/api/books`);
  return res.json();
}
