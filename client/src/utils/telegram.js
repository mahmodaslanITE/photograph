// client/src/utils/telegram.js

// ⚙️ غيّر هذا إلى username حسابك على تليجرام (بدون @)
export const TELEGRAM_USERNAME = 'my_store_bot';

// ⚙️ رقم واتساب بصيغة دولية (بدون + أو مسافات)
// مثال: 963999000000
export const WHATSAPP_NUMBER = '963999000000';

/**
 * الرسالة الموحّدة للمنتج
 */
const buildProductMessage = (product) => {
  const productId = product._id || product.id;

  return `🛍️ مرحباً، أريد طلب هذا المنتج:

📦 المنتج: ${product.name}
💰 السعر: ${product.price?.toLocaleString()} ر.س${
    product.oldPrice && product.oldPrice > product.price
      ? `\n🎁 قبل الخصم: ${product.oldPrice.toLocaleString()} ر.س`
      : ''
  }
📂 الفئة: ${product.category || 'عام'}

🔗 معرف المنتج: ${productId}

من فضلك أرسل لي تفاصيل الدفع والتوصيل 🙏`;
};

/**
 * رابط تليجرام مع الرسالة
 */
export const buildTelegramLink = (product) => {
  const message = buildProductMessage(product);
  const encodedText = encodeURIComponent(message);
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodedText}`;
};

/**
 * رابط واتساب مع الرسالة
 */
export const buildWhatsAppLink = (product) => {
  const message = buildProductMessage(product);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
};