const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ CORS أولاً
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedPatterns = [
      /^http:\/\/localhost:\d+$/,   // أي localhost
      /\.vercel\.app$/,
      /\.netlify\.app$/,
      /\.railway\.app$/,
    ];

    if (allowedPatterns.some((pattern) => pattern.test(origin))) {
      return callback(null, true);
    }

    return callback(null, true);    // السماح بالجميع في الإنتاج
  },
  credentials: true,
}));

// دعم JSON
app.use(express.json());

// اتصال قاعدة البيانات
require('./db')();

// المسارات
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ بدون 0.0.0.0
const PORT = process.env.PORT || 4998;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));