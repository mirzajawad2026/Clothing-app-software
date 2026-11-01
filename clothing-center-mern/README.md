# Clothing Center POS (MERN)

## Architecture
```
server/  (Node + Express + MongoDB/Mongoose, JWT auth)
  src/config/db.js            MongoDB connection
  src/models/                 User, Product, Sale, simple.js (Category, Customer, Supplier, Expense, Return, Setting, Counter)
  src/controllers/            auth, crud (generic), product, sale (atomic stock + invoice no.), misc (settings, returns, reports)
  src/routes/index.js         all /api routes (JWT protected, except login)
  src/middleware/             auth (admin-only JWT), error (async wrapper + error handler)
client/  (React + Vite)
  src/pages/                  Login, Summary (Dashboard/Reports), POS, Products (Inventory/Sell), AddClothes, Sales (History/Print Bill), Settings
  src/components/             Crud (generic list+form), Bill (printable receipt)
```

## Run
1. Install MongoDB (or use MongoDB Atlas) and copy `server/.env.example` to `server/.env`; set MONGO_URI and JWT_SECRET.
2. Server: `cd server && npm install && npm run dev`   (creates the admin user on first start)
3. Client: `cd client && npm install && npm run dev`   then open http://localhost:5173
4. Login: admin@admin.com / admin@123  (change ADMIN_PASSWORD in .env before real use)

## Production
`cd client && npm run build`, then serve `client/dist` with nginx or Express, proxying /api to the server.
