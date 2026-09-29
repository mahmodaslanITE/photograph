const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');   // ← أضف هذا

dotenv.config();

const app = express();
const server = http.createServer(app);

// لدعم JSON
app.use(express.json());

// اتصال قاعدة البيانات
require('./db')();
// ✅ تفعيل CORS — قبل كل المسارات
app.use(cors({
  origin: [
    'http://localhost:3000',           // التطوير المحلي
    'http://localhost:5173',           // التطوير المحلي (Vite)
    'https://*.vercel.app'             // Vercel (بعد النشر)
  ],
  credentials: true
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// خطأ 404 لأي راوتر آخر
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT ||4998;
server.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
