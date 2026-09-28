// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المنتج مطلوب'],
    trim: true,
    minlength: [2, 'الاسم قصير جداً'],
  },
  price: {
    type: Number,
    required: [true, 'السعر مطلوب'],
    min: [0, 'السعر لا يمكن أن يكون سالباً'],
  },
  oldPrice: {
    type: Number,
    min: [0, 'السعر القديم لا يمكن أن يكون سالباً'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'الفئة مطلوبة'],
    trim: true,
    default: 'عام',
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'المخزون لا يمكن أن يكون سالباً'],
  },
  photo: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  badge: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

// فهرس للبحث السريع حسب الفئة
productSchema.index({ category: 1 });

// فهرس نصي للبحث بالاسم والوصف
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);