import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-gradient-to-r from-slate-300 to-slate-500 w-screen">
      {/* Left: Brand / Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        BookStore
      </Link>

      {/* Right: Nav Links */}
      <div className="flex items-center gap-4">
        <Link to="/books" className="text-gray-700 hover:text-blue-600">
          Books
        </Link>
        <Link to="/orders" className="text-gray-700 hover:text-blue-600">
          Orders
        </Link>
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </nav>
  );
}
