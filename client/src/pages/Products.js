import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';

// ✅ المنفذ الموحّد
const API_URL = `${process.env.REACT_APP_API_URL}/products`;
console.log('🌐 API_URL:', API_URL);

const Products = () => {
  // ===== قراءة الفئة من URL =====
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'الكل';

  // ===== الحالة =====
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState('default');
  const [showAddModal, setShowAddModal] = useState(false);

  // ============================================================
  // 🔑 التحقق من صلاحيات الأدمن
  // ============================================================
  const user =
    JSON.parse(localStorage.getItem('user') || 'null') ||
    JSON.parse(sessionStorage.getItem('user') || 'null');
  const isAdmin = user?.isAdmin === true || user?.role === 'admin';

  // ============================================================
  // 🔄 مزامنة الفئة مع URL
  // ============================================================
  useEffect(() => {
    setCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  // عند تغيير الفئة يدوياً، حدّث URL
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (newCategory === 'الكل') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newCategory);
    }
    setSearchParams(searchParams, { replace: true });
  };

  // ============================================================
  // 📥 جلب المنتجات من الـ API
  // ============================================================
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      const res = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'فشل جلب المنتجات');
      }

      console.log('📦 Products fetched:', data.data?.length);
      setProducts(data.data || []);
    } catch (err) {
      console.error('Fetch products error:', err);
      setError(err.message || 'تعذّر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ============================================================
  // 🗑️ حذف المنتج من الواجهة
  // ============================================================
  const handleDelete = useCallback((productId) => {
    console.log('🗑️ Deleting product from UI:', productId);
    setProducts((prev) =>
      prev.filter((p) => (p._id || p.id) !== productId)
    );
  }, []);

  // ============================================================
  // 💾 تحديث المنتج في الواجهة
  // ============================================================
  const handleUpdate = useCallback((updatedProduct) => {
    console.log('💾 Updating product in UI:', updatedProduct);
    setProducts((prev) =>
      prev.map((p) =>
        (p._id || p.id) === (updatedProduct._id || updatedProduct.id)
          ? updatedProduct
          : p
      )
    );
  }, []);

  // ============================================================
  // ➕ إضافة منتج جديد للواجهة
  // ============================================================
  const handleAdd = useCallback((newProduct) => {
    console.log('➕ Adding product to UI:', newProduct);
    setProducts((prev) => [newProduct, ...prev]);
  }, []);

  // ============================================================
  // 📂 الفئات الفريدة
  // ============================================================
  const categories = useMemo(() => {
    if (!products.length) return ['الكل'];
    const unique = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ['الكل', ...unique];
  }, [products]);

  // ============================================================
  // 🔍 تصفية وترتيب
  // ============================================================
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const q = search.toLowerCase();

      const matchSearch =
        product.name?.toLowerCase().includes(q) ||
        product.category?.includes(search) ||
        product.description?.toLowerCase().includes(q);

      const matchCategory =
        category === 'الكل' || product.category === category;

      return matchSearch && matchCategory;
    });

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result = [...result].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      default:
        break;
    }

    return result;
  }, [products, search, category, sortBy]);

  // ============================================================
  // 🖼️ الواجهة
  // ============================================================
  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* رأس الصفحة */}
        <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-b border-slate-100 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
                  تسوّق منتجاتنا
                </h1>
                <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                  اكتشف تشكيلة واسعة من المنتجات الأصلية بأفضل الأسعار، مع شحن سريع وإرجاع مجاني.
                </p>
              </div>

              {/* ➕ زر إضافة منتج — للأدمن فقط */}
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="shrink-0 inline-flex items-center justify-center gap-2
                             bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold
                             text-sm sm:text-base
                             hover:bg-indigo-800 hover:-translate-y-0.5
                             hover:shadow-lg hover:shadow-indigo-700/30
                             transition-all duration-300"
                >
                  <span className="text-lg">➕</span>
                  <span>إضافة منتج</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* أدوات التصفية */}
        <section className="border-b border-slate-100 py-6 bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4">

              {/* الصف الأول: البحث + الترتيب */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">

                <div className="relative w-full sm:max-w-md">
                  <span className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 pointer-events-none">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pr-11 pl-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-slate-600 whitespace-nowrap">
                    ترتيب حسب:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-700 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                  >
                    <option value="default">الافتراضي</option>
                    <option value="price-asc">السعر: من الأقل للأعلى</option>
                    <option value="price-desc">السعر: من الأعلى للأقل</option>
                    <option value="rating">الأعلى تقييماً</option>
                    <option value="newest">الأحدث</option>
                  </select>
                </div>
              </div>

              {/* الصف الثاني: الفئات */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 sm:pb-0 sm:mb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      category === cat
                        ? 'bg-indigo-700 text-white shadow-sm shadow-indigo-700/30'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* شبكة المنتجات */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* 🔄 حالة التحميل */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-indigo-100 border-t-indigo-700 rounded-full animate-spin" />
                <p className="text-slate-500 mt-4">جاري تحميل المنتجات...</p>
              </div>
            )}

            {/* ❌ حالة الخطأ */}
            {!loading && error && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-4">
                  <span className="text-4xl">⚠️</span>
                </div>
                <p className="text-slate-700 text-lg font-medium mb-2">
                  تعذّر تحميل المنتجات
                </p>
                <p className="text-slate-500 text-sm mb-6">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm
                             hover:bg-indigo-800 transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}

            {/* 📦 حالة النجاح */}
            {!loading && !error && (
              filteredProducts.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-slate-500 text-sm">
                      {filteredProducts.length} منتج
                      {category !== 'الكل' && ` في ${category}`}
                      {search && ` — نتائج البحث عن "${search}"`}
                    </p>

                    {(search || category !== 'الكل' || sortBy !== 'default') && (
                      <button
                        onClick={() => {
                          setSearch('');
                          handleCategoryChange('الكل');
                          setSortBy('default');
                        }}
                        className="text-sm text-indigo-700 font-medium hover:underline flex items-center gap-1"
                      >
                        <span>✕</span> مسح الفلاتر
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id || product.id}
                        product={product}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <p className="text-slate-700 text-lg font-medium mb-2">
                    {products.length === 0
                      ? 'لا توجد منتجات في المتجر بعد'
                      : 'لا توجد منتجات مطابقة'}
                  </p>
                  <p className="text-slate-500 text-sm mb-6">
                    {products.length === 0
                      ? isAdmin
                        ? 'اضغط "إضافة منتج" لبدء إضافة منتجات جديدة'
                        : 'عد لاحقاً لاكتشاف المنتجات الجديدة'
                      : 'جرّب تغيير كلمات البحث أو الفئة'}
                  </p>
                  {products.length > 0 && (
                    <button
                      onClick={() => {
                        setSearch('');
                        handleCategoryChange('الكل');
                        setSortBy('default');
                      }}
                      className="bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm
                                 hover:bg-indigo-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-700/30
                                 transition-all duration-200"
                    >
                      مسح الفلاتر
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* ➕ نافذة إضافة منتج */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default Products;