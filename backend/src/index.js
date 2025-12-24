import "dotenv/config";
import express from "express";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import cors from "cors";


// routes
import booksRoutes from "./routes/books.js";
import authRoutes from "./routes/auth.js";
import ordersRoutes from "./routes/orders.js";
import { orders } from "./db/schema.js";
import adminRoutes from "./routes/admin.js";

export const db = drizzle(await mysql.createConnection(process.env.DATABASE_URL));

const app = express();
app.use(express.json(), cors({ origin: "http://localhost:5173" }));



// Use routes
app.use("/api/books", booksRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api", authRoutes);
app.use("/api", adminRoutes);

app.get("/", (_req, res) => {
  res.send("API is working");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
