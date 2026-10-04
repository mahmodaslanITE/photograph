const asyncHandler = require('express-async-handler');
const Product = require('../Models/Product');

/**
 * @desc    إضافة منتج جديد
 * @route   POST /api/products
 * @access  Admin only
 */
module.exports.addProduct = asyncHandler(async (req, res) => {
  const isAdmin = req.user.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({
      message: 'هذا الإجراء مخصص للمسؤولين',
      status: 'error',
    });
  }

  const {
    name, price, oldPrice, description,
    category, stock, badge, rating, reviews,specifications,
  } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      message: 'الرجاء تزويد الاسم والسعر',
      status: 'error',
    });
  }
  // ✅ تحويل المواصفات من String إلى Array
  let parsedSpecs = [];
  if (specifications) {
    try {
      parsedSpecs = typeof specifications === 'string'
        ? JSON.parse(specifications)
        : specifications;
      // فلترة المواصفات الفارغة
      parsedSpecs = parsedSpecs.filter(
        (s) => s.label?.trim() && s.value?.trim()
      );
    } catch (err) {
      console.error('Error parsing specifications:', err);
      parsedSpecs = [];
    }
  }
  // ✅ إذا كان هناك ملف صورة مرفوع، استخدم رابطه من Cloudinary
  // إذا لم يكن هناك ملف، استخدم الرابط المرسل من الفرونت (للتوافق مع الكود القديم)
  const imageUrl = req.file ? req.file.path : req.body.image;

  const new_product = await Product.create({
    name,
    price,
    oldPrice,
    description,
    category: category || 'عام',
    stock: stock || 0,
    image: imageUrl,
    photo: imageUrl, // للتوافق
    badge,
    rating: rating || 0,
    reviews: reviews || 0,
    specifications: parsedSpecs,

     

  });

  res.status(201).json({
    message: 'تم إضافة المنتج بنجاح',
    status: 'success',
    data: new_product,
  });
});

/**
 * @desc    جلب كل المنتجات
 * @route   GET /api/products
 * @access  Private (User/Admin)
 */
module.exports.getAllProducts = asyncHandler(async (req, res) => {
  const { category, sort, search } = req.query;

  // ✅ بناء استعلام ديناميكي
  let query = {};

  // فلترة حسب الفئة
  if (category && category !== 'الكل') {
    query.category = category;
  }

  // بحث في الاسم والوصف
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // ✅ الترتيب
  let sortOption = { createdAt: -1 }; // الافتراضي: الأحدث أولاً
  switch (sort) {
    case 'price-asc':
      sortOption = { price: 1 };
      break;
    case 'price-desc':
      sortOption = { price: -1 };
      break;
    case 'rating':
      sortOption = { rating: -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    default:
      break;
  }

  const products = await Product.find(query).sort(sortOption);

  res.status(200).json({
    message: 'تم جلب المنتجات بنجاح',
    status: 'success',
    count: products.length,
    data: products,
  });
});

/**
 * @desc    جلب منتج بواسطة ID
 * @route   GET /api/products/:id
 * @access  Private (User/Admin)
 */
module.exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      message: 'المنتج غير موجود',
      status: 'error',
    });
  }

  res.status(200).json({
    message: 'تم جلب المنتج بنجاح',
    status: 'success',
    data: product,
  });
});

/**
 * @desc    تعديل منتج بواسطة ID
 * @route   PUT /api/products/:id
 * @access  Admin only
 */
module.exports.updateProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const isAdmin = req.user.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({
      message: 'هذا الإجراء مخصص للمسؤولين',
      status: 'error',
    });
  }

  delete req.body._id;

    // ✅ تحويل المواصفات
    if (req.body.specifications) {
      try {
        let parsedSpecs = typeof req.body.specifications === 'string'
          ? JSON.parse(req.body.specifications)
          : req.body.specifications;
        req.body.specifications = parsedSpecs.filter(
          (s) => s.label?.trim() && s.value?.trim()
        );
      } catch (err) {
        console.error('Error parsing specifications:', err);
        delete req.body.specifications;
      }
    }
  
  // ✅ إذا رُفعت صورة جديدة، استخدم رابطها
  if (req.file) {
    req.body.image = req.file.path;
    req.body.photo = req.file.path;
  }

  // تحويل الأرقام
  if (req.body.price !== undefined) req.body.price = Number(req.body.price);
  if (req.body.oldPrice !== undefined) req.body.oldPrice = Number(req.body.oldPrice);
  if (req.body.stock !== undefined) req.body.stock = Number(req.body.stock);

  const updated_product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated_product) {
    return res.status(404).json({ message: 'المنتج غير موجود', status: 'error' });
  }

  res.status(200).json({
    message: 'تم تعديل المنتج بنجاح',
    status: 'success',
    data: updated_product,
  });
});
/**
 * @desc    حذف منتج بواسطة ID
 * @route   DELETE /api/products/:id
 * @access  Admin only
 */
module.exports.deleteProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const isAdmin = req.user.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({
      message: 'هذا الإجراء مخصص للمسؤولين',
      status: 'error',
    });
  }

  const deleted_product = await Product.findByIdAndDelete(id);

  if (!deleted_product) {
    return res.status(404).json({
      message: 'المنتج غير موجود',
      status: 'error',
    });
  }

  res.status(200).json({
    message: 'تم حذف المنتج بنجاح',
    status: 'success',
    data: deleted_product,
  });
});