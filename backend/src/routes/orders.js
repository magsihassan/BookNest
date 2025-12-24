import { Router } from "express";
import { db } from "../index.js";
import { orders, orderItems } from "../db/schema.js";
import { authenticate } from "../middleware/auth.js";
import { eq } from "drizzle-orm";

const router = Router();

// POST /api/orders
router.post("/", authenticate, async (req, res) => {
  const { items, totalAmount } = req.body;
  // items = array of { bookId, quantity, price }

  try {
    // 1) Insert into orders table
    const result = await db.insert(orders).values({
      userId: req.user.id,
      totalAmount,
    });

    const orderId = result.insertId;

    // 2) Insert all order items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId,
        bookId: item.bookId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


// GET /api/orders  (with items included)
router.get("/", authenticate, async (req, res) => {
  try {
    // 1) Get all orders for the current user
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, req.user.id));

    // 2) For each order, fetch its items
    const ordersWithItems = [];
    for (const order of userOrders) {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      ordersWithItems.push({ ...order, items });
    }

    res.json(ordersWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});



export default router;
