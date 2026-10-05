import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'منتجات أصلية 100%',
    desc: 'وكلاء معتمدون لجميع العلامات التجارية: Canon، Nikon، Sony، DJI والمزيد.',
  },
  {
    title: 'شحن سريع ومؤمّن',
    desc: 'توصيل خلال 24-48 ساعة بتغليف احترافي يحمي معداتك الثمينة.',
  },
  {
    title: 'ضمان رسمي وإرجاع',
    desc: 'ضمان الوكيل الرسمي لجميع المنتجات، وإرجاع مجاني خلال 14 يوم.',
  },
  {
    title: 'دعم فني متخصص',
    desc: 'فريق من المصوّرين المحترفين يساعدك في اختيار المعدات المناسبة.',
  },
];

const WhyUs = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ===== الصورة ===== */}
          <div className="relative order-1 max-w-md sm:max-w-lg lg:max-w-none mx-auto w-full">

            {/* بطاقة عائمة: عدد العملاء */}
            <div className="absolute -top-3 -left-2 sm:top-4 sm:left-4 z-10
                            bg-white rounded-xl px-4 py-3 shadow-xl shadow-red-200/50
                            border border-red-100 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-red-50 text-[#C41824]
                               flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <div className="text-right">
                <p className="text-xs text-slate-500">عميل يثق بنا</p>
                <p className="text-base font-bold text-slate-800">+50,000</p>
              </div>
            </div>

            {/* بطاقة عائمة: التقييم */}
            <div className="absolute -bottom-3 -right-2 sm:bottom-4 sm:right-4 z-10
                            bg-white rounded-xl px-4 py-3 shadow-xl shadow-red-200/50
                            border border-red-100 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600
                               flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <div className="text-right">
                <p className="text-xs text-slate-500">تقييم العملاء</p>
                <p className="text-base font-bold text-slate-800">4.9 / 5</p>
              </div>
            </div>

            {/* الصورة الرئيسية */}
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"
              alt="معدات تصوير احترافية في متجر ITE"
              loading="lazy"
              className="w-full h-[340px] sm:h-[420px] lg:h-[500px] object-cover rounded-2xl shadow-xl shadow-slate-200"
            />
          </div>

          {/* ===== النص ===== */}
          <div className="order-2 text-center lg:text-right">
            <p className="text-[#C41824] font-semibold text-sm sm:text-base mb-4">
              لماذا نحن
            </p>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4 leading-tight">
              لماذا يختارنا المصوّرون؟
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              نلتزم بتقديم أفضل تجربة تسوّق لمعدات التصوير — من لحظة الاختيار
              حتى ما بعد الاستلام.
            </p>

            {/* قائمة المميزات */}
            <ul className="flex flex-col gap-6 list-none">
              {features.map((f, i) => (
                <li key={i} className="flex gap-4 items-start text-right">
                  {/* رقم */}
                  <span className="shrink-0 w-8 h-8 flex items-center justify-center text-sm font-semibold
                                   text-[#C41824] border border-red-200 rounded-full bg-red-50">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* المحتوى */}
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-1">
                      {f.title}
                    </h4>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* زر CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2
                           bg-[#C41824] text-white px-6 py-3.5 rounded-xl
                           font-semibold text-sm sm:text-base
                           hover:bg-[#A01420] hover:-translate-y-0.5
                           hover:shadow-lg hover:shadow-red-700/30
                           transition-all duration-300"
              >
                <span>ابدأ التسوق الآن</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2
                           text-[#C41824] border-2 border-[#C41824] px-6 py-3
                           rounded-xl font-semibold text-sm sm:text-base
                           hover:bg-[#C41824] hover:text-white transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>تحدث مع خبير</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;