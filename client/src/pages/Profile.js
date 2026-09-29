import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const token =
          localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'فشل جلب البيانات');
        }

        setUser(data.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.message || 'تعذّر الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const isAdmin = user?.isAdmin === true || user?.role === 'admin';

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* العنوان */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              الملف الشخصي
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              معلومات حسابك وإعداداتك.
            </p>
          </div>

          {/* تحميل */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-red-100 border-t-[#C41824] rounded-full animate-spin" />
              <p className="text-slate-500 mt-4">جاري التحميل...</p>
            </div>
          )}

          {/* خطأ */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-[#C41824]">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <p className="text-red-700 font-medium mb-2">تعذّر تحميل البيانات</p>
              <p className="text-red-600 text-sm">{error}</p>
              <Link
                to="/login"
                className="inline-block mt-4 bg-[#C41824] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#A01420] transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          )}

          {/* البيانات */}
          {!loading && user && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* بطاقة المستخدم */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                  {/* الصورة الرمزية */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#C41824]
                                  flex items-center justify-center text-white text-3xl font-bold">
                    {(user.first_name?.[0] || 'U').toUpperCase()}
                  </div>

                  {/* الاسم */}
                  <h2 className="text-xl font-bold text-slate-800 mb-1">
                    {user.first_name} {user.last_name}
                  </h2>

                  {/* البريد */}
                  <p className="text-slate-500 text-sm mb-4">{user.email}</p>

                  {/* الصلاحية */}
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1.5 bg-red-50 text-[#C41824]
                                     text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      مسؤول (Admin)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600
                                     text-xs font-semibold px-3 py-1.5 rounded-full">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      مستخدم
                    </span>
                  )}
                </div>
              </div>

              {/* التفاصيل */}
              <div className="lg:col-span-2 space-y-6">

                {/* معلومات الحساب */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#C41824]">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    </svg>
                    معلومات الحساب
                  </h3>

                  <div className="space-y-3">
                    <InfoRow label="الاسم الأول" value={user.first_name || '—'} />
                    <InfoRow label="اسم العائلة" value={user.last_name || '—'} />
                    <InfoRow label="البريد الإلكتروني" value={user.email || '—'} />
                    <InfoRow
                      label="نوع الحساب"
                      value={isAdmin ? 'مسؤول' : 'مستخدم عادي'}
                    />
                    <InfoRow
                      label="تاريخ التسجيل"
                      value={
                        user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('ar-EG')
                          : '—'
                      }
                    />
                  </div>
                </div>

                {/* الإجراءات */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#C41824]">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    الإجراءات
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {isAdmin && (
                      <Link
                        to="/products"
                        className="flex-1 text-center inline-flex items-center justify-center gap-2
                                   bg-[#C41824] text-white py-3 rounded-lg
                                   font-semibold text-sm hover:bg-[#A01420] transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        لوحة التحكم
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-red-50 text-[#C41824] border border-red-200 py-3 rounded-lg
                                 font-semibold text-sm hover:bg-red-100 transition-colors
                                 inline-flex items-center justify-center gap-2"
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
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// مكوّن صف المعلومات
const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-800" dir="auto">
      {value}
    </span>
  </div>
);

export default Profile;