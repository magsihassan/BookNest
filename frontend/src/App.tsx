import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/home";
import BookDetails from "@/pages/BookDetails";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard"; 

function App() {
  return (
    <div className="flex w-screen h-screen bg-gradient-to-r from-slate-300 to-slate-500">
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="book/:id" element={<BookDetails />} />
            {/* add more pages later */}
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
