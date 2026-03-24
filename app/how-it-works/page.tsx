"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";


export default function HowItWorksPage() {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-40 py-4">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex items-center justify-center bg-primary text-white rounded-lg p-1.5">
                                <span className="material-symbols-outlined text-2xl">analytics</span>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">Audit My Store</h2>
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-end gap-8 items-center">
                        <nav className="hidden md:flex items-center gap-8">
                            <Link className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="/how-it-works">How it works</Link>
                            <Link className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Examples</Link>
                            <Link className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="/about">About</Link>
                        </nav>
                        <Link href="/" className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90">
                            Get Started
                        </Link>
                    </div>
                </header>

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="mx-auto max-w-3xl px-6 py-16 text-center">

                        <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                            How It Works
                        </h1>
                        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                            The tool analyzes your store by simulating a live customer's journey through your layout and checkout. It identifies exactly where shoppers get confused, allowing you to remove barriers and naturally increase your sales.
                        </p>
                    </section>

                    {/* Steps Container */}
                    <section className="mx-auto max-w-4xl px-6 pb-24">
                        <div className="flex flex-col gap-12">
                            {/* Step 1 */}
                            <div className="group relative flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center">
                                <div className="flex-1">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg shadow-primary/30">
                                        1
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">Input Your Store URL</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Paste your store link to start the scan instantly. No code or admin access is ever required. It is a 100% safe, non-intrusive audit that begins in seconds.
                                    </p>
                                </div>
                                <div className="relative flex-1 rounded-xl bg-slate-50 p-6 dark:bg-slate-800/50">
                                    {/* Mini Graphic 1: Input Mockup */}
                                    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                        <div className="flex flex-col gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    className="w-full h-10 pl-3 pr-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-normal"
                                                    placeholder="walkaroo.in"
                                                    type="text"
                                                    disabled
                                                />
                                            </div>
                                            <button
                                                disabled
                                                className="h-10 px-4 rounded-md bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 w-full"
                                                type="button"
                                            >
                                                <span>Audit Store</span>
                                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                    {/* Background pattern decoration */}
                                    <div className="absolute -right-2 -top-2 -z-10 h-full w-full rounded-xl bg-primary/5"></div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="group relative flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row-reverse sm:items-center">
                                <div className="flex-1">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg shadow-primary/30">
                                        2
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">Visual AI Analysis</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Our AI simulates a real customer browsing your entire store. It pinpoints exactly where friction and layout issues are currently costing you sales.


                                    </p>
                                </div>
                                <div className="relative flex-1 rounded-xl bg-slate-50 p-6 dark:bg-slate-800/50">
                                    {/* Mini Graphic 2: AI Scanning */}
                                    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-700"></div>
                                        <div className="grid grid-cols-3 gap-2 p-4">
                                            <div className="aspect-square rounded bg-slate-50 dark:bg-slate-900/50"></div>
                                            <div className="col-span-2 space-y-2">
                                                <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-700"></div>
                                                <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-slate-700"></div>
                                                <div className="h-6 w-1/2 rounded bg-primary/20"></div>
                                            </div>
                                        </div>
                                        {/* Scanning Line */}
                                        <div className="absolute inset-x-0 top-0 h-1 bg-primary shadow-[0_0_15px_rgba(19,91,236,0.8)] opacity-50"></div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="material-symbols-outlined text-primary text-4xl opacity-20 scale-150">visibility</span>
                                        </div>
                                    </div>
                                    <div className="absolute -left-2 -bottom-2 -z-10 h-full w-full rounded-xl bg-primary/5"></div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="group relative flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center">
                                <div className="flex-1">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg shadow-primary/30">
                                        3
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">Instant Audit Report</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Receive a prioritized checklist of high-impact fixes. We provide clear, actionable steps to turn even more of your visitors into buyers immediately.
                                    </p>
                                </div>
                                <div className="relative flex-1 rounded-xl bg-slate-50 p-6 dark:bg-slate-800/50">
                                    {/* Mini Graphic 3: Insight Cards */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                                            <div className="flex-1 space-y-1">
                                                <div className="h-2 w-16 rounded bg-slate-200 dark:bg-slate-700"></div>
                                                <div className="h-1.5 w-full rounded bg-slate-100 dark:bg-slate-700"></div>
                                            </div>
                                        </div>
                                        <div className="translate-x-4 flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-md dark:border-slate-700 dark:bg-slate-800">
                                            <span className="material-symbols-outlined text-amber-500">warning</span>
                                            <div className="flex-1 space-y-1">
                                                <div className="h-2 w-20 rounded bg-slate-200 dark:bg-slate-700"></div>
                                                <div className="h-1.5 w-full rounded bg-slate-100 dark:bg-slate-700"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                            <span className="material-symbols-outlined text-primary">info</span>
                                            <div className="flex-1 space-y-1">
                                                <div className="h-2 w-12 rounded bg-slate-200 dark:bg-slate-700"></div>
                                                <div className="h-1.5 w-full rounded bg-slate-100 dark:bg-slate-700"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -right-2 -top-2 -z-10 h-full w-full rounded-xl bg-primary/5"></div>
                                </div>
                            </div>
                        </div>
                    </section>



                    {/* CTA Section */}
                    <section className="px-6 lg:px-40 py-24 bg-[#f6f6f8] dark:bg-background-dark">
                        <div className="max-w-[1000px] mx-auto overflow-hidden rounded-3xl bg-[#135ced] shadow-xl flex flex-col items-center text-center relative p-10 md:p-16">
                            <div className="relative z-10 flex flex-col items-center gap-6 text-white">
                                <h2 className="text-3xl md:text-4xl font-black leading-tight">Ready to find your lost sales?</h2>
                                <p className="text-white/90 text-lg max-w-[600px]">It takes less than 60 seconds to get your first insight.</p>
                                <Link href="/" className="inline-flex h-12 px-8 items-center justify-center gap-2 rounded-lg border border-white/30 text-white font-bold hover:bg-white/10 transition-colors">
                                    Start My Audit <ArrowRight className="size-5" />
                                </Link>
                            </div>
                            <div className="hidden md:block absolute right-[-10%] top-[-20%] size-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="hidden md:block absolute left-[-10%] bottom-[-40%] size-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-background-dark px-6 lg:px-40 py-12 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center bg-primary/20 text-primary rounded-lg p-1">
                                <span className="material-symbols-outlined text-xl">analytics</span>
                            </div>
                            <span className="text-slate-900 dark:text-white font-bold">Audit My Store</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">© 2024 Audit My Store. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Privacy</Link>
                            <Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Terms</Link>
                            <Link className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Support</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
