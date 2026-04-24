# 🛒 e-cart — Full Stack MERN E-Commerce App

A production-ready, fully responsive full-stack e-commerce application built using the **MERN** stack (MongoDB, Express, React, Node.js). 

Features complete multi-page navigation, cart management, wishlist storage, order history tracking, advanced authentication (JWT + Google OAuth), and seamless Cloudinary integration for image uploads.

---

## 🛠️ Technologies Used

### Frontend (Client)
* **React + Vite**: For blazing-fast UI rendering and modern development experience.
* **Context API**: For lightweight, robust global state management (handling carts, wishlists, and user sessions).
* **Vanilla CSS**: For custom, high-performance styling using CSS variables and modern grid/flexbox layouts.

### Backend (Server)
* **Node.js + Express**: Serves as the robust RESTful API backend handling all business logic.
* **MongoDB + Mongoose**: A NoSQL database for secure, scalable data storage of Users, Orders, and Wishlists.
* **JSON Web Tokens (JWT)**: Used for stateless, cryptographically secure user authentication across API requests.
* **Passport.js + Google OAuth 2.0**: Enables seamless "Login with Google" capabilities, automatically registering users and generating native JWTs.
* **Cloudinary + Multer**: Provides a robust, cloud-based image hosting infrastructure. Images uploaded to the `/api/upload` endpoint are piped directly into the Cloudinary CDN.

---

## 📁 Current Project Structure

```text
ecart/
├── frontend/                     # React User Interface
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── context/AppContext.jsx # Global State (Cart, Auth, Fetches)
│       ├── data/products.js       # Local product catalog catalog
│       ├── pages/                 # Home, Cart, Login, Orders, OAuthSuccess, etc.
│       └── components/            # Reusable UI (Navbar, ProductCard, Footer)
│
└── backend/                      # Node.js + Express API
    ├── server.js                 # API Entry Point (Port 3000)
    ├── package.json
    ├── .env                      # Environment Variables (Keys, Secrets)
    └── src/
        ├── app.js                # Express App Setup (CORS, Middlewares)
        ├── config/               # DB connection, Cloudinary, Passport strategies
        ├── models/               # Mongoose Schemas (User, Order, Wishlist)
        ├── routes/               # API endpoints (/auth, /orders, /upload, etc.)
        ├── controllers/          # Core business logic for routes
        └── middlewares/          # JWT Verification & Protection
```

---

## 🚀 How to Run the Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed on your machine.

### 1. Clone & Install
Open your terminal and install dependencies for both the frontend and backend.
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file inside the `backend` folder and add your configuration secrets:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/ecart

# Security
JWT_SECRET=your_super_secret_jwt_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Image Hosting
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start the Application
You will need two separate terminal windows running simultaneously.

**Terminal 1: Start the Backend Server**
```bash
cd backend
npm run dev
```
*(Server runs on http://localhost:3000)*

**Terminal 2: Start the Frontend React App**
```bash
cd frontend
npm run dev
```
*(App runs on http://localhost:5173)*

Open your browser to `http://localhost:5173` to start shopping!

---

## ✅ Features Overview

* **Authentication API (`/api/auth`)**: Supports native email/password signup and seamless Google OAuth redirects.
* **Orders API (`/api/orders`)**: Validates carts and securely saves chronological order history using MongoDB Object IDs.
* **Wishlist API (`/api/wishlist`)**: Dynamic smart-endpoints that toggle products into a user's permanent MongoDB favorites array.
* **Upload API (`/api/upload`)**: Secure `multipart/form-data` endpoint utilizing Multer to stream binary image data directly into Cloudinary.

---