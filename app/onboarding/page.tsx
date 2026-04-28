import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./OnboardingForm";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function OnboardingPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Pre-fill user data
  const user = {
    name: session.user.name || "",
    email: session.user.email || "",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background selection:bg-primary/20 relative p-4 md:p-8" dir="rtl">
      {/* Theme Toggle */}
      <div className="absolute top-6 left-6 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-3xl bg-card p-6 md:p-12 rounded-[2rem] shadow-xl shadow-black/5 border border-border/60 relative z-10">
        <div className="flex flex-col items-center mb-10 text-center space-y-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm mb-2 border border-border/50">
            <Image src="/VeloPay.png" alt="VeloPay Logo" width={64} height={64} className="object-contain rounded-xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">مرحباً بك في VeloPay</h1>
          <p className="text-muted-foreground text-lg max-w-lg">
            نحتاج إلى بعض المعلومات الإضافية لتأمين حسابك وتسهيل معاملاتك المالية.
          </p>
        </div>

        <OnboardingForm user={user} />
      </div>
    </div>
  );
}
