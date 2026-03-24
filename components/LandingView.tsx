"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StatCounter } from "./StatCounter";
import { FaqSection } from "./FaqSection";

interface LandingViewProps {
    onAudit: (url: string) => void;
    isLoading: boolean;
}

export function LandingView({ onAudit, isLoading }: LandingViewProps) {
    const [url, setUrl] = useState("");
    const [placeholderText, setPlaceholderText] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isInputFocused) return;

        const examples = [
            "gymshark.com",
            "allbirds.com",
            "joggersports.com",
            "ayurveherbal.com",
            "aloeveda.com",
            "walkaroo.in"
        ];

        let currentExampleIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let timeoutId: NodeJS.Timeout;

        const type = () => {
            const currentExample = examples[currentExampleIndex];

            if (isDeleting) {
                setPlaceholderText(currentExample.substring(0, currentCharIndex));
                typingSpeed = 50;
                currentCharIndex--;
            } else {
                setPlaceholderText(currentExample.substring(0, currentCharIndex));
                typingSpeed = 100;
                currentCharIndex++;
            }

            if (!isDeleting && currentCharIndex === currentExample.length + 1) {
                // Finished typing, pause
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && currentCharIndex === 0) {
                // Finished deleting, move to next word
                isDeleting = false;
                currentExampleIndex = (currentExampleIndex + 1) % examples.length;
                typingSpeed = 500;
            }

            timeoutId = setTimeout(type, typingSpeed);
        };

        type();

        return () => clearTimeout(timeoutId);
    }, [isInputFocused]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!url) return;

        // 1. Strip protocol for validation
        const cleanUrl = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

        // 2. Strict Domain Regex (Must have at least one dot and valid TLD, allows optional path)
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/;

        if (!domainRegex.test(cleanUrl)) {
            setError("Please enter a valid URL (e.g. brand.com)");
            // Shake effect logic could go here or via CSS class trigger
            return;
        }

        // 3. Clear error & Auto-correct logic
        setError(null);
        let finalUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            finalUrl = `https://${url}`;
        }
        onAudit(finalUrl);
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-40 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center bg-primary text-white rounded-lg p-1.5">
                            <span className="material-symbols-outlined text-2xl">analytics</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">Audit My Store</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8 items-center">
                        <nav className="hidden md:flex items-center gap-8">
                            <Link className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="/how-it-works">How it works</Link>
                            <Link className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="#">Examples</Link>
                            <Link className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors" href="/about">About</Link>
                        </nav>
                        <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90">
                            Get Started
                        </button>
                    </div>
                </header>
                <main className="flex-1">
                    <div className="flex flex-col items-center justify-center px-6 py-20 lg:py-32 bg-white dark:bg-background-dark">
                        <div className="max-w-[800px] w-full text-center flex flex-col items-center gap-8">
                            <div className="flex flex-col gap-4">
                                <span className="inline-flex items-center self-center px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
                                    AI-Powered CRO Auditor
                                </span>
                                <h1 className="text-slate-900 dark:text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                                    Instant conversion audit for your store
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-normal max-w-[600px] mx-auto">
                                    Get a professional-grade CRO audit in seconds. No sign-ups or admin access required. Just clear, actionable results.
                                </p>
                            </div>
                            <div className="w-full max-w-[640px] flex flex-col gap-2">
                                <div id="audit-input-section" className={`w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border transition-all shadow-sm ${error ? "border-red-500 ring-2 ring-red-500/20 animate-in fade-in slide-in-from-bottom-1 duration-300" : "border-slate-200 dark:border-slate-700"}`}>
                                    <form onSubmit={handleSubmit} className="flex flex-col @[480px]:flex-row gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                id="audit-input"
                                                className="w-full h-14 pl-4 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-base font-normal"
                                                placeholder={isInputFocused ? "" : placeholderText}
                                                type="text"
                                                value={url}
                                                onFocus={() => setIsInputFocused(true)}
                                                onBlur={() => setIsInputFocused(false)}
                                                onChange={(e) => {
                                                    setUrl(e.target.value);
                                                    if (error) setError(null); // Clear error on type
                                                }}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <button
                                            disabled={isLoading}
                                            className="h-14 px-8 rounded-lg bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                            type="submit"
                                        >
                                            <span>{isLoading ? "Auditing..." : "Audit Store"}</span>
                                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                        </button>
                                    </form>
                                </div>
                                {error && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm font-bold pl-2 animate-in fade-in slide-in-from-top-1">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-6 text-slate-400 text-sm font-medium">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-lg text-green-500">check_circle</span>
                                    No credit card
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-lg text-green-500">check_circle</span>
                                    60s results
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-lg text-green-500">check_circle</span>
                                    Private
                                </div>
                            </div>
                        </div>
                    </div>
                    <section className="px-6 lg:px-40 py-20 bg-background-light dark:bg-background-dark/50">
                        <div className="max-w-[1200px] mx-auto">
                            <div className="flex flex-col gap-4 mb-12">
                                <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Why audit your store?</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-base max-w-[600px]">Our AI analyzes 50+ conversion factors from page speed to CTA placement to help you sell more.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="size-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl">timer</span>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2">Instant Feedback</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Stop waiting for agencies. Get a comprehensive breakdown of your store&apos;s performance in under 60 seconds.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="size-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl">insights</span>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2">Actionable Insights</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">No fluff. We provide prioritized checklists and clear instructions to improve your UI/UX and increase AOV.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="size-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl">lock</span>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2">Privacy Focused</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">We don&apos;t store your store data or require passwords. Every audit is a stateless check on the current public site.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="px-6 lg:px-40 py-20 bg-white dark:bg-background-dark border-y border-slate-200 dark:border-slate-800">
                        <div className="max-w-[1200px] mx-auto text-center">
                            <h2 className="text-slate-900 dark:text-white text-2xl font-bold mb-10">Trusted by 12,000+ store owners</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                <StatCounter target={12400} suffix="+" label="Audits Completed" />
                                <StatCounter target={24} suffix="%" label="Avg. Conversion Lift" />
                                <StatCounter target={99} suffix="%" label="Success Rate" />
                            </div>
                        </div>
                    </section>
                    <FaqSection className="bg-slate-50 dark:bg-slate-900/50" />
                    <section className="px-6 lg:px-40 py-24 bg-background-light dark:bg-background-dark/50">
                        <div className="max-w-[1000px] mx-auto overflow-hidden rounded-3xl bg-primary shadow-xl flex flex-col md:flex-row relative">
                            <div className="flex-1 p-10 md:p-16 flex flex-col gap-6 text-white z-10">
                                <h2 className="text-3xl md:text-4xl font-black leading-tight">Ready to boost your conversion?</h2>
                                <p className="text-white/80 text-lg">Join thousands of Shopify, WooCommerce, and Magento stores using AI to optimize their checkout flow.</p>
                                <div className="flex gap-4">
                                    <button
                                        suppressHydrationWarning
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const input = document.getElementById("audit-input");

                                            // Scroll to the absolute top to show Header + Hero + Input
                                            window.scrollTo({ top: 0, behavior: "smooth" });

                                            // Focus after scroll
                                            setTimeout(() => {
                                                if (input) {
                                                    (input as HTMLInputElement).focus({ preventScroll: true });
                                                }
                                            }, 800);
                                        }}
                                        className="h-12 px-8 rounded-lg bg-white text-primary font-bold hover:bg-slate-100 transition-colors"
                                    >
                                        Start My Audit
                                    </button>
                                    <button suppressHydrationWarning className="h-12 px-8 rounded-lg border border-white/30 text-white font-bold hover:bg-white/10 transition-colors">View Samples</button>
                                </div>
                            </div>
                            <div className="hidden md:block absolute right-[-10%] top-[-20%] size-96 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="hidden md:block absolute right-0 bottom-[-40%] size-80 bg-blue-400/20 rounded-full blur-3xl"></div>
                        </div>
                    </section>
                </main>
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
                            <a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Privacy</a>
                            <a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Terms</a>
                            <a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div >
    );
}
