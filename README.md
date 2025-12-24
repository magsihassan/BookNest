# 📚 BookNest

A modern full-stack bookstore application built with React, Express.js, and MySQL. Features an admin dashboard, user authentication, and inventory management.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

## ✨ Features

- **Browse Books** - View available books with images, prices, and stock status
- **Book Details** - Detailed view with description and availability
- **User Authentication** - Register and login with JWT tokens
- **Admin Dashboard** - Full CRUD management for books
- **Inventory Tracking** - Stock quantity management
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (build tool)
- TailwindCSS 4
- React Router DOM
- shadcn/ui components

### Backend
- Express.js 5
- Drizzle ORM
- MySQL database
- JWT authentication
- bcrypt password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/magsihassan/BookNest.git
   cd BookNest
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env if needed
   ```

4. **Initialize Database**
   ```bash
   cd backend
   npx drizzle-kit push
   ```

5. **Run the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
BookNest/
├── backend/
│   ├── src/
│   │   ├── db/           # Database schema
│   │   ├── middleware/   # Auth middleware
│   │   ├── routes/       # API routes
│   │   └── index.js      # Entry point
│   └── drizzle/          # Migrations
│
└── frontend/
    ├── src/
    │   ├── components/   # UI components
    │   ├── context/      # React context
    │   ├── layouts/      # Page layouts
    │   ├── lib/          # Utilities
    │   └── pages/        # Page components
    └── public/           # Static assets
```

## 🔒 Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql://username:password@localhost:3306/books
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```
VITE_BACKEND_URL="http://localhost:3000"
```

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get book by ID |
| POST | `/api/books` | Create book (admin) |
| PUT | `/api/books/:id` | Update book (admin) |
| DELETE | `/api/books/:id` | Delete book (admin) |
| POST | `/api/register` | User registration |
| POST | `/api/login` | User login |
| GET | `/api/me` | Get current user |
| POST | `/api/admin/login` | Admin login |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by [Magsi Hassan](https://github.com/magsihassan)
