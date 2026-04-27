"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Fake API keys ─────────────────────────────────────────────────────────────
const SANDBOX_KEYS = {
  clientId: "vp_live_cid_7f3a9b2c4d8e1f6a",
  secretKey: "vp_live_sk_••••••••••••••••••••••••••••••••4c2d",
  secretKeyFull: "vp_live_sk_9d1e4f7a2b5c8e3f1a6d9b2c5e8f1a4d7b0c3e6f9a2b5c8d1e4f7a0b3c6d9e2f5",
};
const PROD_KEYS = {
  clientId: "vp_prod_cid_a1b2c3d4e5f6a7b8",
  secretKey: "vp_prod_sk_••••••••••••••••••••••••••••••••7f9a",
  secretKeyFull: "vp_prod_sk_RESTRICTED_contact_sales@velopay.io",
};

const CODE_EXAMPLES = {
  curl: `curl -X POST https://api.velopay.io/v1/transfers \\
  -H "Authorization: Bearer vp_live_sk_••••••••4c2d" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 500,
    "from_currency": "SAR",
    "to_currency": "JOD",
    "recipient_phone": "+962791234567",
    "receive_method": "bank",
    "iban": "JO94CBJO0010000000000131000302",
    "network": "solana-devnet"
  }'`,
  javascript: `import { VeloPay } from '@velopay/sdk';

const vp = new VeloPay({
  apiKey: process.env.VELOPAY_SECRET_KEY,
  environment: 'sandbox', // or 'production'
});

const transfer = await vp.transfers.create({
  amount: 500,
  fromCurrency: 'SAR',
  toCurrency: 'JOD',
  recipientPhone: '+962791234567',
  receiveMethod: 'bank',
  iban: 'JO94CBJO0010000000000131000302',
});

console.log(transfer.txHash);
// → "5Kj9mxP2QrVn7BwY3Lz8..."`,
  python: `import velopay

client = velopay.Client(
    api_key="vp_live_sk_••••••••4c2d",
    environment="sandbox"
)

transfer = client.transfers.create(
    amount=500,
    from_currency="SAR",
    to_currency="JOD",
    recipient_phone="+962791234567",
    receive_method="bank",
    iban="JO94CBJO0010000000000131000302"
)

print(transfer.tx_hash)`,
};

const ENDPOINTS = [
  {
    method: "POST",
    path: "/v1/transfers",
    desc: "إنشاء تحويل جديد",
    methodColor: "bg-green-500",
  },
  {
    method: "GET",
    path: "/v1/transfers/:id",
    desc: "استعلام حالة تحويل",
    methodColor: "bg-blue-500",
  },
  {
    method: "GET",
    path: "/v1/exchange-rates",
    desc: "أسعار الصرف اللحظية",
    methodColor: "bg-blue-500",
  },
  {
    method: "POST",
    path: "/v1/webhooks",
    desc: "تسجيل Webhook",
    methodColor: "bg-green-500",
  },
  {
    method: "GET",
    path: "/v1/balance",
    desc: "رصيد الحساب",
    methodColor: "bg-blue-500",
  },
  {
    method: "DELETE",
    path: "/v1/transfers/:id",
    desc: "إلغاء تحويل معلّق",
    methodColor: "bg-red-500",
  },
];

const STATS = [
  { label: "API Calls (30d)", value: "0", unit: "calls", icon: "📡" },
  { label: "Success Rate", value: "—", unit: "%", icon: "✅" },
  { label: "Avg Latency", value: "~120", unit: "ms", icon: "⚡" },
  { label: "Webhooks Sent", value: "0", unit: "events", icon: "🔔" },
];

// ─── Code block with syntax highlight (simple) ───────────────────────────────
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Very simple tokenizer for display
  const highlighted = code
    .replace(
      /("(?:[^"\\]|\\.)*")/g,
      '<span style="color:#a8ff78">$1</span>'
    )
    .replace(
      /\b(POST|GET|DELETE|curl|import|from|const|await|console|print|async)\b/g,
      '<span style="color:#79d7fb">$1</span>'
    )
    .replace(
      /(\/\/.*$)/gm,
      '<span style="color:#6a737d; font-style:italic">$1</span>'
    )
    .replace(
      /(#.*$)/gm,
      '<span style="color:#6a737d; font-style:italic">$1</span>'
    );

  return (
    <div className="relative rounded-2xl bg-[#0d1117] shadow-xl ring-1 ring-white/5">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="font-mono text-xs text-gray-400">{lang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <span>✓</span> Copied!
            </>
          ) : (
            <>
              <span>⎘</span> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
        <code
          className="font-mono text-gray-300"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}

// ─── Secret key reveal ────────────────────────────────────────────────────────
function SecretKeyRow({
  label,
  value,
  valueFull,
}: {
  label: string;
  value: string;
  valueFull: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(valueFull).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs text-gray-400">{label}</p>
        <p className="truncate font-mono text-sm text-gray-200">
          {revealed ? valueFull : value}
        </p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          onClick={() => setRevealed(!revealed)}
          className="rounded-lg px-2 py-1 text-xs text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          {revealed ? "🙈" : "👁"}
        </button>
        <button
          onClick={handleCopy}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function DeveloperPage() {
  const [env, setEnv] = useState<"sandbox" | "production">("sandbox");
  const [activeLang, setActiveLang] = useState<"curl" | "javascript" | "python">("javascript");
  const keys = env === "sandbox" ? SANDBOX_KEYS : PROD_KEYS;

  return (
    <div className="min-h-screen bg-[#0a0e0a]" dir="ltr">
      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0e0a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#13B601] font-bold text-white text-sm">
                V
              </div>
              <span className="font-bold text-white">VeloPay</span>
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-sm font-medium text-gray-300">API Console</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Environment switch */}
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
              {(["sandbox", "production"] as const).map((e) => (
                <button
                  key={e}
                  onClick={() => setEnv(e)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    env === e
                      ? e === "sandbox"
                        ? "bg-amber-500 text-black"
                        : "bg-[#13B601] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {e === "sandbox" ? "Sandbox" : "Production"}
                </button>
              ))}
            </div>

            <Link
              href="/"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition hover:text-white"
            >
              ← Back to App
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* ── Hero ── */}
        <div className="mb-10">
          <div className="mb-2 flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                env === "sandbox"
                  ? "border border-amber-500/40 bg-amber-500/10 text-amber-400"
                  : "border border-[#13B601]/40 bg-[#13B601]/10 text-[#13B601]"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {env === "sandbox" ? "SANDBOX MODE" : "PRODUCTION"}
            </div>
          </div>
          <h1 className="text-4xl font-black text-white">VeloPay API Console</h1>
          <p className="mt-2 text-gray-400 max-w-xl">
            Integrate cross-border money transfers into your application in minutes.
            Move money from Gulf to Levant programmatically with our REST API.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              <div className="mb-2 text-2xl">{s.icon}</div>
              <div className="text-2xl font-black text-white">
                {s.value}
                <span className="ml-1 text-sm font-normal text-gray-400">{s.unit}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* ── Left column ── */}
          <div className="space-y-8">
            {/* API Keys */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">API Keys</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    env === "sandbox"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {env === "sandbox" ? "Test Keys" : "Live Keys — Keep Secret"}
                </span>
              </div>
              <div className="space-y-3">
                <SecretKeyRow
                  label="Client ID"
                  value={keys.clientId}
                  valueFull={keys.clientId}
                />
                <SecretKeyRow
                  label="Secret Key"
                  value={keys.secretKey}
                  valueFull={keys.secretKeyFull}
                />
              </div>
              {env === "production" && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                  ⚠️ Never expose your secret key in client-side code. Use server-side only.
                </div>
              )}
            </section>

            {/* Quick Start */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="mb-2 text-lg font-bold text-white">Quick Start</h2>
              <p className="mb-5 text-sm text-gray-400">
                Create a transfer in 3 lines of code.
              </p>

              {/* Language tabs */}
              <div className="mb-4 flex gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
                {(["javascript", "curl", "python"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                      activeLang === lang
                        ? "bg-[#13B601] text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {lang === "javascript" ? "JavaScript" : lang === "curl" ? "cURL" : "Python"}
                  </button>
                ))}
              </div>

              <CodeBlock code={CODE_EXAMPLES[activeLang]} lang={activeLang} />
            </section>

            {/* Endpoints */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="mb-5 text-lg font-bold text-white">API Reference</h2>
              <div className="space-y-2">
                {ENDPOINTS.map((ep, index) => (
                  <div
                    key={`${ep.method}-${ep.path}-${index}`}
                    className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 px-4 py-3 transition hover:border-white/15 hover:bg-black/30"
                  >
                    <span
                      className={`flex-shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold text-white ${ep.methodColor}`}
                    >
                      {ep.method}
                    </span>
                    <code className="flex-1 font-mono text-sm text-gray-300">{ep.path}</code>
                    <span className="text-xs text-gray-500">{ep.desc}</span>
                    <span className="text-gray-600">→</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">
            {/* Response preview */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-bold text-gray-300">Sample Response</h3>
              <CodeBlock
                lang="json"
                code={`{
  "id": "txn_9d1e4f7a2b5c",
  "status": "delivered",
  "txHash": "5Kj9mxP2Qr...xP2Q",
  "amount": 500,
  "fromCurrency": "SAR",
  "toCurrency": "JOD",
  "converted": 49.73,
  "fee": 0.01,
  "network": "solana-devnet",
  "deliveredAt": "2026-04-27T10:34:07Z",
  "explorerUrl": "https://explorer.solana.com/tx/5Kj9..."
}`}
              />
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-300">Platform Features</h3>
              <div className="space-y-3">
                {[
                  { icon: "🔑", title: "REST API", desc: "Standard HTTP/JSON" },
                  { icon: "🔔", title: "Webhooks", desc: "Real-time status updates" },
                  { icon: "🧪", title: "Sandbox", desc: "Test without real money" },
                  { icon: "📚", title: "SDKs", desc: "JS / Python / PHP coming soon" },
                  { icon: "⚡", title: "Fast Settlement", desc: "~5 seconds via Solana" },
                  { icon: "🔒", title: "Secure", desc: "API key + webhook signing" },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <span className="text-lg">{f.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-200">{f.title}</p>
                      <p className="text-xs text-gray-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-[#13B601]/30 bg-[#13B601]/10 p-5">
              <h3 className="mb-1 font-bold text-white">Ready to integrate?</h3>
              <p className="mb-4 text-xs text-gray-400">
                Get your production API keys and go live.
              </p>
              <a
                href="mailto:api@velopay.io"
                className="block w-full rounded-xl bg-[#13B601] py-3 text-center text-sm font-bold text-white transition hover:bg-[#0fa301] active:scale-95"
              >
                Contact Sales →
              </a>
              <p className="mt-2 text-center text-xs text-gray-500">
                Sandbox is free forever
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}