
<div align="center">
  <img src="https://github.com/user-attachments/assets/8030f7a5-a95b-434f-b006-53270dbb2ef8" alt="VeloPay Logo" width="200"/>

  # 🚀 VeloPay
  **ثورة تحويل الأموال عبر الحدود بين الخليج وبلاد الشام**
  
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Solana-Devnet-14F195?logo=solana&logoColor=black" alt="Solana" />
  <img src="https://img.shields.io/badge/AI-Gemini_Pro-4285F4?logo=google" alt="Gemini AI" />
</div>

<br />

## 📖 نظرة عامة
**VeloPay** هي منصة ويب مالية (Fintech) مبتكرة تهدف إلى حل مشكلة الرسوم المرتفعة وبطء تحويل الأموال للعمالة الوافدة في الخليج التي ترسل أموالاً إلى الأردن، فلسطين، العراق، وسوريا. باستخدام تقنية **Solana Blockchain** وعملة **USDC** المستقرة، نحول العملية التي كانت تستغرق أياماً وتكلف الكثير، إلى عملية تتم في ثوانٍ معدودة وبرسوم شبه مجانية (0.01$).

---

## 📸 نظرة على المنصة

<div align="center">
  <img src="مسار_الصورة_الأولى_هنا" alt="الصفحة الرئيسية والحاسبة التفاعلية" width="800" style="border-radius: 10px; margin-bottom: 10px; border: 1px solid #eaeaea;"/>
  <p><em>الصفحة الرئيسية والمساعد الذكي VeloPay AI</em></p>

  <img src="مسار_الصورة_الثانية_هنا" alt="واجهة تتبع التحويل" width="800" style="border-radius: 10px; border: 1px solid #eaeaea;"/>
  <p><em>واجهة الإرسال وتتبع المعاملات اللحظي</em></p>
</div>

---

## ✨ المميزات الرئيسية

* ⚡ **سرعة فائقة:** وصول الأموال في غضون 3-5 ثوانٍ فقط.
* 💸 **رسوم شبه معدومة:** تكلفة التحويل 0.01$ فقط مقارنة بـ 15-35$ في الطرق التقليدية.
* 🤖 **مساعد ذكي مدمج (AI):** روبوت محادثة مدعوم بـ Gemini AI للإجابة على الاستفسارات، حساب الرسوم اللحظية، وتقديم نصائح مالية للمستخدمين.
* 🔑 **محافظ مدمجة (Embedded Wallets):** تجربة مستخدم سلسة لا تتطلب معرفة مسبقة بالعملات الرقمية عبر Crossmint.
* 📊 **شفافية تامة:** إمكانية تتبع مسار الأموال لحظة بلحظة عبر مستكشف Solana.

---

## 🔄 كيف يعمل النظام؟

تم تصميم تجربة المستخدم لتكون بسيطة ومألوفة، دون تعقيدات الـ Blockchain:

1. **الإرسال:** يقوم المرسل بإدخال المبلغ ورقم هاتف المستلم، ويدفع باستخدام بطاقته البنكية.
2. **التحويل الذكي:** يتم تحويل المبلغ برمجياً إلى USDC وإرساله عبر شبكة Solana فائقة السرعة.
3. **الاستلام المرن:** تصل الأموال للمستلم عبر خيارات متعددة:
   * **إشعار رسالة قصيرة (SMS)** لحسابه البنكي.
   * **إنشاء محفظة رقمية تلقائياً** مرتبطة برقم هاتفه.
   * **تحويل مباشر** إلى المحافظ المحلية الإلكترونية (مثل Zain Cash).

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

* **Framework:** Next.js 15 (App Router) & Turbopack
* **Blockchain:** Solana Devnet (USDC)
* **Wallets:** Crossmint Embedded Wallets
* **On/Off Ramp:** Transak (Sandbox)
* **AI Engine:** Google Gemini AI
* **Database & Auth:** Supabase & NextAuth.js
* **Styling:** Tailwind CSS + shadcn/ui

---

## 🚀 طريقة التشغيل (Getting Started)

### 1. تثبيت الحزم والمتطلبات
قم بتشغيل الأمر التالي في جذر المشروع:
```bash
npm i
```

### 2. إعداد متغيرات البيئة (.env.local)
قم بإنشاء ملف `.env.local` وأضف المتغيرات التالية:
```env
# Crossmint Config
NEXT_PUBLIC_CROSSMINT_PROJECT_ID=""
NEXT_PUBLIC_CROSSMINT_API_KEY=""
CROSSMINT_API_KEY=""

# Network Config
NEXT_PUBLIC_CHAIN_ID="solana"
NEXT_PUBLIC_USDC_MINT=""

# Transak Config (Sandbox)
NEXT_PUBLIC_TRANSAK_API_KEY=""
TRANSAK_API_SECRET=""

# AI & Data
GEMINI_API_KEY=""
NEXT_PUBLIC_COINGECKO_API="[https://api.coingecko.com/api/v3](https://api.coingecko.com/api/v3)"

# NextAuth Config
AUTH_SECRET=""
NEXTAUTH_SECRET="ضع_أي_نص_عشوائي_طويل_ومعقد_هنا"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Database & Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""
DATABASE_URL=""
DIRECT_URL=""
```

### 3. تشغيل خادم التطوير
```bash
npm run dev
```

---

## 🎯 ملاحظة (Hackathon MVP)
تم بناء هذه النسخة خصيصاً لأغراض الهاكاثون لتوضيح المعمارية وقابلية التطبيق. بعض العمليات (مثل التكامل المباشر مع شبكات الهاتف المحلية) تعمل حالياً ضمن بيئة محاكاة (Simulation) لإثبات المفهوم الهندسي.

<div align="center">
  <p>تم بناؤه بشغف 💡 لتسهيل حياة المغتربين وعائلاتهم.</p>
</div>
```
