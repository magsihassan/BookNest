import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {Link} from "react-router-dom";

interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  price: number;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books`);
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container mx-auto p-6 ">
      <h1 className="text-3xl font-bold mb-6">Available Books</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-2xl shadow">
              <Skeleton className="h-64 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id}>
              <Card
                key={book.id}
                className="bg-gradient-to-r from-amber-100 to-amber-300 overflow-hidden rounded-2xl shadow transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                {/* Image takes full width */}
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-110 object-cover"
                />
                <CardContent className="p-4 pb-0">
                  <h3 className="font-semibold text-lg">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-base font-bold">${book.price}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
