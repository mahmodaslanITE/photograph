import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: '📷',
    title: 'كاميرات احترافية',
    desc: 'كاميرات DSLR و Mirrorless من أفضل العلامات التجارية العالمية.',
    color: 'from-indigo-500 to-purple-500',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    href: '/products?category=cameras',
  },
  {
    icon: '🔭',
    title: 'عدسات وتلسكوبات',
    desc: 'عدسات بجميع الأطوال البؤرية لتصوير احترافي في كل الظروف.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    href: '/products?category=lenses',
  },
  {
    icon: '💡',
    title: 'إضاءة واستوديو',
    desc: 'إضاءات احترافية، Softbox، وFlash لتصوير استوديو متكامل.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    href: '/products?category=lighting',
  },
  {
    icon: '🎬',
    title: 'معدات فيديو',
    desc: 'Gimbals، حوامل، وميكروفونات لتصوير فيديو سينمائي.',
    color: 'from-red-500 to-rose-500',
    bg: 'bg-red-50',
    text: 'text-red-600',
    href: '/products?category=video',
  },
  {
    icon: '🎒',
    title: 'حقائب وإكسسوارات',
    desc: 'حقائب حماية، بطاريات، وذاكرات بجميع الأحجام والماركات.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    href: '/products?category=accessories',
  },
  {
    icon: '🖥️',
    title: 'معدات المونتاج',
    desc: 'شاشات معايرة، أجهزة قوية، وبرامج مونتاج احترافية.',
    color: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    href: '/products?category=editing',
  },
];

const Services = () => {
  return (
    <section id="services" className="relative py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* رأس القسم */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4">
            فئات المنتجات
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            كل ما يحتاجه المصوّر المحترف
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            من الكاميرا إلى الإضاءة، ومن العدسات إلى الإكسسوارات — تجد كل شيء في مكان واحد.
          </p>
        </div>

        {/* شبكة الفئات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {services.map((s, i) => (
            <Link
              key={i}
              to={s.href}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 lg:p-8 border border-slate-200 
                         transition-all duration-300 ease-out
                         hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-900/10 
                         hover:border-indigo-300"
            >
              {/* شريط علوي ملون عند hover */}
              <div
                className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${s.color} 
                            rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* الأيقونة */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 ${s.bg} rounded-2xl 
                            flex items-center justify-center text-2xl sm:text-3xl 
                            mb-5 transition-transform duration-300 
                            group-hover:scale-110 group-hover:rotate-3`}
              >
                {s.icon}
              </div>

              {/* العنوان */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">
                {s.title}
              </h3>

              {/* الوصف */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
                {s.desc}
              </p>

              {/* الرابط */}
              <span
                className={`inline-flex items-center gap-2 font-semibold text-sm sm:text-base 
                            ${s.text} transition-all duration-300 
                            group-hover:gap-3`}
              >
                <span>تصفّح القسم</span>
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* زر عرض الكل */}
        <div className="text-center mt-12 sm:mt-14">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-indigo-700 text-white px-6 sm:px-8 py-3.5 
                       rounded-xl font-semibold text-sm sm:text-base
                       hover:bg-indigo-800 hover:-translate-y-0.5 
                       hover:shadow-lg hover:shadow-indigo-700/30
                       transition-all duration-300"
          >
            <span>تصفّح كل المنتجات</span>
            <span>←</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;