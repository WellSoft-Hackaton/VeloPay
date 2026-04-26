"use client";

import {
  CrossmintProvider,
  CrossmintAuthProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Support both NEXT_PUBLIC_CROSSMINT_API_KEY and NEXT_PUBLIC_CROSSMINT_CLIENT_API_KEY
const apiKey =
  process.env.NEXT_PUBLIC_CROSSMINT_API_KEY ||
  process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_API_KEY ||
  "";

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "base-sepolia";

if (!apiKey && typeof window !== "undefined") {
  console.warn("Warning: Crossmint API key not set. Wallet features will be limited.");
}

const queryClient = new QueryClient();
const chain = chainId as any;

export function Providers({ children }: { children: React.ReactNode }) {
  if (!apiKey) {
    // Render without Crossmint if no API key (for landing page preview)
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CrossmintProvider apiKey={apiKey}>
        <CrossmintAuthProvider
          authModalTitle="VeloPay — تسجيل الدخول"
          loginMethods={["email", "google"]}
          termsOfServiceText={
            <p>
              بالمتابعة، أنت توافق على{" "}
              <a href="https://www.crossmint.com/legal/terms-of-service" target="_blank">
                شروط الاستخدام
              </a>
            </p>
          }
        >
          <CrossmintWalletProvider
            createOnLogin={{
              chain,
              recovery: { type: "email" },
            }}
          >
            {children}
          </CrossmintWalletProvider>
        </CrossmintAuthProvider>
      </CrossmintProvider>
    </QueryClientProvider>
  );
}
