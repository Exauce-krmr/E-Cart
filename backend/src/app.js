const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const reviewRoutes = require('./routes/review.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();

// Middlewares
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json()); // Parse JSON requests

const session = require("express-session");
const passport = require("./config/passport");

app.use(
  session({
    secret: process.env.JWT_SECRET || "fallback_session_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

module.exports = app;
