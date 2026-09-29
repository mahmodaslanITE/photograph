import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';

const API_URL = `${process.env.REACT_APP_API_URL}/products`;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'الكل';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState('default');
  const [showAddModal, setShowAddModal] = useState(false);

  const user =
    JSON.parse(localStorage.getItem('user') || 'null') ||
    JSON.parse(sessionStorage.getItem('user') || 'null');
  const isAdmin = user?.isAdmin === true || user?.role === 'admin';

  useEffect(() => {
    setCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (newCategory === 'الكل') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', newCategory);
    }
    setSearchParams(searchParams, { replace: true });
  };

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

  const handleDelete = useCallback((productId) => {
    setProducts((prev) =>
      prev.filter((p) => (p._id || p.id) !== productId)
    );
  }, []);

  const handleUpdate = useCallback((updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        (p._id || p.id) === (updatedProduct._id || updatedProduct.id)
          ? updatedProduct
          : p
      )
    );
  }, []);

  const handleAdd = useCallback((newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  }, []);

  const categories = useMemo(() => {
    if (!products.length) return ['الكل'];
    const unique = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ['الكل', ...unique];
  }, [products]);

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

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* رأس الصفحة */}
        <section className="bg-gradient-to-br from-red-50 via-white to-rose-50 border-b border-slate-100 py-12 lg:py-16">
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

              {/* زر إضافة منتج — للأدمن فقط */}
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="shrink-0 inline-flex items-center justify-center gap-2
                             bg-[#C41824] text-white px-5 py-3 rounded-xl font-semibold
                             text-sm sm:text-base
                             hover:bg-[#A01420] hover:-translate-y-0.5
                             hover:shadow-lg hover:shadow-red-700/30
                             transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
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
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pr-11 pl-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100 transition-all"
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
                    className="bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-700 focus:outline-none focus:border-[#C41824] focus:ring-2 focus:ring-red-100 transition-all cursor-pointer"
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
                        ? 'bg-[#C41824] text-white shadow-sm shadow-red-700/30'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-[#C41824] hover:text-[#C41824]'
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

            {/* حالة التحميل */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-red-100 border-t-[#C41824] rounded-full animate-spin" />
                <p className="text-slate-500 mt-4">جاري تحميل المنتجات...</p>
              </div>
            )}

            {/* حالة الخطأ */}
            {!loading && error && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-[#C41824]">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <p className="text-slate-700 text-lg font-medium mb-2">
                  تعذّر تحميل المنتجات
                </p>
                <p className="text-slate-500 text-sm mb-6">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="bg-[#C41824] text-white px-6 py-2.5 rounded-lg font-medium text-sm
                             hover:bg-[#A01420] transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}

            {/* حالة النجاح */}
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
                        className="text-sm text-[#C41824] font-medium hover:underline flex items-center gap-1"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        مسح الفلاتر
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-slate-400">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
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
                      className="bg-[#C41824] text-white px-6 py-2.5 rounded-lg font-medium text-sm
                                 hover:bg-[#A01420] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-700/30
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

      {/* نافذة إضافة منتج */}
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