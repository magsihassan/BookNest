// src/routes/auth.js
import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../index.js";
import { users } from "../db/schema.js";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware/auth.js"; //Just Added
import { eq } from "drizzle-orm";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.insert(users).values({ name, email, password: hashed, role: "user" });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});




// ...

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRes = await db.select().from(users).where(eq(users.email, email));
    if (userRes.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userRes[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});



// Just Added
router.get("/me", authenticate, (req, res) => {
  // req.user comes from authenticate() after verifying JWT
  // e.g. { id, role, iat, exp }
  res.json({ id: req.user.id, role: req.user.role });
});



export default router;
