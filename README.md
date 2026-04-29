<div align="center">
  <img src="<img width="1254" height="1254" alt="ChatGPT Image Apr 26, 2026, 05_46_00 PM" src="https://github.com/user-attachments/assets/8030f7a5-a95b-434f-b006-53270dbb2ef8" />
" alt="VeloPay Logo" width="200"/>

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
* 🔑 **محافظ مدمجة (Embedded Wallets):** تجربة مستخدم سلسة لا تتطلب معرفة مسبقة بالعملات الرقمية أو المحافظ المعقدة.
* 📊 **شفافية تامة:** إمكانية تتبع مسار الأموال لحظة بلحظة.

---

## 🔄 كيف يعمل النظام؟

تم تصميم تجربة المستخدم لتكون بسيطة ومألوفة، دون تعقيدات الـ Blockchain:

1. **الإرسال:** يقوم المرسل بإدخال المبلغ ورقم هاتف المستلم، ويدفع باستخدام بطاقته البنكية.
2. **التحويل الذكي:** يتم تحويل المبلغ برمجياً إلى USDC وإرساله عبر شبكة Solana فائقة السرعة.
3. **الاستلام المرن:** بفضل بنيتنا التحتية، خيارات الاستلام سهلة ومباشرة، حيث تصل الأموال للمستلم عبر:
   * **إشعار رسالة قصيرة (SMS)** لحسابه البنكي.
   * **إنشاء محفظة رقمية تلقائياً** مرتبطة برقم هاتفه.
   * **تحويل مباشر** إلى المحافظ المحلية الإلكترونية (مثل Zain Cash).

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

تم بناء المنصة باستخدام أحدث التقنيات لضمان الأمان، السرعة، وقابلية التوسع:

### واجهة المستخدم (Frontend)
* **Framework:** Next.js 15 (App Router)
* **Styling:** Tailwind CSS + shadcn/ui

### تقنيات البلوكشين (Web3)
* **Network:** Solana Devnet
* **SDK:** `@solana/web3.js`
* **Wallets:** Crossmint Embedded Wallets & `@solana/wallet-adapter`
* **On/Off Ramp:** Transak (Sandbox)

### الذكاء الاصطناعي والبيانات (AI & Data)
* **AI Engine:** Google Gemini API
* **Exchange Rates:** CoinGecko API
* **State Management:** React Context

---

## 🚀 طريقة التشغيل (Getting Started)

لتشغيل المشروع على جهازك المحلي، يرجى اتباع الخطوات التالية:

### 1. تثبيت الحزم والمتطلبات
تأكد من تثبيت Node.js على جهازك، ثم قم بتشغيل الأمر التالي في جذر المشروع:
```bash
npm i
```

### 2. إعداد متغيرات البيئة (.env)
قم بإنشاء ملف `.env.local` في المجلد الرئيسي للمشروع، وأضف المفاتيح التالية (استبدل القيم بمفاتيحك الخاصة):
```env
NEXT_PUBLIC_CROSSMINT_API_KEY="your_crossmint_key"
NEXT_PUBLIC_TRANSAK_API_KEY="your_transak_sandbox_key"
NEXT_PUBLIC_SOLANA_NETWORK="devnet"
GEMINI_API_KEY="your_gemini_api_key"
NEXT_PUBLIC_COINGECKO_API="[https://api.coingecko.com/api/v3](https://api.coingecko.com/api/v3)"
```

### 3. تشغيل خادم التطوير
بعد تثبيت الحزم وإعداد متغيرات البيئة، قم بتشغيل التطبيق:
```bash
npm run dev
```
افتح متصفحك وانتقل إلى `http://localhost:3000` لرؤية التطبيق يعمل.

---

## 🎯 ملاحظة (Hackathon MVP)
تم بناء هذه النسخة (MVP) خصيصاً لأغراض الهاكاثون لتوضيح المعمارية وقابلية التطبيق. بعض العمليات (مثل التكامل المباشر مع شبكات الهاتف المحلية) تعمل حالياً ضمن بيئة محاكاة (Simulation) لإثبات المفهوم الهندسي، مع الجاهزية الكاملة للربط الحقيقي (Production) عند توفر شراكات مع مزودي السيولة المحليين.

<div align="center">
  <p>تم بناؤه بشغف 💡 لتسهيل حياة المغتربين وعائلاتهم.</p>
</div>
```
