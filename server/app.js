const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// ✅ CORS أولاً
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, true); // السماح بالجميع في الإنتاج
  },
  credentials: true,
}));

// ✅ دعم JSON
app.use(express.json());

// ✅ اتصال قاعدة البيانات
require('./db')();

// ✅ المسارات
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// ✅ 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ المنفذ: Railway يوفره عبر process.env.PORT
const PORT = process.env.PORT || 4998;

// ✅ استخدم app.listen مباشرة (بدون http.createServer)
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});