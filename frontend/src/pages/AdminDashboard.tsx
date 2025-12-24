import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Book = {
  id: number;
  title: string;
  author: string;
  description?: string | null;
  imageUrl?: string | null;
  quantity: number;
  price: number;
};

// Helper: get a clean token (remove quotes and any "Bearer " prefix)
function getAuthToken(): string {
  const raw = localStorage.getItem("adminToken") || "";
  const unquoted = raw.replace(/^"(.*)"$/, "$1"); // remove wrapping quotes if JSON.stringified
  const withoutBearer = unquoted.replace(/^bearer\s+/i, ""); // strip leading "Bearer "
  return withoutBearer.trim();
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    imageUrl: "",
    quantity: "0",
  });

  useEffect(() => {
    const token = getAuthToken();
    const user = localStorage.getItem("adminUser");
    if (!token || !user) {
      navigate("/admin/login");
    } else {
      setAdmin(JSON.parse(user));
      fetchBooks();
    }
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/books`,
        {
          headers: {
            Authorization: token, // backend expects just <token>
          },
        }
      );
      if (!res.ok) throw new Error(`Fetch failed with ${res.status}`);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load books. Check the server logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      price: "",
      imageUrl: "",
      quantity: "0",
    });
    setError(null);
    setShowModal(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title ?? "",
      author: book.author ?? "",
      description: book.description ?? "",
      price: String(book.price ?? ""),
      imageUrl: book.imageUrl ?? "",
      quantity: String(book.quantity ?? "0"),
    });
    setError(null);
    setShowModal(true);
  };

  const handleDeleteBook = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const token = getAuthToken();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token, // just <token>
          },
        }
      );
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Delete failed with ${res.status}`);
      }
      await fetchBooks();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete book");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const token = getAuthToken();
    const method = editingBook ? "PUT" : "POST";
    const url = editingBook
      ? `${import.meta.env.VITE_BACKEND_URL}/api/books/${editingBook.id}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/books`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // just <token>
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          author: formData.author.trim(),
          description: formData.description.trim() || null,
          imageUrl: formData.imageUrl.trim() || null,
          quantity: Number(formData.quantity || 0),
          price: Number(formData.price),
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Save failed with ${res.status}`);
      }
      setShowModal(false);
      await fetchBooks();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-red-400 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <button className="text-left hover:text-gray-200">
            📚 Manage Books
          </button>
          <button className="text-left hover:text-gray-200">
            👥 Manage Users
          </button>
          <button className="text-left hover:text-gray-200">
            ⚙️ Settings
          </button>
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Books Management</h1>
          <button
            onClick={handleAddBook}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ Add Book
          </button>
        </div>

        {loading ? (
          <p>Loading books...</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Author</th>
                <th className="py-2 px-4 text-left">Qty</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b">
                  <td className="py-2 px-4">{book.title}</td>
                  <td className="py-2 px-4">{book.author}</td>
                  <td className="py-2 px-4">{book.quantity}</td>
                  <td className="py-2 px-4">
                    ${Number(book.price).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleEditBook(book)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No books yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[520px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingBook ? "Edit Book" : "Add Book"}
            </h2>

            {error && (
              <div className="mb-3 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author"
                className="border p-2 rounded"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="border p-2 rounded"
                rows={3}
              />
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="Image URL"
                className="border p-2 rounded"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editingBook ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
