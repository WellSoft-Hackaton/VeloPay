import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `أنت مساعد VeloPay الذكي المتخصص في تحويل الأموال. اسمك "VeloPay AI".

مهامك الرئيسية:
1. الإجابة على أسئلة تحويل الأموال بين الخليج والشام.
2. شرح الرسوم: VeloPay = $0.01 فقط | Western Union = $15-20 | البنوك = $25-35.
3. مقارنة VeloPay بالخدمات التقليدية وإبراز التوفير.
4. شرح تقنية Solana وعملة USDC بلغة بسيطة جداً.
5. الترويج لميزات Premium عند المناسبة.

قواعد الرد:
- الرد دائماً بالعربية الفصحى البسيطة والواضحة.
- قدم إجابات وافية ومفيدة للمستخدم (اشرح بالتفصيل إذا تطلب الأمر).
- استخدم الأرقام والرموز التعبيرية (Emojis) لجعل المحادثة ودية.
- أنت مساعد لخدمة VeloPay فقط، والتحويلات حالياً على Solana Devnet (بيئة تجريبية).`;

// دالة الاتصال مع التنسيق الصحيح للمحادثات
async function callGemini(apiKey: string, model: string, messages: any[]): Promise<string | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // 1. تحويل الرسائل لتناسب صيغة Gemini بشكل احترافي
    const formattedContents = messages.map((msg: any) => ({
      // Gemini يستخدم "model" بدلاً من "assistant"
      role: msg.role === "assistant" ? "model" : "user", 
      parts: [{ text: msg.content }],
    }));

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // 2. فصل تعليمات النظام في المكان المخصص لها
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: formattedContents, // تمرير المحادثة كمصفوفة منظمة
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024, // 3. زيادة التوكنز لتناسب اللغة العربية
          topP: 0.9,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Gemini ${model}] HTTP ${res.status}:`, errText.slice(0, 200));
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text && text.trim().length > 0) {
      return text.trim();
    }

    return null;
  } catch (err) {
    console.error(`[Gemini ${model}] Fetch error:`, err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ content: "عذراً، لم أستطع قراءة رسالتك. حاول مرة أخرى.", source: "error" });
    }

    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GEMINI_AI_API ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!geminiKey || geminiKey.trim() === "") {
      return NextResponse.json({
        content: generateSmartFallback(messages[messages.length - 1].content),
        source: "fallback_no_key",
      });
    }

    // ملاحظة: تم إضافة gemini-1.5-flash كونه الموديل الأكثر استقراراً حالياً
    const models = ["gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    
    for (const model of models) {
      // تمرير مصفوفة الرسائل كاملة بدلاً من دمجها في نص
      const result = await callGemini(geminiKey, model, messages);
      if (result) {
        return NextResponse.json({ content: result, source: `gemini:${model}` });
      }
    }

    return NextResponse.json({
      content: generateSmartFallback(messages[messages.length - 1].content),
      source: "fallback_api_error",
    });
  } catch (error) {
    console.error("[VeloPay AI] Unexpected error:", error);
    return NextResponse.json({
      content: "عذراً، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى. 🔄",
      source: "error",
    });
  }
}

// ... احتفظ بدالة generateSmartFallback كما هي

function generateSmartFallback(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes("رسوم") || msg.includes("سعر") || msg.includes("كم") || msg.includes("تكلف")) {
    return "رسوم VeloPay هي $0.01 فقط! مقارنةً بـ $15-20 في Western Union و$25-35 للتحويل البنكي. توفير ضخم مع كل تحويل! 💚";
  }
  if (msg.includes("وقت") || msg.includes("متى") || msg.includes("سرعة") || msg.includes("يصل")) {
    return "التحويل عبر VeloPay يصل خلال 3-5 ثوانٍ فقط عبر شبكة Solana. لا انتظار، لا تعقيد. ⚡";
  }
  if (msg.includes("وفّر") || msg.includes("وفر") || msg.includes("توفير")) {
    return "مع كل تحويل عبر VeloPay توفر ما بين $15-35 مقارنة بالطرق التقليدية! 💰";
  }
  if (msg.includes("solana") || msg.includes("usdc") || msg.includes("بلوكشين") || msg.includes("عملة")) {
    return "Solana شبكة Blockchain فائقة السرعة برسوم شبه معدومة. USDC عملة مستقرة = 1 دولار أمريكي دائماً. 🔗";
  }
  if (msg.includes("أمان") || msg.includes("آمن") || msg.includes("ثقة")) {
    return "كل معاملة مسجلة على Blockchain ولا يمكن تعديلها. شفافية كاملة وتتبع فوري على Solana Explorer. 🔐";
  }
  if (msg.includes("premium") || msg.includes("اشتراك") || msg.includes("مميز")) {
    return "Premium VeloPay يتيح: تحويلات غير محدودة، مبالغ أكبر، Yield على رصيدك، وتنبيهات ذكية بأفضل أسعار الصرف! ⭐";
  }
  if (msg.includes("كيف") || msg.includes("يعمل") || msg.includes("شرح")) {
    return "VeloPay: ① أدخل المبلغ ورقم المستلم ② ادفع ببطاقتك ③ يصل المال خلال ثوانٍ عبر Solana. بدون IBAN أو SWIFT! 📲";
  }
  if (msg.includes("الأردن") || msg.includes("السعودية") || msg.includes("الإمارات") || msg.includes("دول")) {
    return "VeloPay يدعم التحويل من 🇸🇦🇦🇪🇶🇦🇰🇼 إلى 🇯🇴🇵🇸🇮🇶🇸🇾 بأسرع وأرخص طريقة ممكنة! 🌍";
  }

  return "VeloPay يجعل تحويل الأموال من الخليج للشام أسرع وأرخص! $0.01 رسوم، وصول في ثوانٍ. أخبرني بأي سؤال محدد. 🚀";
}
