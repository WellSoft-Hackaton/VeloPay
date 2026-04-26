"use client"
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { ArrowLeft, ShieldCheck, Zap, Globe } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background selection:bg-primary/20" dir="rtl">
            {/* Right side in RTL: Branding & Hero */}
            <div className="flex-1 flex flex-col justify-between p-8 md:p-12 lg:p-24 bg-[#0B7A00] text-white relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-white/10 blur-3xl transition-transform duration-1000 hover:scale-105" />
                    <div className="absolute bottom-[10%] -left-[20%] w-[60%] h-[60%] rounded-full bg-black/20 blur-3xl transition-transform duration-1000 hover:scale-105" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl shadow-sm">
                            <Image src="/logo.png" alt="NexaPay Logo" width={36} height={36} className="object-contain" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight" dir="ltr">NexaPay</span>
                    </div>
                </div>

                <div className="relative z-10 mt-16 md:mt-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                        تحويلات مالية <br /> عالمية سلسة
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-lg mb-10 leading-relaxed font-medium">
                        حوّل الأموال فوراً عبر الحدود باستخدام Solana. بدون رسوم خفية، بسرعة البرق، وبأمان تام.
                    </p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-colors group-hover:bg-white/20 backdrop-blur-sm border border-white/10">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-medium">معاملات بسرعة البرق</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-colors group-hover:bg-white/20 backdrop-blur-sm border border-white/10">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-medium">وصول عالمي</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-colors group-hover:bg-white/20 backdrop-blur-sm border border-white/10">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-medium">أمان بمستوى البنوك</span>
                        </div>
                    </div>
                </div>
                
                <div className="relative z-10 mt-16 md:mt-0 text-sm font-medium text-white/80">
                    © {new Date().getFullYear()} NexaPay Inc. جميع الحقوق محفوظة.
                </div>
            </div>

            {/* Left side in RTL: Login form */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-24 relative bg-background">
                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center md:text-right space-y-2">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground">مرحباً بعودتك</h2>
                        <p className="text-muted-foreground text-lg">قم بتسجيل الدخول إلى حسابك للمتابعة</p>
                    </div>

                    <div className="mt-10 bg-card p-8 rounded-3xl shadow-sm border border-border/60 hover:shadow-md transition-shadow duration-300">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 py-4 px-4 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary group"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            المتابعة باستخدام Google
                            <ArrowLeft className="w-5 h-5 mr-auto opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gray-400" />
                        </button>
                        
                        <div className="mt-8 text-center text-sm text-muted-foreground/80 leading-relaxed">
                            بتسجيلك الدخول، فإنك توافق على{' '}
                            <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">شروط الخدمة</a>
                            {' '}و{' '}
                            <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">سياسة الخصوصية</a>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}