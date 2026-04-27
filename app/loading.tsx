"use client"
import Lottie from "lottie-react";
import loader from "@/public/animations/Money_loading.json";
export default function LoadingPage() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-[9999]">
            <div className="w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40">
                <Lottie
                    animationData={loader}
                    loop={true}
                    className="w-full h-full"
                />
            </div>
            <p className="mt-4 text-xl font-medium animate-pulse text-primary">
                جاري التحميل...
            </p>
        </div>
    );
}