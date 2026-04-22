const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Step 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Generate JWT specific to our app
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET || 'fallback_secret_key_for_development_purposes',
      { expiresIn: "7d" }
    );

    // Send token to frontend!
    res.redirect(`http://localhost:5173/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({id: req.user._id, name: req.user.name, email: req.user.email}))}`);
  }
);

module.exports = router;
