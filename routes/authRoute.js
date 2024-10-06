const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', protect, (req, res) => {
  // Respond with user info if token is valid
  res.json({
    id: req.user._id,
    email: req.user.email,
  });
});

router.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Welcome, ${req.user.firstName}` });
});

module.exports = router;
