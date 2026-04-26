import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `أنت مساعد VeloPay الذكي المتخصص في تحويل الأموال. اسمك "VeloPay AI".

مهامك الرئيسية:
1. الإجابة على أسئلة تحويل الأموال بين الخليج والشام
2. شرح الرسوم: VeloPay = $0.01 فقط | Western Union = $15-20 | البنوك = $25-35
3. مقارنة VeloPay بالخدمات التقليدية
4. شرح Solana وUSDC بلغة بسيطة
5. حساب التوفيرات للمستخدم
6. الترويج لميزات Premium عند المناسبة

قواعد الرد:
- الرد دائماً بالعربية الفصحى البسيطة
- الردود قصيرة ومباشرة (2-4 جمل)
- استخدم الأرقام عند ذكر الرسوم
- كن إيجابياً ومتحمساً
- أنت مساعد VeloPay فقط
- التحويلات على Solana Devnet (بيئة تجريبية)`;

// Try Gemini with a given model name
async function callGemini(apiKey: string, model: string, prompt: string): Promise<string | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 350,
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

    console.warn(`[Gemini ${model}] Empty response:`, JSON.stringify(data).slice(0, 200));
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

    const lastMessage = messages[messages.length - 1]?.content?.trim() || "";

    if (!lastMessage) {
      return NextResponse.json({ content: "كيف يمكنني مساعدتك اليوم؟ 😊", source: "empty" });
    }

    // Build conversation context (all previous messages as text)
    const conversationContext = messages
      .slice(0, -1) // all except the last (current) message
      .map((m: { role: string; content: string }) =>
        m.role === "user" ? `[المستخدم]: ${m.content}` : `[VeloPay AI]: ${m.content}`
      )
      .join("\n");

    // Single-turn prompt — avoids all multi-turn conversation order issues with Gemini
    const fullPrompt = [
      SYSTEM_PROMPT,
      "",
      conversationContext
        ? `=== سياق المحادثة السابقة ===\n${conversationContext}\n`
        : "",
      `=== رسالة المستخدم الآن ===`,
      lastMessage,
      "",
      "=== ردك كـ VeloPay AI (بالعربية مباشرة) ===",
    ]
      .filter(Boolean)
      .join("\n");

    // Get API key (server-side only — no NEXT_PUBLIC_ needed)
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GEMINI_AI_API ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!geminiKey || geminiKey.trim() === "") {
      console.warn("[VeloPay AI] No Gemini API key found in environment variables");
      return NextResponse.json({
        content: generateSmartFallback(lastMessage),
        source: "fallback_no_key",
      });
    }

    console.log("[VeloPay AI] Calling Gemini with key:", geminiKey.slice(0, 8) + "...");

    // Try models in order
    const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-pro"];

    for (const model of models) {
      const result = await callGemini(geminiKey, model, fullPrompt);
      if (result) {
        console.log(`[VeloPay AI] Success with model: ${model}`);
        return NextResponse.json({ content: result, source: `gemini:${model}` });
      }
    }

    // All models failed — use smart fallback
    console.warn("[VeloPay AI] All Gemini models failed, using smart fallback");
    return NextResponse.json({
      content: generateSmartFallback(lastMessage),
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
