const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'photograph/products', // اسم المجلد في Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // تحسين الصورة تلقائياً
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 ميجابايت كحد أقصى
  },
});

module.exports = upload;