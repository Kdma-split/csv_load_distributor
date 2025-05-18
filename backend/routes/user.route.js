const express = require('express');
const {
  loginUser,
  getMe,
  logout,
  registerUser
} = require('../controllers/user.controller.js');
const { protect } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;