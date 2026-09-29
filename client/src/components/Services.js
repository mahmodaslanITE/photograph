import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'كاميرات احترافية',
    desc: 'كاميرات DSLR و Mirrorless من أفضل العلامات التجارية العالمية.',
    color: 'from-[#C41824] to-[#8a0f18]',
    bg: 'bg-red-50',
    text: 'text-[#C41824]',
    href: '/products?category=cameras',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7 sm:w-8 sm:h-8">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    title: 'عدسات وتلسكوبات',
    desc: 'عدسات بجميع الأطوال البؤرية لتصوير احترافي في كل الظروف.',
    color: 'from-[#C41824] to-[#8a0f18]',
    bg: 'bg-red-50',
    text: 'text-[#C41824]',
    href: '/products?category=lenses',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7 sm:w-8 sm:h-8">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: 'إضاءة واستوديو',
    desc: 'إضاءات احترافية، Softbox، وFlash لتصوير استوديو متكامل.',
    color: 'from-[#C41824] to-[#8a0f18]',
    bg: 'bg-red-50',
    text: 'text-[#C41824]',
    href: '/products?category=lighting',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7 sm:w-8 sm:h-8">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    ),
  },
  {
    title: 'معدات فيديو',
    desc: 'Gimbals، حوامل، وميكروفونات لتصوير فيديو سينمائي.',
    color: 'from-[#C41824] to-[#8a0f18]',
    bg: 'bg-red-50',
    text: 'text-[#C41824]',
    href: '/products?category=video',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7 sm:w-8 sm:h-8">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    title: 'حقائب وإكسسوارات',
    desc: 'حقائب حماية، بطاريات، وذاكرات بجميع الأحجام والماركات.',
    color: 'from-[#C41824] to-[#8a0f18]',
    bg: 'bg-red-50',
    text: 'text-[#C41824]',
    href: '/products?category=accessories',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7 sm:w-8 sm:h-8">
        <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M10 7V5h4v2" />
      </svg>
    ),
  },
  {
    title: 'معدات المونتاج',
    desc: 'شاشات معايرة، أجهزة قوية، وبرامج مونتاج احترافية.',
    color: 'from-[#C41824] to-[#8a0f18]',
    bg: 'bg-red-50',
    text: 'text-[#C41824]',
    href: '/products?category=editing',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7 sm:w-8 sm:h-8">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

const Services = () => {
  return (
    <section id="services" className="relative py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* رأس القسم */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block bg-red-50 text-[#C41824] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4">
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
                         hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/10
                         hover:border-[#C41824]"
            >
              {/* شريط علوي ملون عند hover */}
              <div
                className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${s.color}
                            rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* الأيقونة */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 ${s.bg} ${s.text} rounded-2xl
                            flex items-center justify-center
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* زر عرض الكل */}
        <div className="text-center mt-12 sm:mt-14">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#C41824] text-white px-6 sm:px-8 py-3.5
                       rounded-xl font-semibold text-sm sm:text-base
                       hover:bg-[#A01420] hover:-translate-y-0.5
                       hover:shadow-lg hover:shadow-red-700/30
                       transition-all duration-300"
          >
            <span>تصفّح كل المنتجات</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;