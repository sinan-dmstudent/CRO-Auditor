"use client";

import { useEffect, useState } from "react";

export function ProcessingView() {
    // Simulate progress
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((old) => {
                if (old >= 90) return 90; // Stall at 90% until done
                return old + 2;
            });
        }, 200);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen w-full bg-background-light dark:bg-background-dark font-display flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center bg-primary text-white rounded-lg p-1.5">
                            <span className="material-symbols-outlined text-2xl">analytics</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">Audit My Store</h2>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Visual Progress */}
                    <div className="flex flex-col items-center justify-center space-y-8 order-2 lg:order-1">
                        <div className="relative flex items-center justify-center">
                            {/* Outer Ring */}
                            <div className="size-64 lg:size-80 rounded-full border-[12px] border-slate-200 dark:border-slate-800"></div>
                            {/* Active Progress Ring */}
                            <div className="absolute size-64 lg:size-80 rounded-full border-[12px] border-primary border-t-transparent border-r-transparent -rotate-45 animate-spin duration-[3000ms]"></div>
                            {/* Center Content */}
                            <div className="absolute flex flex-col items-center">
                                <span className="text-slate-900 dark:text-white text-6xl lg:text-7xl font-black tracking-tight">
                                    {progress}%
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">
                                    Analyzing Data
                                </span>
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Auditing your store</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                Our AI is simulating a user journey, checking for conversion blockers on mobile and desktop.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Detailed Steps */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm order-1 lg:order-2 h-full max-h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analysis Checklist</h3>
                            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                Live
                            </span>
                        </div>

                        <div className="space-y-6 flex-1">
                            {/* Step 1: Completed */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="size-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">check</span>
                                    </div>
                                    <div className="w-0.5 h-full bg-green-100 dark:bg-green-900/30 my-2"></div>
                                </div>
                                <div className="pb-8">
                                    <h4 className="text-slate-900 dark:text-white font-bold text-lg">Connection Established</h4>
                                    <p className="text-slate-500 text-sm">Successfully accessed store URL and verified SSL.</p>
                                </div>
                            </div>

                            {/* Step 2: In Progress */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center relative">
                                        <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                                    </div>
                                    <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 my-2"></div>
                                </div>
                                <div className="pb-8">
                                    <h4 className="text-slate-900 dark:text-white font-bold text-lg animate-pulse">Running Heuristic Analysis</h4>
                                    <p className="text-slate-500 text-sm">Checking 50+ UX checkpoints across Home, Product, and Cart pages.</p>

                                    {/* Sub-progress bar within the step */}
                                    <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Pending */}
                            <div className="flex gap-4 opacity-50">
                                <div className="flex flex-col items-center">
                                    <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">description</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-slate-900 dark:text-white font-bold text-lg">Generating Report</h4>
                                    <p className="text-slate-500 text-sm">Compiling insights and prioritization matrix.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-xs text-slate-400 font-medium">
                                DO NOT REFRESH THE PAGE
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
