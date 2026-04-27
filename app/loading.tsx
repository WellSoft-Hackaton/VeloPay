"use client"
import Lottie from "lottie-react";
import loader from "@/public/animations/Money_loading.json";
export default function LoadingPage() {
    return <Lottie className="flex justify-center items-center h-screen " animationData={loader} />
}