import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { buildTelegramLink, buildWhatsAppLink } from '../utils/telegram';

const API_URL = `${process.env.REACT_APP_API_URL}/products`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ حالة تعديل المواصفات
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [specsForm, setSpecsForm] = useState([]);
  const [savingSpecs, setSavingSpecs] = useState(false);
  const [specsError, setSpecsError] = useState('');

  // 🔑 التحقق من صلاحيات الأدمن
  const user =
    JSON.parse(localStorage.getItem('user') || 'null') ||
    JSON.parse(sessionStorage.getItem('user') || 'null');
  const isAdmin = user?.isAdmin === true || user?.role === 'admin';

  // ============================================================
  // 📥 جلب المنتج
  // ============================================================
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const token =
          localStorage.getItem('token') || sessionStorage.getItem('token');

        const res = await fetch(`${API_URL}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'فشل جلب المنتج');
        }

        setProduct(data.data);
        setSpecsForm(data.data.specifications || []);
      } catch (err) {
        console.error('Fetch product error:', err);
        setError(err.message || 'تعذّر الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // ============================================================
  // ✅ دوال تعديل المواصفات
  // ============================================================
  const handleOpenEditSpecs = () => {
    setSpecsForm(product.specifications || []);
    setSpecsError('');
    setIsEditingSpecs(true);
  };

  const handleCloseEditSpecs = () => {
    if (savingSpecs) return;
    setIsEditingSpecs(false);
    setSpecsError('');
  };

  const handleAddSpec = () => {
    setSpecsForm((prev) => [...prev, { label: '', value: '' }]);
  };

  const handleRemoveSpec = (index) => {
    setSpecsForm((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index, field, value) => {
    setSpecsForm((prev) =>
      prev.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      )
    );
  };

  const handleSaveSpecs = async () => {
    setSavingSpecs(true);
    setSpecsError('');

    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      // فلترة المواصفات الفارغة
      const cleaned = specsForm.filter(
        (s) => s.label?.trim() && s.value?.trim()
      );

      const formData = new FormData();
      formData.append('specifications', JSON.stringify(cleaned));

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'فشل حفظ المواصفات');
      }

      // تحديث المنتج في الواجهة
      setProduct(data.data);
      setSpecsForm(data.data.specifications || []);
      setIsEditingSpecs(false);
    } catch (err) {
      console.error('Save specs error:', err);
      setSpecsError(err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSavingSpecs(false);
    }
  };

  // ============================================================
  // نجوم التقييم
  // ============================================================
  const renderStars = (rating) => {
    const full = Math.floor(rating || 0);
    const hasHalf = (rating || 0) % 1 >= 0.5;
    return (
      <span className="text-amber-400 text-base tracking-tight">
        {'★'.repeat(full)}
        {hasHalf && '⯨'}
        {'☆'.repeat(5 - full - (hasHalf ? 1 : 0))}
      </span>
    );
  };

  // ============================================================
  // حالة التحميل
  // ============================================================
  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-red-100 border-t-[#C41824] rounded-full animate-spin" />
            <p className="text-slate-500 mt-4">جاري تحميل المنتج...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ============================================================
  // حالة الخطأ
  // ============================================================
  if (error || !product) {
    return (
      <div dir="rtl" className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-[#C41824]">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p className="text-slate-700 text-lg font-medium mb-2">
              {error || 'المنتج غير موجود'}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="mt-4 bg-[#C41824] text-white px-6 py-2.5 rounded-lg font-medium text-sm
                         hover:bg-[#A01420] transition-colors"
            >
              العودة للمنتجات
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ============================================================
  // حساب الخصم
  // ============================================================
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const inStock = product.stock > 0;
  const imageUrl = product.image || product.photo;
  const fallbackImage =
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(product.name || 'Product') +
    '&size=600&background=C41824&color=fff';

  return (
    <div dir="rtl" className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-[#C41824] transition-colors">الرئيسية</Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <Link to="/products" className="hover:text-[#C41824] transition-colors">المنتجات</Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="text-slate-800 font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* ===== الصورة ===== */}
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={imageUrl || fallbackImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = fallbackImage; }}
                />

                {product.badge && inStock && (
                  <span className="absolute top-4 right-4 bg-[#C41824] text-white text-sm font-semibold
                                   px-3 py-1.5 rounded-full shadow-md">
                    {product.badge}
                  </span>
                )}

                {discount > 0 && inStock && (
                  <span className="absolute top-4 left-4 bg-[#C41824] text-white text-sm font-bold
                                   px-3 py-1.5 rounded-full shadow-md">
                    -{discount}%
                  </span>
                )}

                {!inStock && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]
                                  flex items-center justify-center">
                    <span className="bg-white text-slate-800 text-lg font-bold px-6 py-3 rounded-xl shadow">
                      نفدت الكمية
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ===== التفاصيل ===== */}
            <div>
              {/* الفئة */}
              <span className="inline-block text-xs text-[#C41824] font-medium bg-red-50 px-3 py-1 rounded-md mb-3">
                {product.category || 'عام'}
              </span>

              {/* الاسم */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* التقييم */}
              <div className="flex items-center gap-2 mb-5">
                {renderStars(product.rating)}
                <span className="text-sm text-slate-500">
                  {product.rating || 0} ({product.reviews || 0} تقييم)
                </span>
              </div>

              {/* السعر */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-slate-100">
                <span className="text-3xl lg:text-4xl font-bold text-[#C41824]">
                  {product.price?.toLocaleString()} ر.س
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-lg text-slate-400 line-through">
                    {product.oldPrice.toLocaleString()} ر.س
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-sm font-bold text-white bg-[#C41824] px-2.5 py-1 rounded-md">
                    وفّر {discount}%
                  </span>
                )}
              </div>

              {/* الوصف */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">الوصف</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* ✅ المواصفات (مع زر تعديل للأدمن) */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700">المواصفات</h3>

                  {/* 🔒 زر التعديل — للأدمن فقط */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={handleOpenEditSpecs}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold
                                 text-[#C41824] hover:text-[#A01420] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      تعديل المواصفات
                    </button>
                  )}
                </div>

                {product.specifications && product.specifications.length > 0 ? (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    {product.specifications.map((spec, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between gap-4 px-4 py-3
                                   ${i !== product.specifications.length - 1 ? 'border-b border-slate-200' : ''}`}
                      >
                        <span className="text-sm text-slate-500">{spec.label}</span>
                        <span className="text-sm font-medium text-slate-800 text-left" dir="auto">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                    لا توجد مواصفات لهذا المنتج
                  </p>
                )}
              </div>

              {/* المخزون */}
              <div className="mb-6 flex items-center gap-2 text-sm">
                {inStock ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-green-700 font-medium">
                      متوفر في المخزون ({product.stock} قطعة)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-red-700 font-medium">نفدت الكمية</span>
                  </>
                )}
              </div>

              {/* أزرار الطلب */}
              {inStock && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* واتساب */}
                    <a
                      href={buildWhatsAppLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2
                                 bg-green-500 text-white py-3.5 rounded-xl text-sm font-semibold
                                 hover:bg-green-600 hover:-translate-y-0.5
                                 hover:shadow-lg hover:shadow-green-500/30
                                 transition-all duration-200"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      اطلب عبر واتساب
                    </a>

                    {/* تليجرام */}
                    <a
                      href={buildTelegramLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2
                                 bg-sky-500 text-white py-3.5 rounded-xl text-sm font-semibold
                                 hover:bg-sky-600 hover:-translate-y-0.5
                                 hover:shadow-lg hover:shadow-sky-500/30
                                 transition-all duration-200"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      اطلب عبر تليجرام
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* ✅ نافذة تعديل المواصفات */}
      {/* ============================================================ */}
      {isEditingSpecs && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm
                     flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleCloseEditSpecs}
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">تعديل المواصفات</h2>
                  <p className="text-xs text-slate-500">{product.name}</p>
                </div>
              </div>
              <button
                onClick={handleCloseEditSpecs}
                disabled={savingSpecs}
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

            {/* المحتوى */}
            <div className="p-6 space-y-4">
              {specsError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200
                                text-red-700 text-sm flex items-start gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0 mt-0.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>{specsError}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {specsForm.length === 0
                    ? 'لا توجد مواصفات حالياً'
                    : `${specsForm.length} مواصفة`}
                </p>
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

              {specsForm.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-sm text-slate-500 mb-3">
                    لا توجد مواصفات. اضغط "إضافة مواصفة" للبدء.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {specsForm.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                        placeholder="المواصفة (مثال: اللون)"
                        className="flex-1 border border-slate-200 rounded-lg py-2.5 px-3 text-sm
                                   focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        placeholder="القيمة (مثال: أزرق)"
                        className="flex-1 border border-slate-200 rounded-lg py-2.5 px-3 text-sm
                                   focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(index)}
                        className="w-10 h-10 flex items-center justify-center shrink-0
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

            {/* الأزرار */}
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseEditSpecs}
                disabled={savingSpecs}
                className="flex-1 py-3 rounded-lg border border-slate-200 text-slate-700
                           font-semibold hover:bg-slate-50 transition-colors
                           disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveSpecs}
                disabled={savingSpecs}
                className="flex-1 py-3 rounded-lg bg-[#C41824] text-white
                           font-semibold hover:bg-[#A01420] transition-colors
                           disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {savingSpecs ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ التعديلات'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetails;