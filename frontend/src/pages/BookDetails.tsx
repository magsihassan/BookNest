import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  createdAt: string;
}

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading book details...</div>;
  }

  if (!book) {
    return <div className="text-center py-10 text-lg">Book not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Book Image */}
        <div className="flex justify-center items-center bg-gray-300 p-6">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full max-w-sm object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Book Info */}
        <div className="p-6 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-600 text-lg mb-4">by {book.author}</p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>

          <div className="space-y-2 mb-6">
            <p><span className="font-semibold">Price:</span> ${book.price}</p>
            <p>
              <span className="font-semibold">Available Stock:</span>{" "}
              {book.quantity > 0 ? (
                <span className="text-green-600">{book.quantity} in stock</span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </p>
            <p>
              <span className="font-semibold">Published:</span>{" "}
              {new Date(book.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            disabled={book.quantity === 0}
          >
            {book.quantity > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
