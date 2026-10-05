import React, { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = `${process.env.REACT_APP_API_URL}/auth/login`;

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });

    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (serverError) setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "البريد الإلكتروني غير صحيح";

    if (!form.password) newErrors.password = "كلمة المرور مطلوبة";
    else if (form.password.length < 6)
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";

    return newErrors;
  };

  const translateServerError = (err) => {
    const status = err?.response?.status;
    const message = err?.response?.data?.message;

    if (message) {
      const map = {
        "Invalid credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        "User not found": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        "Wrong password": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      };
      return map[message] || message;
    }

    if (status === 401) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    if (status === 400) return "بيانات غير صحيحة. تأكد من المدخلات.";
    if (status === 500) return "حدث خطأ في الخادم. حاول لاحقاً.";
    if (err?.message === "Network Error")
      return "تعذّر الاتصال بالخادم. تأكد من تشغيله على المنفذ 4998.";

    return "حدث خطأ غير متوقّع. حاول مرة أخرى.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const err = new Error(data.message || "خطأ");
        err.response = { status: response.status, data };
        throw err;
      }

      setSuccessMessage("تم تسجيل الدخول بنجاح! جاري تحويلك...");

      if (data.data?.token) {
        const storage = form.remember ? localStorage : sessionStorage;
        storage.setItem("token", data.data.token);
        storage.setItem("user", JSON.stringify(data.data.profile || {}));
      }

      setForm({ email: "", password: "", remember: false });

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      setServerError(translateServerError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">

      {/* ===== الجانب البصري (يمين) ===== */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-[#C41824] via-[#A01420] to-[#6b0a12] p-12 flex-col justify-between overflow-hidden">

        <div className="absolute top-0 right-0 w-96 h-96 bg-red-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* الشعار */}
        <Link to="/" className="relative flex items-center gap-3 w-fit">
          <span className="w-11 h-11 bg-white text-[#C41824] rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
          <span className="text-2xl font-bold text-white">متجر ITE</span>
        </Link>

        {/* الرسالة */}
        <div className="relative text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            مرحباً بعودتك
          </h2>
          <p className="text-red-100 text-lg leading-relaxed mb-8">
            سجّل دخولك لمتابعة طلباتك، وإدارة قائمتك المفضلة، والاستفادة من العروض الحصرية.
          </p>

          <ul className="space-y-4">
            {[
              "تتبع طلباتك ومشترياتك",
              "قائمة مفضلة محفوظة",
              "عروض وخصومات حصرية للأعضاء",
              "توصيل سريع خلال 24 ساعة",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-red-400/30 border border-red-300/50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="text-red-50">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-red-200/70 text-sm">
          © 2026 متجر ITE. جميع الحقوق محفوظة.
        </p>
      </div>

      {/* ===== الجانب الأيسر — النموذج ===== */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">

          {/* شعار الجوال */}
          <Link to="/" className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <span className="w-10 h-10 bg-[#C41824] text-white rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <span className="text-xl font-bold text-[#C41824]">متجر ITE</span>
          </Link>

          {/* العنوان */}
          <div className="text-center lg:text-right mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              أدخل بياناتك للمتابعة إلى حسابك.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-1" noValidate>

            {/* رسالة نجاح */}
            {successMessage && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* رسالة خطأ الخادم */}
            {serverError && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0 mt-0.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            {/* البريد */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                البريد الإلكتروني <span className="text-[#C41824]">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full bg-white border rounded-xl py-3 pr-12 pl-4 text-sm sm:text-base text-slate-800 placeholder-slate-400
                             focus:outline-none focus:ring-4 transition-all duration-200
                             ${errors.email
                               ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                               : "border-slate-200 focus:border-[#C41824] focus:ring-red-100"}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* كلمة المرور */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                كلمة المرور <span className="text-[#C41824]">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-white border rounded-xl py-3 pr-12 pl-12 text-sm sm:text-base text-slate-800 placeholder-slate-400
                             focus:outline-none focus:ring-4 transition-all duration-200
                             ${errors.password
                               ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                               : "border-slate-200 focus:border-[#C41824] focus:ring-red-100"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 hover:text-[#C41824] transition-colors"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* تذكرني + نسيت كلمة المرور */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-2 pb-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 accent-[#C41824] focus:ring-red-500 cursor-pointer"
                />
                تذكرني
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-[#C41824] font-medium hover:text-[#A01420] hover:underline transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading || !!successMessage}
              className="w-full bg-[#C41824] text-white py-3.5 rounded-xl font-semibold text-sm sm:text-base
                         hover:bg-[#A01420] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-700/30
                         active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                         transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </button>

            {/* فاصل */}
            <div className="relative flex items-center gap-4 py-6">
              <span className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">أو</span>
              <span className="flex-1 h-px bg-slate-200" />
            </div>

            {/* أزرار التواصل الاجتماعي */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white
                           text-slate-700 text-sm font-medium
                           hover:border-[#C41824] hover:bg-red-50 hover:-translate-y-0.5
                           transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white
                           text-slate-700 text-sm font-medium
                           hover:border-[#C41824] hover:bg-red-50 hover:-translate-y-0.5
                           transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* رابط التسجيل */}
            <p className="text-center text-sm text-slate-500 mt-6">
              ليس لديك حساب؟{" "}
              <Link
                to="/signup"
                className="text-[#C41824] font-semibold hover:text-[#A01420] hover:underline transition-colors"
              >
                أنشئ حساباً جديداً
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;