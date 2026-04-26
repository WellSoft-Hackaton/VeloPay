import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `أنت مساعد VeloPay الذكي لتحويل الأموال. اسمك "VeloPay AI".
مهمتك: الإجابة عن أسئلة التحويل، مقارنة الرسوم (VeloPay $0.01 / WU $15-20 / بنك $25-35)، شرح Solana وUSDC، والترويج لـ Premium.
قواعد: رد بالعربية فقط، جمل قصيرة (2-4)، لا تذكر NexaPay أبداً، اذكر أن التحويلات على Solana Devnet.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { content: "عذراً، لم أستطع فهم رسالتك. حاول مرة أخرى.", source: "error" },
        { status: 200 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content || "";

    const conversationHistory = messages
      .slice(0, -1)
      .map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GEMINI_AI_API ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (geminiKey && geminiKey.trim() !== "") {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                ...conversationHistory,
                {
                  role: "user",
                  parts: [{ text: `${SYSTEM_PROMPT}\n\nالمستخدم يسأل: ${lastMessage}` }],
                },
              ],
              generationConfig: { temperature: 0.7, maxOutputTokens: 400, topP: 0.9 },
              safetySettings: [{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }],
            }),
            signal: AbortSignal.timeout(10000),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content && content.trim()) {
            return NextResponse.json({ content: content.trim(), source: "gemini" });
          }
        } else {
          console.error("[Gemini] API error:", geminiRes.status, await geminiRes.text());
        }
      } catch (geminiError) {
        console.error("[Gemini] Request failed:", geminiError);
      }
    } else {
      console.warn("[VeloPay AI] No Gemini API key found — using fallback");
    }

    return NextResponse.json({ content: generateSmartFallback(lastMessage), source: "fallback" });
  } catch (error) {
    console.error("[AI Chat API] Unexpected error:", error);
    return NextResponse.json(
      { content: "عذراً، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى. 🔄", source: "error" },
      { status: 200 }
    );
  }
}

function generateSmartFallback(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("رسوم") || msg.includes("سعر") || msg.includes("كم") || msg.includes("تكلف"))
    return "رسوم VeloPay هي $0.01 فقط لأي تحويل! مقارنةً بـ $15-20 في Western Union و$25-35 للتحويل البنكي. توفير ضخم مع كل تحويل! 💚";
  if (msg.includes("وقت") || msg.includes("متى") || msg.includes("سرعة") || msg.includes("يصل"))
    return "التحويل عبر VeloPay يصل خلال 3-5 ثوانٍ فقط! شبكة Solana هي الأسرع في عالم Blockchain. ⚡";
  if (msg.includes("وفّر") || msg.includes("وفر") || msg.includes("توفير"))
    return "مع كل تحويل عبر VeloPay توفر ما بين $15-35 مقارنة بالطرق التقليدية! 💰";
  if (msg.includes("solana") || msg.includes("usdc") || msg.includes("بلوكشين"))
    return "Solana شبكة Blockchain فائقة السرعة برسوم شبه معدومة. USDC عملة مستقرة مرتبطة بالدولار 1:1. 🔗";
  if (msg.includes("أمان") || msg.includes("آمن") || msg.includes("ثقة"))
    return "كل معاملة مسجلة على Blockchain ولا يمكن تعديلها. يمكنك تتبع تحويلك على Solana Explorer. 🔐";
  if (msg.includes("premium") || msg.includes("اشتراك") || msg.includes("ترقية"))
    return "VeloPay Premium يتيح: تحويلات غير محدودة، مبالغ أكبر، عائد على رصيدك، وتنبيهات أسعار الصرف! 🌟";
  if (msg.includes("كيف") || msg.includes("يعمل") || msg.includes("شرح"))
    return "VeloPay يحوّل أموالك في 3 خطوات: ① أدخل المبلغ ② ادفع ببطاقتك ③ المال يصل عبر Solana Devnet خلال ثوانٍ! 📲";
  if (msg.includes("الأردن") || msg.includes("السعودية") || msg.includes("الإمارات") || msg.includes("دول"))
    return "VeloPay يدعم التحويل من 🇸🇦🇦🇪🇶🇦🇰🇼 إلى 🇯🇴🇵🇸🇮🇶🇸🇾. نعمل على توسيع نطاق الدول! 🌍";
  return "VeloPay يجعل تحويل الأموال من الخليج للشام أسرع وأرخص. $0.01 رسوم فقط، وصول في ثوانٍ! أخبرني بسؤالك. 🚀";
}
