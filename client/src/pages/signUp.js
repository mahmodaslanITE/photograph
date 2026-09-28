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

  // ====== تغييرات الحقول ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (serverError) setServerError("");
  };

  // ====== قوة كلمة المرور ======
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

  // ====== التحقق من المدخلات ======
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

  // ====== إرسال النموذج ======
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

    // ✅ التحقق من الموافقة على الشروط
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
    const API_URL = `${import.meta.env.VITE_API_URL}/products`;

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
      setServerError("تعذّر الاتصال بالخادم. تأكد من تشغيله على المنفذ 4999.");
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
            تسوّق بذكاء، استلم بسرعة
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8">
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

            {/* الاسم الأول */}
            <div className="mb-4">
              <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-2">
                الاسم الأول <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 pointer-events-none">
                  👤
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
                               : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-100"}`}
                />
              </div>
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.first_name}
                </p>
              )}
            </div>

            {/* اسم العائلة */}
            <div className="mb-4">
              <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-2">
                اسم العائلة <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 pointer-events-none">
                  👤
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
                               : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-100"}`}
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.last_name}
                </p>
              )}
            </div>

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
                تأكيد كلمة المرور <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 pointer-events-none">
                  🔒
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
                               : "border-slate-200 focus:border-indigo-600 focus:ring-indigo-100"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 hover:text-indigo-700 transition-colors"
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.confirm_password}
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
                  className="mt-0.5 w-4 h-4 accent-indigo-700 cursor-pointer"
                />
                <span className="text-sm text-slate-600 leading-relaxed">
                  أوافق على{" "}
                  <Link to="/terms" className="text-indigo-700 font-medium hover:underline">
                    الشروط والأحكام
                  </Link>{" "}
                  و{" "}
                  <Link to="/privacy" className="text-indigo-700 font-medium hover:underline">
                    سياسة الخصوصية
                  </Link>
                </span>
              </label>
              {termsError && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {termsError}
                </p>
              )}
            </div>

            {/* زر الإنشاء */}
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
                className="text-indigo-700 font-semibold hover:text-indigo-800 hover:underline transition-colors"
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