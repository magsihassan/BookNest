import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../index.js"; // adjust path if needed
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// POST /api/admin/login
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // find user
    const result = await db.select().from(users).where(eq(users.email, email));
    const user = result[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.VITE_JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("🔥 Admin login error:", err); // <- log full error
    res.status(500).json({ error: "Something went wrong. Try again!" });
  }
});

export default router;
