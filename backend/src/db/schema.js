import {
  mysqlTable,
  int,
  varchar,
  decimal,
  text,
  datetime
} from "drizzle-orm/mysql-core";


export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  createdAt: datetime("created_at", { mode: "date", default: "now()" }),
  updatedAt: datetime("updated_at", { mode: "date", default: "now()", onUpdate: "now()" })
});


export const books = mysqlTable("books", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  quantity: int("quantity").notNull().default(0),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: datetime("created_at", { mode: "date", default: "now()" }),
  updatedAt: datetime("updated_at", { mode: "date", default: "now()", onUpdate: "now()" })
});


export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: datetime("created_at", { mode: "date", default: "now()" }),
  updatedAt: datetime("updated_at", { mode: "date", default: "now()", onUpdate: "now()" })
});


export const orderItems = mysqlTable("order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  bookId: int("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "restrict" }),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: datetime("created_at", { mode: "date", default: "now()" }),
  updatedAt: datetime("updated_at", { mode: "date", default: "now()", onUpdate: "now()" })
});


