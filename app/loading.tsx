"use client"
import Lottie from "lottie-react";
import loader from "@/public/animations/Money_loading.json";
export default function LoadingPage() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-[9999]">
            <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
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