const express = require('express');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const session = require('express-session');
let MySQLStore;
try {
  // Optional dependency: express-mysql-session
  MySQLStore = require('express-mysql-session')(session);
} catch (_) {
  MySQLStore = null;
}
require('dotenv').config();

const app = express();
const path = require('path');

// Cấu hình CORS cho phép credentials và origin frontend
// - Production: set FRONTEND_ORIGIN trên hosting (VD: https://shop-dokkan.vercel.app)
// - Dev: fallback về http://localhost:3000
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { fallthrough: true }));

// Cấu hình session (có thể dùng MySQLStore nếu đã cài đặt express-mysql-session)
// Tin cậy reverse proxy (DevTunnel) để xác định scheme https chính xác
app.set('trust proxy', 1);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // Bật secure + sameSite none để gửi cookie qua cross-site (DevTunnel HTTPS)
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
  },
};

if (MySQLStore) {
  const store = new MySQLStore({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    clearExpired: true,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
  });
  sessionOptions.store = store;
}

app.use(session(sessionOptions));

app.use('/api/auth', authRoutes);
// Đăng ký route giỏ hàng
app.use('/api/cart', require('./routes/cart'));
// Public store routes
app.use('/api', require('./routes/public'));

// Middleware kiểm tra admin
function requireAdmin(req, res, next) {
  const user = req.session && req.session.user;
  if (!user) return res.status(401).json({ error: 'Chưa đăng nhập' });
  if (user.role !== 'admin') return res.status(403).json({ error: 'Không có quyền truy cập' });
  next();
}

// API admin tối thiểu cho Dashboard
app.get('/api/admin/summary', requireAdmin, async (req, res) => {
  try {
    // Tối thiểu trả về số liệu giả định khi chưa có bảng đầy đủ
    res.json({
      revenueToday: 0,
      ordersToday: 0,
      totalUsers: 0,
      lowStock: 0,
      // Có thể mở rộng khi có bảng: SELECT COUNT(*) FROM orders WHERE DATE(created_at)=CURDATE()
    });
  } catch (e) {
    res.status(500).json({ error: 'Không lấy được dữ liệu' });
  }
});

// Mount admin CRUD routes
app.use('/api/admin', requireAdmin, require('./routes/admin'));
// Upload (optional: protect by requireAdmin)
app.use('/api/upload', requireAdmin, require('./routes/upload'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 