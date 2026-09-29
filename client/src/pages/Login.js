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

  // ====== تغييرات الحقول ======
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });

    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (serverError) setServerError("");
  };

  // ====== التحقق من المدخلات ======
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

  // ====== ترجمة أخطاء الخادم ======
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
      return "تعذّر الاتصال بالخادم. تأكد من تشغيله على المنفذ 4999.";

    return "حدث خطأ غير متوقّع. حاول مرة أخرى.";
  };

  // ====== إرسال النموذج ======
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

      // ===== نجاح =====
      setSuccessMessage("تم تسجيل الدخول بنجاح! جاري تحويلك...");

      // حفظ token حسب "تذكرني"
      if (data.data?.token) {
        const storage = form.remember ? localStorage : sessionStorage;
        storage.setItem("token", data.data.token);
        storage.setItem("user", JSON.stringify(data.data.profile || {}));
      }
      // اقرأ ما هو مخزّن بالضبط
      console.log("Token:", sessionStorage.getItem("token"));
      console.log("User:", sessionStorage.getItem("user"));

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

      {/* ===== الجانب البصري (يمين) — يظهر على lg فقط ===== */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 p-12 flex-col justify-between overflow-hidden">

        {/* زخارف خلفية */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* الشعار */}
        <Link to="/" className="relative flex items-center gap-3 w-fit">
          <span className="w-11 h-11 bg-white text-indigo-700 rounded-xl flex items-center justify-center text-2xl font-bold">
            🛍️
          </span>
          <span className="text-2xl font-bold text-white">متجر الأناقة</span>
        </Link>

        {/* الرسالة */}
        <div className="relative text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            مرحباً بعودتك 👋
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8">
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
                <span className="w-6 h-6 rounded-full bg-indigo-400/30 border border-indigo-300/50 flex items-center justify-center text-sm">
                  ✓
                </span>
                <span className="text-indigo-50">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-indigo-200/70 text-sm">
          © 2026 متجر الأناقة. جميع الحقوق محفوظة.
        </p>
      </div>

      {/* ===== الجانب الأيسر — النموذج ===== */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">

          {/* شعار يظهر على الجوال */}
          <Link to="/" className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <span className="w-10 h-10 bg-indigo-700 text-white rounded-xl flex items-center justify-center text-xl font-bold">
              🛍️
            </span>
            <span className="text-xl font-bold text-indigo-700">متجر الأناقة</span>
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
                <span className="text-lg shrink-0">✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* رسالة خطأ الخادم */}
            {serverError && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <span className="text-lg shrink-0">⚠</span>
                <span>{serverError}</span>
              </div>
            )}

            {/* البريد */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 pointer-events-none">
                  ✉️
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
                               : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-100"}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* كلمة المرور */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 pointer-events-none">
                  🔒
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
                               : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-100"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 hover:text-indigo-700 transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.password}
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
                  className="w-4 h-4 rounded border-slate-300 accent-indigo-700 focus:ring-indigo-500 cursor-pointer"
                />
                تذكرني
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-indigo-700 font-medium hover:text-indigo-800 hover:underline transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={loading || !!successMessage}
              className="w-full bg-indigo-700 text-white py-3.5 rounded-xl font-semibold text-sm sm:text-base
                         hover:bg-indigo-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-700/30
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
                           hover:border-indigo-400 hover:bg-indigo-50 hover:-translate-y-0.5 
                           transition-all duration-200"
              >
                <span>🌐</span> Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white 
                           text-slate-700 text-sm font-medium
                           hover:border-indigo-400 hover:bg-indigo-50 hover:-translate-y-0.5 
                           transition-all duration-200"
              >
                <span>📘</span> Facebook
              </button>
            </div>

            {/* رابط التسجيل */}
            <p className="text-center text-sm text-slate-500 mt-6">
              ليس لديك حساب؟{" "}
              <Link
                to="/signup"
                className="text-indigo-700 font-semibold hover:text-indigo-800 hover:underline transition-colors"
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