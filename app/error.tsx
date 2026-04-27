"use client";

import Lottie from "lottie-react";
import serverErrorAnimation from "@/public/animations/lottie-server-error.json";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCcw } from "lucide-react";

const Error = ({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    const router = useRouter();
    const lottieRef = useRef<any>(null);

    useEffect(() => {
        lottieRef.current?.setSpeed(1);
        // Log error to console or tracking service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background selection:bg-primary/20" dir="rtl">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-5xl w-full mx-auto">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full">

                    <div className="flex flex-col items-center lg:items-start text-center lg:text-right space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="space-y-2">
                            <h1 className="text-8xl lg:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-l from-primary to-[#0B7A00] drop-shadow-sm">
                                500
                            </h1>
                            <div className="h-1.5 w-20 bg-primary rounded-full mx-auto lg:mx-0 shadow-[0_0_15px_rgba(19,182,1,0.5)]" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
                                خلل في النظام
                            </h2>
                            <p className="text-muted-foreground text-lg lg:text-xl max-w-md leading-relaxed font-medium">
                                حدث خطأ غير متوقع في الخادم. تم إبلاغ فريقنا ونحن نعمل على إصلاحه في أسرع وقت.
                            </p>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => reset()}
                                className="group relative px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(19,182,1,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(19,182,1,0.4)] active:scale-95 overflow-hidden flex items-center justify-center gap-3"
                            >
                                <span className="relative z-10">إعادة المحاولة</span>
                                <RefreshCcw className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700" />
                            </button>

                            <button
                                onClick={() => router.push("/")}
                                className="group px-8 py-4 bg-card text-foreground font-bold rounded-2xl border border-border hover:bg-muted transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <span className="relative z-10">العودة للرئيسية</span>
                                <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300 text-muted-foreground" />
                            </button>
                        </div>
                    </div>

                    <div className="relative group animate-in fade-in zoom-in duration-1000">
                        {/* Decorative Ring */}
                        <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />

                        <div className="w-72 h-72 lg:w-[450px] lg:h-[450px] relative z-10 drop-shadow-2xl">
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={serverErrorAnimation}
                                loop={true}
                                style={{ width: '100%', height: '100%', filter: 'hue-rotate(-90deg) saturate(1.2) brightness(0.9)' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error;