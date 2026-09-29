import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(sessionStorage.getItem('user'));

  const isAdmin = user?.isAdmin === true || user?.role === 'admin';

  const cartCount = 0;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };
  const CONTACT_PHONE = '+963999000000';
  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'المنتجات', href: '/products' },
    { label: 'اتصل بنا', href: `tel:${CONTACT_PHONE}`, type: 'phone' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-[72px] gap-4">

        {/* ===== الشعار ===== */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="w-9 h-9 lg:w-10 lg:h-10 bg-[#C41824] text-white rounded-xl
                           flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 lg:w-6 lg:h-6">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
          <span className="text-lg lg:text-xl font-bold text-[#C41824] whitespace-nowrap">
      متجر المهندس
          </span>
        </Link>

        {/* ===== روابط سطح المكتب ===== */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none">
        {navLinks.map((link) => (
  <li key={link.label}>
    {link.type === 'phone' ? (
      <a
        href={link.href}
        className="font-medium text-[15px] xl:text-base transition-colors duration-200
                   whitespace-nowrap text-slate-700 hover:text-[#C41824]"
      >
        {link.label}
      </a>
    ) : (
      <Link
        to={link.href}
        className="font-medium text-[15px] xl:text-base transition-colors duration-200
                   whitespace-nowrap text-slate-700 hover:text-[#C41824]"
      >
        {link.label}
      </Link>
    )}
  </li>
))}
        </ul>

        {/* ===== أدوات اليمين (سطح المكتب) ===== */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">

          {/* زر البحث */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg
                       text-slate-600 hover:text-[#C41824] hover:bg-red-50 transition-colors"
            aria-label="بحث"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>

          {/* زر السلة مع العدّاد */}
          <Link
            to="/cart"
            className="relative w-10 h-10 flex items-center justify-center rounded-lg
                       text-slate-600 hover:text-[#C41824] hover:bg-red-50 transition-colors"
            aria-label="عربة التسوق"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                               bg-[#C41824] text-white text-[10px] font-bold rounded-full
                               flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* إذا كان مسجل دخول */}
          {token ? (
            <div className="relative">
              {/* زر المستخدم */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-full
                           bg-slate-100 hover:bg-red-50 transition-colors"
              >
                <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                  {user?.first_name || 'حسابي'}
                </span>
                <span className="w-8 h-8 rounded-full bg-[#C41824] text-white text-sm font-bold
                                 flex items-center justify-center">
                  {(user?.first_name?.[0] || 'U').toUpperCase()}
                </span>
              </button>

              {/* قائمة المستخدم المنسدلة */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />

                  <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-200
                                  rounded-xl shadow-lg shadow-slate-200/50 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <ul className="py-1 list-none">
                      <li>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700
                                     hover:bg-red-50 hover:text-[#C41824] transition-colors"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          الملف الشخصي
                        </Link>
                      </li>
                    </ul>

                    <div className="border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#C41824]
                                   hover:bg-red-50 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* غير مسجل دخول */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700
                           hover:text-[#C41824] hover:bg-red-50 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/signup"
                className="bg-[#C41824] text-white px-5 py-2.5 rounded-lg font-semibold text-sm
                           hover:bg-[#A01420] hover:-translate-y-0.5 hover:shadow-lg
                           hover:shadow-red-700/25 transition-all duration-300"
              >
                أنشئ حساباً
              </Link>
            </div>
          )}
        </div>

        {/* ===== أزرار الجوال ===== */}
        <div className="lg:hidden flex items-center gap-1">
          {/* السلة */}
          <Link
            to="/cart"
            className="relative w-10 h-10 flex items-center justify-center rounded-lg
                       text-slate-600 hover:text-[#C41824] hover:bg-red-50 transition-colors"
            aria-label="عربة التسوق"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                               bg-[#C41824] text-white text-[10px] font-bold rounded-full
                               flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* زر القائمة */}
          <button
            className="w-10 h-10 flex items-center justify-center text-slate-700
                       hover:text-[#C41824] hover:bg-red-50 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="تبديل القائمة"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ===== قائمة الجوال ===== */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white
                    border-t border-slate-100 ${
                      menuOpen ? 'max-h-[calc(100vh-64px)] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'
                    }`}
      >
        <ul className="flex flex-col list-none px-4 sm:px-6 py-4 gap-1">

          {/* روابط */}
          {navLinks.map((link) => (
  <li key={link.label}>
    {link.type === 'phone' ? (
      <a
        href={link.href}
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-slate-700
                   hover:bg-red-50 hover:text-[#C41824] transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        {link.label}
      </a>
    ) : (
      <Link
        to={link.href}
        onClick={() => setMenuOpen(false)}
        className="block py-3 px-4 rounded-lg font-medium text-slate-700
                   hover:bg-red-50 hover:text-[#C41824] transition-colors"
      >
        {link.label}
      </Link>
    )}
  </li>
))}

          <li className="my-2 border-t border-slate-100" />

          {/* إذا كان مسجل دخول */}
          {token ? (
            <>
              {/* بطاقة المستخدم */}
              <li className="px-4 py-3 bg-slate-50 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#C41824] text-white text-sm font-bold
                                   flex items-center justify-center">
                    {(user?.first_name?.[0] || 'U').toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </li>

              <li>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-slate-700
                             hover:bg-red-50 hover:text-[#C41824] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  الملف الشخصي
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-slate-700
                             hover:bg-red-50 hover:text-[#C41824] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                  طلباتي
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-slate-700
                             hover:bg-red-50 hover:text-[#C41824] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  المفضلة
                </Link>
              </li>

              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg font-semibold
                               text-[#C41824] bg-red-50 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    لوحة التحكم
                  </Link>
                </li>
              )}

              <li className="mt-2 px-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 text-[#C41824] py-3 rounded-lg font-semibold
                             hover:bg-red-100 transition-colors"
                >
                  تسجيل الخروج
                </button>
              </li>
            </>
          ) : (
            /* غير مسجل دخول */
            <li className="px-4 pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center border border-slate-200 text-slate-700
                           py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-[#C41824] text-white py-3 rounded-lg
                           font-semibold hover:bg-[#A01420] transition-colors"
              >
                أنشئ حساباً جديداً
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;