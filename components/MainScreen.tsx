import { useState } from "react";
import Image from "next/image";

import { DepositModal } from "@/components/deposit";
import { SendFundsModal } from "@/components/send-funds";
import { EarnYieldModal } from "@/components/earn-yield";
import { ActivityFeed } from "@/components/ActivityFeed";
import { NewProducts } from "./NewProducts";
import { DashboardSummary } from "./dashboard-summary";
import { Header } from "@/components/Header";

import { PaymentMethodModal } from "@/components/PaymentMethodModal";

interface MainScreenProps {
  walletAddress?: string;
}

export function MainScreen({ walletAddress }: MainScreenProps) {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showEarnYieldModal, setShowEarnYieldModal] = useState(false);
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background transition-colors duration-300">
      <Header />
      <div className="flex flex-1 justify-center gap-2 px-4 py-6">
        <div className="h-full w-full max-w-4xl">
          <DashboardSummary
            onDepositClick={() => setShowDepositModal(true)}
            onSendClick={() => setShowPaymentChoice(true)}
          />
          <NewProducts onEarnYieldClick={() => setShowEarnYieldModal(true)} />
          <ActivityFeed />
          <DepositModal
            open={showDepositModal}
            onClose={() => setShowDepositModal(false)}
            walletAddress={walletAddress || ""}
          />
          <SendFundsModal open={showSendModal} onClose={() => setShowSendModal(false)} />
          <EarnYieldModal open={showEarnYieldModal} onClose={() => setShowEarnYieldModal(false)} />
          <PaymentMethodModal open={showPaymentChoice} onClose={() => setShowPaymentChoice(false)} />
        </div>
      </div>
    </div>
  );
}
