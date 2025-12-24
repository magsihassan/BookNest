// src/routes/books.js
import { Router } from "express";
import { db } from "../index.js";
import { books } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// GET /api/books
router.get("/", async (req, res) => {
  try {
    const allBooks = await db.select().from(books);
    res.json(allBooks);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET /api/books/:id
router.get("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id);
  try {
    const result = await db.select().from(books).where(eq(books.id, bookId));
    if (result.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});




//middleware Protected Route
router.post("/", authenticate, async (req, res) => {
  // req.user is available here → { id, role }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { title, author, description, imageUrl, quantity, price } = req.body;

  try {
    await db.insert(books).values({ title, author, description, imageUrl, quantity, price });
    res.status(201).json({ message: "Book inserted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});




// New for Admin Dashboard

// Update a book by ID
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, image, price } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, description, image, price },
      { new: true } // return the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(updatedBook);
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ error: "Failed to update book" });
  }
});


// Delete a book by ID
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ error: "Failed to delete book" });
  }
});




export default router;
