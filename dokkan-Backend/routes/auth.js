const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Helper to determine role without requiring DB migration
// ADMIN_EMAILS is a comma-separated list of admin emails
function resolveUserRole(email) {
  const list = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (list.includes(String(email).toLowerCase())) return 'admin';
  return 'user';
}

// Đăng ký
router.post('/register', async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }
  const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (users.length > 0) {
    return res.status(400).json({ error: 'Email đã tồn tại' });
  }
  const password_hash = await bcrypt.hash(password, 10);
  await db.query(
    'INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
    [fullName, email, phone, password_hash]
  );
  res.status(201).json({ message: 'Đăng ký thành công' });
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(400).json({ error: 'Email không tồn tại' });
  }
  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(400).json({ error: 'Sai mật khẩu' });
  }
  // Lưu user vào session, tính role từ ENV để tránh phụ thuộc cột DB ngay lập tức
  const role = resolveUserRole(user.email);
  req.session.user = { id: user.id, email: user.email, fullName: user.full_name, role };
  res.json({ success: true, user: req.session.user });
});

// Route kiểm tra trạng thái đăng nhập
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Route đăng xuất
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Đăng xuất thất bại' });
    }
    res.clearCookie('connect.sid'); // tên mặc định của express-session
    res.json({ success: true });
  });
});

module.exports = router; 