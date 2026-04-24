import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `أنت مساعد NexaPay الذكي لتحويل الأموال. مهمتك:
1. الإجابة على أسئلة المستخدمين عن تحويل الأموال (الخليج ↔ الشام)
2. حساب وتوضيح الرسوم والوقت المتوقع
3. مقارنة NexaPay بالبنوك التقليدية (رسوم NexaPay $0.01 فقط، البنوك $25-35، Western Union $15-20)
4. شرح كيف تعمل Solana وUSDC بلغة بسيطة
5. تقديم تحليل الوفورات للمستخدم

قواعد مهمة:
- الرد دائماً بالعربية الفصحى البسيطة
- الردود قصيرة ومباشرة (2-3 جمل)
- استخدم الأرقام دائماً عند ذكر الرسوم والوفورات
- كن متحمساً وإيجابياً
- اذكر دائماً أن التحويلات على Solana Devnet (تجريبي)`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages?.[messages.length - 1]?.content || "";

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_AI_API;

    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${SYSTEM_PROMPT}\n\nالمستخدم: ${lastMessage}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          return NextResponse.json({ content, source: "gemini" });
        }
      } catch (geminiError) {
        console.error("[Gemini API error]", geminiError);
      }
    }

    // Fallback: rule-based responses
    const fallback = generateFallbackResponse(lastMessage);
    return NextResponse.json({ content: fallback, source: "fallback" });
  } catch (error) {
    console.error("[AI Chat API]", error);
    return NextResponse.json(
      { content: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.", source: "error" },
      { status: 200 }
    );
  }
}

function generateFallbackResponse(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes("رسوم") || msg.includes("سعر") || msg.includes("كم")) {
    return "رسوم NexaPay هي $0.01 فقط لأي تحويل! مقارنةً بـ $15-20 في Western Union و$25-35 للتحويل البنكي. توفير ضخم مع كل تحويل! 💚";
  }
  if (msg.includes("وقت") || msg.includes("متى") || msg.includes("سرعة")) {
    return "التحويل عبر NexaPay يصل خلال 3-5 ثوانٍ فقط! شبكة Solana هي الأسرع في عالم Blockchain. لا انتظار، لا تعقيد. ⚡";
  }
  if (msg.includes("وفّر") || msg.includes("وفر") || msg.includes("توفير")) {
    return "مع كل تحويل عبر NexaPay توفر ما بين $15-35 مقارنة بالطرق التقليدية! على مدار السنة هذا مبلغ كبير جداً. 💰";
  }
  if (msg.includes("solana") || msg.includes("usdc") || msg.includes("بلوكشين")) {
    return "Solana هي شبكة Blockchain فائقة السرعة تعالج آلاف المعاملات في الثانية برسوم شبه معدومة. USDC عملة مستقرة مرتبطة بالدولار الأمريكي. 🔗";
  }
  if (msg.includes("أمان") || msg.includes("آمن") || msg.includes("ثقة")) {
    return "كل معاملة مسجلة على Blockchain ولا يمكن تعديلها أو حذفها. الشفافية الكاملة تعني أمان كامل. يمكنك تتبع تحويلك في أي لحظة على Solana Explorer. 🔐";
  }

  return "NexaPay يجعل تحويل الأموال من الخليج للشام أسرع وأرخص من أي وقت مضى. $0.01 رسوم فقط، وصول خلال ثوانٍ! كيف يمكنني مساعدتك؟ 🚀";
}
