import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (serverError) setServerError("");
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, text: "", color: "" };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: 33, text: "ضعيفة", color: "bg-red-500" };
    if (score <= 3) return { level: 66, text: "متوسطة", color: "bg-amber-500" };
    return { level: 100, text: "قوية", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const newErrors = {};

    if (!form.first_name.trim()) newErrors.first_name = "الاسم الأول مطلوب";
    if (!form.last_name.trim()) newErrors.last_name = "اسم العائلة مطلوب";

    if (!form.email) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "البريد الإلكتروني غير صحيح";

    if (!form.password) newErrors.password = "كلمة المرور مطلوبة";
    else if (form.password.length < 6)
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";

    if (!form.confirm_password)
      newErrors.confirm_password = "تأكيد كلمة المرور مطلوب";
    else if (form.password !== form.confirm_password)
      newErrors.confirm_password = "كلمتا المرور غير متطابقتين";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    setTermsError("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!agreeTerms) {
      setTermsError("يجب الموافقة على الشروط والأحكام");
      return;
    }

    setLoading(true);

    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };
    const API_URL = `${process.env.REACT_APP_API_URL}/auth/register`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || "حدث خطأ");
        return;
      }

      setSuccessMessage("تم إنشاء حسابك بنجاح! جاري تحويلك للمتجر...");

      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
      }

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });

      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      setServerError("تعذّر الاتصال بالخادم. تأكد من تشغيله على المنفذ 4998.");
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
          <span className="text-2xl font-bold text-white">متجر الأناقة</span>
        </Link>

        {/* الرسالة */}
        <div className="relative text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            تسوّق بذكاء، استلم بسرعة
          </h2>
          <p className="text-red-100 text-lg leading-relaxed mb-8">
            انضم إلى أكثر من 50,000 عميل يثقون بمتجر الأناقة لأفضل المنتجات وأسرع توصيل.
          </p>

          <ul className="space-y-4">
            {[
              "شحن مجاني للطلبات فوق 200 ر.س",
              "إرجاع مجاني خلال 14 يوم",
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
          © 2026 متجر الأناقة. جميع الحقوق محفوظة.
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
            <span className="text-xl font-bold text-[#C41824]">متجر الأناقة</span>
          </Link>

          {/* العنوان */}
          <div className="text-center lg:text-right mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
              أنشئ حسابك الجديد
            </h1>
            <p className="text-slate-500 text-sm sm:text-base">
              انضم إلينا في دقيقة واحدة وابدأ التسوق فوراً.
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

            {/* الاسم الأول */}
            <div className="mb-4">
              <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-2">
                الاسم الأول <span className="text-[#C41824]">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="مثال: أحمد"
                  className={`w-full bg-white border rounded-xl py-3 pr-12 pl-4 text-sm sm:text-base text-slate-800 placeholder-slate-400
                             focus:outline-none focus:ring-4 transition-all duration-200
                             ${errors.first_name
                               ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                               : "border-slate-200 focus:border-[#C41824] focus:ring-red-100"}`}
                />
              </div>
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {errors.first_name}
                </p>
              )}
            </div>

            {/* اسم العائلة */}
            <div className="mb-4">
              <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-2">
                اسم العائلة <span className="text-[#C41824]">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="مثال: محمد"
                  className={`w-full bg-white border rounded-xl py-3 pr-12 pl-4 text-sm sm:text-base text-slate-800 placeholder-slate-400
                             focus:outline-none focus:ring-4 transition-all duration-200
                             ${errors.last_name
                               ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                               : "border-slate-200 focus:border-[#C41824] focus:ring-red-100"}`}
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {errors.last_name}
                </p>
              )}
            </div>

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

            {/* مؤشر قوة كلمة المرور */}
            {form.password && (
              <div className="mb-4">
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${strength.level}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  قوة كلمة المرور:{" "}
                  <span className="font-semibold">{strength.text}</span>
                </p>
              </div>
            )}

            {/* تأكيد كلمة المرور */}
            <div className="mb-4">
              <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-700 mb-2">
                تأكيد كلمة المرور <span className="text-[#C41824]">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-white border rounded-xl py-3 pr-12 pl-12 text-sm sm:text-base text-slate-800 placeholder-slate-400
                             focus:outline-none focus:ring-4 transition-all duration-200
                             ${errors.confirm_password
                               ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                               : "border-slate-200 focus:border-[#C41824] focus:ring-red-100"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 hover:text-[#C41824] transition-colors"
                >
                  {showConfirm ? (
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
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {errors.confirm_password}
                </p>
              )}
            </div>

            {/* الموافقة على الشروط */}
            <div className="mb-5">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (termsError) setTermsError("");
                  }}
                  className="mt-0.5 w-4 h-4 accent-[#C41824] cursor-pointer"
                />
                <span className="text-sm text-slate-600 leading-relaxed">
                  أوافق على{" "}
                  <Link to="/terms" className="text-[#C41824] font-medium hover:underline">
                    الشروط والأحكام
                  </Link>{" "}
                  و{" "}
                  <Link to="/privacy" className="text-[#C41824] font-medium hover:underline">
                    سياسة الخصوصية
                  </Link>
                </span>
              </label>
              {termsError && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {termsError}
                </p>
              )}
            </div>

            {/* زر الإنشاء */}
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
                  جاري إنشاء الحساب...
                </>
              ) : (
                "إنشاء الحساب"
              )}
            </button>

            {/* رابط تسجيل الدخول */}
            <p className="text-center text-sm text-slate-500 mt-6">
              لديك حساب بالفعل؟{" "}
              <Link
                to="/login"
                className="text-[#C41824] font-semibold hover:text-[#A01420] hover:underline transition-colors"
              >
                سجّل الدخول
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;