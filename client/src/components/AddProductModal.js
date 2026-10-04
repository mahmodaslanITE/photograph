import React, { useState } from 'react';

const API_URL = `${process.env.REACT_APP_API_URL}/products`;

const AddProductModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    category: '',
    imageFile: null,
    imagePreview: '',
    stock: 0,
    badge: '',
    specifications: [], // ✅ مصفوفة المواصفات
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // ====== ✅ دوال المواصفات ======
  const handleAddSpec = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }],
    }));
  };

  const handleRemoveSpec = (index) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price) {
      setError('الرجاء إدخال اسم المنتج والسعر');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('price', form.price);
      formData.append('description', form.description.trim());
      formData.append('category', form.category.trim() || 'عام');
      formData.append('stock', form.stock || 0);
      formData.append('badge', form.badge.trim());
      if (form.oldPrice) formData.append('oldPrice', form.oldPrice);

      if (form.imageFile) {
        formData.append('image', form.imageFile);
      }

      // ✅ إرسال المواصفات كـ JSON String
      const cleanedSpecs = form.specifications.filter(
        (s) => s.label.trim() && s.value.trim()
      );
      if (cleanedSpecs.length > 0) {
        formData.append('specifications', JSON.stringify(cleanedSpecs));
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'فشل إضافة المنتج');
      }

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
            <span className="w-10 h-10 rounded-xl bg-red-50 text-[#C41824]
                             flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
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
            aria-label="إغلاق"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200
                            text-red-700 text-sm flex items-start gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* الاسم */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              اسم المنتج <span className="text-[#C41824]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="مثال: لابتوب HP Pavilion 15"
              className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                         focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* السعر + السعر القديم */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                السعر (ر.س) <span className="text-[#C41824]">*</span>
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
                           focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100"
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
                           focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>

          {/* الفئة + المخزون */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                الفئة <span className="text-[#C41824]">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="مثال: إلكترونيات، هواتف، إكسسوارات"
                list="category-suggestions"
                className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                           focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100"
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
                           focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100"
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
                         focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100
                         resize-none"
            />
          </div>

          {/* ✅ المواصفات الديناميكية */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-700">
                المواصفات
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="inline-flex items-center gap-1.5 text-xs font-semibold
                           text-[#C41824] hover:text-[#A01420] transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                إضافة مواصفة
              </button>
            </div>

            {form.specifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">
                لا توجد مواصفات. اضغط "إضافة مواصفة" لإضافة مواصفة جديدة.
              </p>
            ) : (
              <div className="space-y-2">
                {form.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                      placeholder="المواصفة (مثال: المعالج)"
                      className="flex-1 border border-slate-200 rounded-lg py-2 px-3 text-sm
                                 focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      placeholder="القيمة (مثال: Intel Core i7)"
                      className="flex-1 border border-slate-200 rounded-lg py-2 px-3 text-sm
                                 focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="w-9 h-9 flex items-center justify-center shrink-0
                                 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="حذف المواصفة"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* حقل رفع الصورة */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              صورة المنتج
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-slate-200 rounded-lg py-2.5 px-4 text-sm
                         focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100
                         file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0
                         file:text-sm file:font-semibold file:bg-red-50 file:text-[#C41824]
                         hover:file:bg-red-100 cursor-pointer"
            />
            {form.imagePreview && (
              <div className="mt-3 flex items-start gap-3">
                <img
                  src={form.imagePreview}
                  alt="معاينة"
                  className="w-24 h-24 object-cover rounded-lg border border-slate-200"
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
                         focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100"
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
              className="flex-1 py-3 rounded-lg bg-[#C41824] text-white
                         font-semibold hover:bg-[#A01420] transition-colors
                         disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                'إضافة المنتج'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;