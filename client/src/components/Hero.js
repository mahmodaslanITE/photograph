import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const stats = [
    { value: '+50K', label: 'عميل سعيد' },
    { value: '+10K', label: 'منتج متنوع' },
    { value: '24h', label: 'توصيل سريع' },
  ];

  const trustBadges = [
    { icon: '🚚', text: 'شحن مجاني +200 ر.س' },
    { icon: '↩️', text: 'إرجاع مجاني 14 يوم' },
    { icon: '🔒', text: 'دفع آمن 100%' },
  ];

  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* زخارف خلفية */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ===== النص ===== */}
          <div className="text-center lg:text-right order-2 lg:order-1">

            {/* شارة علوية */}
            <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 rounded-full
                            px-4 py-1.5 mb-5 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-indigo-700 font-semibold text-xs sm:text-sm">
                عروض حصرية حتى 50% — لفترة محدودة
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-800 leading-tight mb-5">
              تسوّق بأسلوبك،
              <span className="block text-transparent bg-clip-text bg-gradient-to-l from-indigo-700 to-purple-700">
                واستلم بأسرع وقت
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              اكتشف آلاف المنتجات الأصلية بأفضل الأسعار — إلكترونيات، أزياء، منزل، والمزيد.
              توصيل سريع خلال 24 ساعة، وإرجاع مجاني خلال 14 يوم.
            </p>

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 justify-center lg:justify-start">
              <Link
                to="/products"
                className="w-full sm:w-auto bg-indigo-700 text-white px-6 sm:px-8 py-3.5 rounded-lg
                           font-semibold text-sm sm:text-base
                           hover:bg-indigo-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-700/30
                           transition-all duration-300
                           flex items-center justify-center gap-2"
              >
                <span>تسوّق الآن</span>
                <span>←</span>
              </Link>

              <Link
                to="/deals"
                className="w-full sm:w-auto text-indigo-700 border-2 border-indigo-700 px-6 sm:px-8 py-3
                           rounded-lg font-semibold text-sm sm:text-base
                           hover:bg-indigo-700 hover:text-white transition-colors duration-200
                           flex items-center justify-center gap-2"
              >
                <span>🎁</span>
                <span>العروض الحالية</span>
              </Link>
            </div>

            {/* شارات الثقة */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 justify-center lg:justify-start">
              {trustBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur border border-slate-200
                             rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-700"
                >
                  <span>{badge.icon}</span>
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0 pt-6 border-t border-slate-200">
              {stats.map((stat, i) => (
                <div key={i} className="text-center lg:text-right">
                  <h3 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== الصورة ===== */}
          <div className="relative order-1 lg:order-2 max-w-md sm:max-w-lg lg:max-w-none mx-auto w-full">

            {/* بطاقة عائمة - خصم */}
            <div className="absolute -top-4 -right-2 sm:top-6 sm:right-6 z-10 bg-white rounded-2xl
                            px-4 py-3 shadow-xl shadow-indigo-200/50 border border-indigo-100
                            flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-100 text-red-600 text-xl
                               flex items-center justify-center font-bold">%</span>
              <div className="text-right">
                <p className="text-xs text-slate-500">خصم حتى</p>
                <p className="text-lg font-bold text-slate-800">50%</p>
              </div>
            </div>

            {/* بطاقة عائمة - توصيل */}
            <div className="absolute -bottom-4 -left-2 sm:bottom-6 sm:left-6 z-10 bg-white rounded-2xl
                            px-4 py-3 shadow-xl shadow-indigo-200/50 border border-indigo-100
                            flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-green-100 text-green-600 text-xl
                               flex items-center justify-center">🚚</span>
              <div className="text-right">
                <p className="text-xs text-slate-500">توصيل</p>
                <p className="text-sm font-bold text-slate-800">خلال 24 ساعة</p>
              </div>
            </div>

            {/* الصورة الرئيسية */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-200/50
                            aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5] bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
                alt="تسوّق في متجر الأناقة"
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* تدرج خفيف */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;