const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Welcome, ${req.user.firstName}` });
});

module.exports = router;
