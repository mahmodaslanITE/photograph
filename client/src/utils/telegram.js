// src/utils/telegram.js

// ⚙️ غيّر هذا إلى username حسابك أو bot
export const TELEGRAM_USERNAME = '+963931633930'; // بدون @

// رابط واتساب للاستخدام لاحقاً (اختياري)
export const WHATSAPP_NUMBER = '963999000000';

/**
 * إنشاء رابط تليجرام مع رسالة تحتوي تفاصيل المنتج
 */
export const buildTelegramLink = (product) => {
  const productId = product._id || product.id;

  // 📝 الرسالة الثابتة
  const message = `🛍️ مرحباً، أريد طلب هذا المنتج:

📦 المنتج: ${product.name}
💰 السعر: ${product.price?.toLocaleString()} ر.س${product.oldPrice ? `\n🎁 قبل الخصم: ${product.oldPrice.toLocaleString()} ر.س` : ''}
📂 الفئة: ${product.category || 'عام'}

🔗 معرف المنتج: ${productId}

من فضلك أرسل لي تفاصيل الدفع والتوصيل 🙏`;

  // ترميز الرسالة
  const encodedText = encodeURIComponent(message);

  // ✅ الصيغة الأفضل: t.me/username?text=...
  // ملاحظة: هذا الرابط يعمل مع المستخدمين، وليس مع البوتات (Bot يتطلب start=)
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodedText}`;
};

/**
 * رابط واتساب (بديل أو إضافي)
 */
export const buildWhatsAppLink = (product) => {
  const productId = product._id || product.id;
  const message = `مرحباً، أريد طلب: ${product.name} - السعر ${product.price} ر.س - معرف: ${productId}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};