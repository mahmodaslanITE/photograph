import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const quickLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'المنتجات', href: '/products' },
    { label: 'العروض', href: '/deals' },
    { label: 'من نحن', href: '/about' },
  ];

  const customerService = [
    { label: 'تتبع طلبي', href: '/track-order' },
    { label: 'سياسة الإرجاع', href: '/returns' },
    { label: 'الشحن والتوصيل', href: '/shipping' },
    { label: 'الأسئلة الشائعة', href: '/faq' },
  ];

  const contactInfo = [
    { text: '+963 999 000 000', href: 'tel:+963999000000', dir: 'ltr' },
    { text: 'info@elegance-store.com', href: 'mailto:info@elegance-store.com', dir: 'ltr' },
    { text: 'دمشق، سوريا', href: null },
  ];

  const socialLinks = [
    {
      label: 'تويتر',
      href: '#',
      path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    },
    {
      label: 'فيسبوك',
      href: '#',
      path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
    },
    {
      label: 'إنستغرام',
      href: '#',
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    },
    {
      label: 'واتساب',
      href: '#',
      path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
    },
  ];

  const paymentMethods = ['Visa', 'MasterCard', 'PayPal', 'Apple Pay', 'Google Pay'];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
<footer className="bg-gradient-to-br from-[#2d0a10] via-[#1a0a0c] to-[#0f0507] text-slate-300 pt-16 pb-0">
      {/* ===== قسم النشرة البريدية ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-14">
        <div className="bg-gradient-to-l from-[#C41824] to-[#8a0f18] rounded-2xl p-6 sm:p-8 lg:p-10
                        relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="text-center lg:text-right text-white">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                اشترك في نشرتنا البريدية
              </h3>
              <p className="text-red-100 text-sm sm:text-base">
                كن أول من يعرف عن العروض والمنتجات الجديدة. خصم 10% على أول طلب.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full">
              {subscribed ? (
                <div className="flex items-center justify-center gap-3 bg-green-500/20 border border-green-400/30
                                rounded-xl px-6 py-4 text-green-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">
                    تم الاشتراك بنجاح. تفقّد بريدك للحصول على كود الخصم.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                    className="flex-1 bg-white/10 backdrop-blur border border-white/20 rounded-xl
                               py-3.5 px-4 text-white placeholder-red-200
                               focus:outline-none focus:border-white/50 focus:bg-white/15
                               transition-all text-sm sm:text-base"
                  />
                  <button
                    type="submit"
                    className="bg-white text-[#C41824] px-6 py-3.5 rounded-xl font-semibold
                               text-sm sm:text-base whitespace-nowrap
                               hover:bg-red-50 hover:-translate-y-0.5 hover:shadow-lg
                               transition-all duration-300"
                  >
                    اشترك الآن
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ===== الشبكة الرئيسية ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 sm:pb-14">

          {/* عمود 1: الشعار والوصف */}
          <div className="sm:col-span-2 lg:col-span-4 text-center sm:text-right">
            <Link to="/" className="flex items-center gap-3 justify-center sm:justify-start mb-4 w-fit mx-auto sm:mx-0">
              <span className="w-10 h-10 bg-[#C41824] text-white rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </span>
              <span className="text-xl font-bold text-white">متجر بلوتو</span>
            </Link>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 max-w-sm mx-auto sm:mx-0">
              متجرك الموثوق للمنتجات الأصلية بأفضل الأسعار. نوصّل إليك أينما كنت،
              مع ضمان الجودة والإرجاع المجاني.
            </p>

            <div className="flex gap-3 justify-center sm:justify-start">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400
                             hover:bg-[#C41824] hover:text-white hover:border-[#C41824] transition-colors duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* عمود 2: روابط سريعة */}
          <div className="lg:col-span-2 text-center sm:text-right">
            <h4 className="text-white font-semibold text-base mb-5">
              روابط سريعة
            </h4>
            <ul className="flex flex-col gap-3 list-none">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-slate-400 text-sm hover:text-[#C41824] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* عمود 3: خدمة العملاء */}
          <div className="lg:col-span-2 text-center sm:text-right">
            <h4 className="text-white font-semibold text-base mb-5">
              خدمة العملاء
            </h4>
            <ul className="flex flex-col gap-3 list-none">
              {customerService.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-slate-400 text-sm hover:text-[#C41824] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* عمود 4: تواصل معنا */}
          <div className="lg:col-span-2 text-center sm:text-right">
            <h4 className="text-white font-semibold text-base mb-5">
              تواصل معنا
            </h4>
            <ul className="flex flex-col gap-3 list-none">
              {contactInfo.map((item, i) => (
                <li key={i}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-slate-400 text-sm hover:text-[#C41824] transition-colors duration-200"
                    >
                      <span dir={item.dir || 'auto'}>{item.text}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* عمود 5: طرق الدفع */}
          <div className="lg:col-span-2 text-center sm:text-right">
            <h4 className="text-white font-semibold text-base mb-5">
              طرق الدفع
            </h4>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {paymentMethods.map((method, i) => (
                <span
                  key={i}
                  className="bg-slate-800 border border-slate-700 text-slate-300
                             text-xs font-medium px-3 py-1.5 rounded-md"
                >
                  {method}
                </span>
              ))}
            </div>

            <h4 className="text-white font-semibold text-base mt-6 mb-4">
              معلومة الشحن
            </h4>
            <div className="flex items-center gap-2 justify-center sm:justify-start text-sm text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>شحن مجاني للطلبات فوق 200 ر.س</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== الشريط السفلي ===== */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <p className="text-slate-500 text-xs sm:text-sm">
              © 2026 متجر الأناقة. جميع الحقوق محفوظة.
            </p>
            <ul className="flex gap-5 text-xs sm:text-sm list-none">
              <li>
                <Link to="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-500 hover:text-slate-300 transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;