"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { 
  Radio, 
  CheckCircle2, 
  Zap, 
  Bell, 
  Eye, 
  EyeOff, 
  Check, 
  Copy, 
  AlertTriangle, 
  Key, 
  TestTube2, 
  Library, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  FastForward,
  Settings
} from "lucide-react";

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
  { label: "API Calls (30d)", value: "0", unit: "calls", icon: <Radio size={18} aria-hidden="true" /> },
  { label: "Success Rate", value: "—", unit: "%", icon: <CheckCircle2 size={18} aria-hidden="true" /> },
  { label: "Avg Latency", value: "~120", unit: "ms", icon: <Zap size={18} aria-hidden="true" /> },
  { label: "Webhooks Sent", value: "0", unit: "events", icon: <Bell size={18} aria-hidden="true" /> },
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
              <Check size={14} aria-hidden="true" /> Copied!
            </>
          ) : (
            <>
              <Copy size={14} aria-hidden="true" /> Copy
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
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/50 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm text-foreground">
          {revealed ? valueFull : value}
        </p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          onClick={() => setRevealed(!revealed)}
          className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {revealed ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
        <button
          onClick={handleCopy}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check size={14} aria-hidden="true" /> : "Copy"}
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="ltr">
      <Header />
      
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Environment switch */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <span className="text-sm font-medium text-muted-foreground">API Environment:</span>
             <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
              {(["sandbox", "production"] as const).map((e) => (
                <button
                  key={e}
                  onClick={() => setEnv(e)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    env === e
                      ? e === "sandbox"
                        ? "bg-amber-500 text-black"
                        : "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {e === "sandbox" ? "Sandbox" : "Production"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Hero ── */}
        <div className="mb-10">
          <div className="mb-2 flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                env === "sandbox"
                  ? "border border-amber-500/40 bg-amber-500/10 text-amber-600"
                  : "border border-primary/40 bg-primary/10 text-primary"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {env === "sandbox" ? "SANDBOX MODE" : "PRODUCTION"}
            </div>
          </div>
          <h1 className="text-4xl font-black text-foreground">VeloPay API Console</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Integrate cross-border money transfers into your application in minutes.
            Move money from Gulf to Levant programmatically with our REST API.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-4 backdrop-blur-sm shadow-sm"
            >
              <div className="mb-2 text-foreground">{s.icon}</div>
              <div className="text-2xl font-black text-foreground">
                {s.value}
                <span className="ml-1 text-sm font-normal text-muted-foreground">{s.unit}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* ── Left column ── */}
          <div className="space-y-8">
            {/* API Keys */}
            <section className="rounded-2xl border border-border bg-card p-6 backdrop-blur-sm shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">API Keys</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    env === "sandbox"
                      ? "bg-amber-500/20 text-amber-600"
                      : "bg-red-500/20 text-red-600"
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
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600">
                  <AlertTriangle size={14} aria-hidden="true" /> Never expose your secret key in client-side code. Use server-side only.
                </div>
              )}
            </section>

            {/* Quick Start */}
            <section className="rounded-2xl border border-border bg-card p-6 backdrop-blur-sm shadow-sm">
              <h2 className="mb-2 text-lg font-bold text-foreground">Quick Start</h2>
              <p className="mb-5 text-sm text-muted-foreground">
                Create a transfer in 3 lines of code.
              </p>

              {/* Language tabs */}
              <div className="mb-4 flex gap-1 rounded-xl border border-border bg-muted p-1">
                {(["javascript", "curl", "python"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                      activeLang === lang
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "javascript" ? "JavaScript" : lang === "curl" ? "cURL" : "Python"}
                  </button>
                ))}
              </div>

              <CodeBlock code={CODE_EXAMPLES[activeLang]} lang={activeLang} />
            </section>

            {/* Endpoints */}
            <section className="rounded-2xl border border-border bg-card p-6 backdrop-blur-sm shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-foreground">API Reference</h2>
              <div className="space-y-2">
                {ENDPOINTS.map((ep, index) => (
                  <div
                    key={`${ep.method}-${ep.path}-${index}`}
                    className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 px-4 py-3 transition hover:border-primary/30 hover:bg-muted/50"
                  >
                    <span
                      className={`flex-shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold text-white ${ep.methodColor}`}
                    >
                      {ep.method}
                    </span>
                    <code className="flex-1 font-mono text-sm text-foreground">{ep.path}</code>
                    <span className="text-xs text-muted-foreground">{ep.desc}</span>
                    <ArrowRight size={14} className="text-muted-foreground" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">
            {/* Response preview */}
            <div className="rounded-2xl border border-border bg-card p-5 backdrop-blur-sm shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-muted-foreground">Sample Response</h3>
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
            <div className="rounded-2xl border border-border bg-card p-5 backdrop-blur-sm shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-muted-foreground">Platform Features</h3>
              <div className="space-y-3">
                {[
                  { icon: <Key size={18} aria-hidden="true" />, title: "REST API", desc: "Standard HTTP/JSON" },
                  { icon: <Bell size={18} aria-hidden="true" />, title: "Webhooks", desc: "Real-time status updates" },
                  { icon: <TestTube2 size={18} aria-hidden="true" />, title: "Sandbox", desc: "Test without real money" },
                  { icon: <Library size={18} aria-hidden="true" />, title: "SDKs", desc: "JS / Python / PHP coming soon" },
                  { icon: <Zap size={18} aria-hidden="true" />, title: "Fast Settlement", desc: "~5 seconds via Solana" },
                  { icon: <ShieldCheck size={18} aria-hidden="true" />, title: "Secure", desc: "API key + webhook signing" },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <span className="text-foreground">{f.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 shadow-sm">
              <h3 className="mb-1 font-bold text-foreground">Ready to integrate?</h3>
              <p className="mb-4 text-xs text-muted-foreground">
                Get your production API keys and go live.
              </p>
              <a
                href="mailto:api@velopay.io"
                className="block w-full rounded-xl bg-primary py-3 text-center text-sm font-bold text-primary-foreground transition hover:bg-primary/90 active:scale-95 shadow-lg shadow-primary/20"
              >
                Contact Sales <ArrowRight size={18} style={{ display: 'inline', marginLeft: 6 }} aria-hidden="true" />
              </a>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Sandbox is free forever
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}