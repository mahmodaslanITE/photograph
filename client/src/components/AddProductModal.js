import React, { useState } from 'react';

const API_URL = 'http://localhost:4998/api/products';

const AddProductModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    category: '',
    image: '',
    stock: 0,
    badge: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ التحقق من الحقول المطلوبة
    if (!form.name.trim() || !form.price) {
      setError('الرجاء إدخال اسم المنتج والسعر');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        category: form.category.trim() || 'عام',
        image: form.image.trim(),
        stock: Number(form.stock) || 0,
        badge: form.badge.trim(),
      };

      if (form.oldPrice) {
        payload.oldPrice = Number(form.oldPrice);
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'فشل إضافة المنتج');
      }

      // إبلاغ الأب بالمنتج الجديد
      if (onAdd) onAdd(data.data);
      onClose();
    } catch (err) {
      console.error('Add product error:', err);
      setError(err.message || 'حدث خطأ أثناء الإضافة');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm
                 flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => !saving && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* الرأس */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700
                             flex items-center justify-center text-xl">
              ➕
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">إضافة منتج جديد</h2>
              <p className="text-xs text-slate-500">املأ الحقول لإضافة منتج جديد للمتجر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-8 h-8 flex items-center justify-center text-slate-400
                       hover:text-slate-700 hover:bg-slate-100 rounded-lg
                       transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200
                            text-red-700 text-sm flex items-start gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* الاسم */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              اسم المنتج <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="مثال: لابتوب HP Pavilion 15"
              className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                         focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* السعر + السعر القديم */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                السعر (ر.س) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                السعر القديم (اختياري)
              </label>
              <input
                type="number"
                name="oldPrice"
                value={form.oldPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="اتركه فارغاً إن لم يوجد خصم"
                className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* الفئة + المخزون */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                الفئة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="مثال: إلكترونيات، هواتف، إكسسوارات"
                list="category-suggestions"
                className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
              <datalist id="category-suggestions">
                <option value="إلكترونيات" />
                <option value="هواتف" />
                <option value="إكسسوارات" />
                <option value="صوتيات" />
                <option value="أجهزة لوحية" />
                <option value="كاميرات" />
                <option value="شاشات" />
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                المخزون
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                           focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              الوصف
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="اكتب وصفاً موجزاً للمنتج..."
              className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                         focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100
                         resize-none"
            />
          </div>

          {/* رابط الصورة */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              رابط الصورة
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                         focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
            {form.image && (
              <div className="mt-3 flex items-start gap-3">
                <img
                  src={form.image}
                  alt="معاينة"
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <p className="text-xs text-slate-500">معاينة الصورة</p>
              </div>
            )}
          </div>

          {/* شارة */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              شارة (اختياري)
            </label>
            <input
              type="text"
              name="badge"
              value={form.badge}
              onChange={handleChange}
              placeholder="مثال: جديد، الأكثر مبيعاً، خصم 17%"
              className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                         focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* الأزرار */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-3 rounded-lg border border-slate-200 text-slate-700
                         font-semibold hover:bg-slate-50 transition-colors
                         disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-lg bg-indigo-700 text-white
                         font-semibold hover:bg-indigo-800 transition-colors
                         disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <span>➕</span>
                  إضافة المنتج
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;