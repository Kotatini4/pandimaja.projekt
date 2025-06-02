![TalTech Logo](images/tal-tech.png)

# TALLINNA TEHNIKAÜLIKOOL

### INSENERITEADUSKOND

**Virumaa kolledž**  
**RAM0541 Veebiprogrammeerimine** _(N. Ivleva)_

# Pawnshop Management System

A full-stack web application for managing pawnshop operations, including contracts, clients, products, and employees.

## 📌 Features

### 🔐 Authentication & Authorization

-   JWT-based login system
-   Role-based access:
    -   **Admin**: full access to all modules
    -   **Employee**: access to contracts and products
    -   **Client**: can view public product listings and contact page only

### 👤 Client Management

-   Create, edit, delete client profiles
-   Validate personal ID code (11 digits)
-   Blacklist system for restricted clients

### 📦 Product Management

-   Add and manage items with images and descriptions
-   Track item status: available, pawned, sold, bought back
-   Sorting and filtering by name, description, category

### 📄 Contract Management

-   Create and print pawn contracts
-   Connect clients, products, and employees
-   Auto-generate printable PDF

### 👥 User Management

-   Admin-only control over employee accounts and roles
-   ID 1 (superadmin) is protected from edit/delete

---

## 🧪 Technologies Used

### Frontend:

-   React + Vite
-   Material UI
-   React Router
-   Axios

### Backend:

-   Node.js + Express
-   PostgreSQL (via Sequelize ORM)
-   JWT + Bcrypt for auth
-   Multer for file uploads

---

## ⚙️ Project Structure

```bash

├── client/ # React frontend
├── server/ # Express backend
│ ├── controllers/
│ ├── models/
│ └── index.js
└── README.md

Backend Setup
cd server
npm install
node index.js
swagger - http://localhost:3000/api-docs/

Frontend Setup
cd client
npm install
npm run dev
Runs frontend on http://localhost:5173

Future Improvements
Admin dashboard & reporting

Multi-language support (Estonian / Russian)

Activity history (per client/product)

Email/SMS reminders

Dynamic permissions system
```
