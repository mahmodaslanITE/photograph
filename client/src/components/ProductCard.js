import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildTelegramLink } from '../utils/telegram';

// ✅ المنفذ الموحّد

const ProductCard = ({ product, onDelete, onUpdate, onEdit }) => {

  // ===== حالات البطاقة =====
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // ===== نموذج التعديل =====
  const [form, setForm] = useState({
    name: product.name || '',
    price: product.price || '',
    oldPrice: product.oldPrice || '',
    description: product.description || '',
    category: product.category || '',
    image: product.image || product.photo || '',
    stock: product.stock || 0,
    badge: product.badge || '',
  });

  // ============================================================
  // 🔑 قراءة صلاحيات الأدمن
  // ============================================================
  const user =
    JSON.parse(localStorage.getItem('user') || 'null') ||
    JSON.parse(sessionStorage.getItem('user') || 'null');
  const isAdmin = user?.isAdmin === true || user?.role === 'admin';

  const productId = product._id || product.id;

  // ============================================================
  // حساب نسبة الخصم
  // ============================================================
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const inStock = product.stock > 0;

  const fallbackImage =
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(product.name || 'Product') +
    '&size=400&background=4f46e5&color=fff';

  // ============================================================
  // نجوم التقييم
  // ============================================================
  const renderStars = (rating) => {
    const full = Math.floor(rating || 0);
    const hasHalf = (rating || 0) % 1 >= 0.5;
    return (
      <span className="text-amber-400 text-sm tracking-tight">
        {'★'.repeat(full)}
        {hasHalf && '⯨'}
        {'☆'.repeat(5 - full - (hasHalf ? 1 : 0))}
      </span>
    );
  };

  // ============================================================
  // 🗑️ حذف المنتج
  // ============================================================
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      const res = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'فشل الحذف');
      }

      if (onDelete) onDelete(productId);
      setShowConfirm(false);
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'حدث خطأ أثناء الحذف');
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // ✏️ بدء التعديل
  // ============================================================
  const handleStartEdit = () => {
    setForm({
      name: product.name || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      description: product.description || '',
      category: product.category || '',
      image: product.image || product.photo || '',
      stock: product.stock || 0,
      badge: product.badge || '',
    });
    setError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
  };

  // ============================================================
  // 💾 حفظ التعديلات
  // ============================================================
  const handleSaveEdit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        category: form.category.trim(),
        image: form.image.trim(),
        stock: Number(form.stock),
        badge: form.badge.trim(),
      };

      if (form.oldPrice) {
        payload.oldPrice = Number(form.oldPrice);
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'فشل التعديل');
      }

      if (onUpdate) {
        console.log('📤 Sending updated product to parent:', data.data);
        onUpdate(data.data);
      } else {
        console.warn('⚠️ onUpdate callback غير مُمرّر من الأب!');
      }

      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // ============================================================
  // 🎨 واجهة وضع التعديل
  // ============================================================
  if (isEditing) {
    return (
      <div className="bg-white border-2 border-indigo-300 rounded-xl overflow-hidden
                      shadow-md shadow-indigo-100 flex flex-col">

        {/* رأس التعديل */}
        <div className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>✏️</span>
            <span>وضع التعديل</span>
          </div>
          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={saving}
            className="w-7 h-7 flex items-center justify-center rounded-lg
                       hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSaveEdit} className="p-4 flex flex-col flex-1 gap-3">

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200
                            text-red-700 text-xs flex items-start gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* الاسم */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              اسم المنتج *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm
                         focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* السعر + السعر القديم */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                السعر *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                السعر القديم
              </label>
              <input
                type="number"
                name="oldPrice"
                value={form.oldPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* الفئة + المخزون */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                الفئة
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                المخزون
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              الوصف
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="2"
              className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm
                         focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100
                         resize-none"
            />
          </div>

          {/* رابط الصورة */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              رابط الصورة
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm
                         focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* شارة */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              شارة (اختياري)
            </label>
            <input
              type="text"
              name="badge"
              value={form.badge}
              onChange={handleChange}
              placeholder="مثال: جديد، الأكثر مبيعاً"
              className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm
                         focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* الأزرار */}
          <div className="flex gap-2 mt-auto pt-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700
                         font-medium text-sm hover:bg-slate-50 transition-colors
                         disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded-lg bg-indigo-700 text-white
                         font-semibold text-sm hover:bg-indigo-800 transition-colors
                         disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                '💾 حفظ'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ============================================================
  // 🖼️ واجهة العرض العادية
  // ============================================================
  return (
    <>
      <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden
                      hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100
                      transition-all duration-200 flex flex-col relative">

        {/* شارة أدمن */}
        {isAdmin && (
          <div className="absolute top-2 left-2 z-20 bg-slate-900/80 backdrop-blur text-white
                          text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <span>⚙️</span> أدمن
          </div>
        )}

        {/* الصورة */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.image || product.photo}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = fallbackImage; }}
          />

          {product.badge && inStock && (
            <span className="absolute top-3 right-3 bg-indigo-700 text-white text-xs font-semibold
                             px-2.5 py-1 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}

          {discount > 0 && inStock && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold
                             px-2.5 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}

          {!inStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]
                            flex items-center justify-center">
              <span className="bg-white text-slate-800 text-sm font-bold px-4 py-2 rounded-lg shadow">
                نفدت الكمية
              </span>
            </div>
          )}

          <button
            type="button"
            aria-label="أضف إلى المفضلة"
            className="absolute bottom-3 left-3 w-9 h-9 flex items-center justify-center
                       bg-white/90 backdrop-blur rounded-full text-slate-500
                       hover:text-red-500 hover:bg-white shadow-sm
                       opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* المعلومات */}
        <div className="p-4 flex flex-col flex-1">

          <span className="text-xs text-indigo-700 font-medium bg-indigo-50 px-2 py-0.5 rounded-md w-fit mb-2">
            {product.category}
          </span>

          <h3 className="text-base font-semibold text-slate-800 mb-1 line-clamp-2
                         group-hover:text-indigo-700 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-3">
            {renderStars(product.rating)}
            <span className="text-xs text-slate-500">
              {product.rating || 0} ({product.reviews || 0})
            </span>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2 mb-4 mt-auto">
            <span className="text-xl font-bold text-slate-800">
              {product.price?.toLocaleString()} ر.س
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-sm text-slate-400 line-through">
                {product.oldPrice.toLocaleString()} ر.س
              </span>
            )}
          </div>

          {/* الأزرار الأساسية */}
          <div className="flex gap-2">
            <Link
              to={`/products/${productId}`}
              className={`flex-1 text-center py-2 rounded-lg text-sm font-medium
                         transition-colors ${
                           inStock
                             ? 'bg-indigo-700 text-white hover:bg-indigo-800'
                             : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
                         }`}
            >
              {inStock ? 'أضف إلى السلة' : 'غير متوفر'}
            </Link>

            <Link
              to={`/products/${productId}`}
              aria-label={`عرض تفاصيل ${product.name}`}
              className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600
                         hover:border-indigo-300 hover:text-indigo-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* ✈️ زر الطلب عبر تليجرام — يظهر فقط إذا المنتج متوفر */}
          {inStock && (
            <a
              href={buildTelegramLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`اطلب ${product.name} عبر تليجرام`}
              className="mt-2 flex items-center justify-center gap-2
                         bg-sky-500 text-white py-2 rounded-lg text-sm font-semibold
                         hover:bg-sky-600 hover:-translate-y-0.5
                         hover:shadow-md hover:shadow-sky-500/30
                         transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>اطلب عبر تليجرام</span>
            </a>
          )}

          {/* أزرار الأدمن */}
          {isAdmin && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleStartEdit}
                className="flex-1 flex items-center justify-center gap-2
                           bg-amber-50 text-amber-700 border border-amber-200
                           py-2 rounded-lg text-sm font-semibold
                           hover:bg-amber-100 hover:border-amber-300
                           transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>تعديل</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2
                           bg-red-50 text-red-600 border border-red-200
                           py-2 rounded-lg text-sm font-semibold
                           hover:bg-red-100 hover:border-red-300
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                <span>{deleting ? '...' : 'حذف'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* نافذة تأكيد الحذف */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm
                     flex items-center justify-center p-4"
          onClick={() => !deleting && setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100
                            flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   className="w-7 h-7 text-red-600">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-slate-800 text-center mb-2">
              تأكيد الحذف
            </h3>
            <p className="text-slate-600 text-sm text-center mb-6 leading-relaxed">
              هل أنت متأكد من حذف المنتج
              <span className="font-semibold text-slate-800"> "{product.name}"</span>؟
              <br />
              <span className="text-red-600 text-xs">لا يمكن التراجع عن هذا الإجراء.</span>
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700
                           font-medium text-sm hover:bg-slate-50 transition-colors
                           disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm
                           hover:bg-red-700 transition-colors disabled:opacity-60
                           flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    جاري الحذف...
                  </>
                ) : (
                  'تأكيد الحذف'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
