import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-40 py-4">
                <div className="flex items-center gap-3 text-primary">
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
                        <Link className="text-primary text-sm font-semibold" href="/about">About</Link>
                    </nav>
                    <Link href="/" className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90">
                        Get Started
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-white dark:bg-background-dark py-16 md:py-24 overflow-hidden">
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                    </div>
                    <div className="max-w-5xl mx-auto px-6 text-center relative z-10">

                        <h1 className="text-slate-900 dark:text-slate-100 text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
                            About Haris&amp;Co. &amp; <span className="text-primary">Audit My Store</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
                            Empowering e-commerce brands with data-driven strategies and AI-powered insights to unlock hidden growth potential.
                        </p>
                    </div>
                </section>

                {/* Agency Section */}
                <section className="py-16 md:py-20 bg-background-light dark:bg-slate-900/50">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold mb-6">The Agency</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                                    Haris&amp;Co. is a premier, full-suite digital marketing agency based in Calicut, Kerala. While we partner with top brands across various industries, our specialized e-commerce division stands at the forefront of the market. We are recognized leaders in developing elite, data-driven growth strategies and executing advanced conversion rate optimization (CRO) to scale e-commerce businesses to their absolute peak.
                                </p>
                                <a
                                    href="https://harisand.co"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 transition-all text-white font-bold rounded-lg w-fit mt-2 shadow-sm hover:shadow-md group"
                                >
                                    <span>Work with Our Experts</span>
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </a>
                            </div>
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img alt="Haris&amp;Co Office" className="w-full h-full object-cover" data-alt="Modern minimalist digital marketing agency office space" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW4wTlCmT5TCHDsk-wLnzhY7B9MHg9qGkLuVoM2KGjp5KHI_K8dMhLw9zGMFVgN6cHIcmD_kpkFb6SbISpTmroTObEhT3daxQqBmVQfBAcqO7daTJ7KhkzgINecJ5ZWkDFUXPZlM93TCd34T5cOtHOA5YsRnjVHDNjdD69l-iUHWtuqAm6cMFguhL2h6Hrvf7uNpriaInzoO58jAzjjFGVnehaiertNifImzDAFIF3uZEhEka2Y-V6C7IreqdI_DzlUS_gsPLvRSw" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tool Section */}
                <section className="py-16 md:py-20 bg-white dark:bg-background-dark">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 relative aspect-square md:aspect-video rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                                <div className="p-8 text-center">
                                    <span className="material-symbols-outlined text-primary text-7xl mb-4 block">psychology</span>
                                    <div className="space-y-2">
                                        <div className="h-2 w-32 bg-primary/20 rounded-full mx-auto"></div>
                                        <div className="h-2 w-24 bg-primary/10 rounded-full mx-auto"></div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
                            </div>
                            <div className="order-1 md:order-2">
                                <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold mb-6">The Tool</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                                    Audit My Store was born out of our passion for performance. We wanted to create a zero-barrier tool that gives store owners instant, expert-level feedback using state-of-the-art AI, helping them identify and fix conversion blockers in seconds.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                        <span className="text-slate-700 dark:text-slate-300">Instant AI-driven analysis</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                        <span className="text-slate-700 dark:text-slate-300">Expert-level CRO feedback</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                        <span className="text-slate-700 dark:text-slate-300">Zero-barrier accessibility</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 bg-primary text-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <span className="material-symbols-outlined text-white/80 text-5xl mb-6">rocket_launch</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
                        <p className="text-xl md:text-2xl font-medium leading-relaxed italic opacity-90">
                            &quot;To democratize conversion intelligence for every store owner, regardless of their technical background.&quot;
                        </p>
                    </div>
                </section>

                {/* Features/Values Grid */}
                <section className="py-20 bg-white dark:bg-background-dark">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow bg-background-light/30 dark:bg-slate-900/30">
                                <span className="material-symbols-outlined text-primary text-4xl mb-4">trending_up</span>
                                <h3 className="text-xl font-bold mb-3">Growth Mindset</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">We focus on metrics that matter, ensuring every recommendation leads to measurable business growth.</p>
                            </div>
                            <div className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow bg-background-light/30 dark:bg-slate-900/30">
                                <span className="material-symbols-outlined text-primary text-4xl mb-4">auto_awesome</span>
                                <h3 className="text-xl font-bold mb-3">AI Powered</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Leveraging the latest in artificial intelligence to provide deep insights that human audits might miss.</p>
                            </div>
                            <div className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow bg-background-light/30 dark:bg-slate-900/30">
                                <span className="material-symbols-outlined text-primary text-4xl mb-4">verified</span>
                                <h3 className="text-xl font-bold mb-3">Trustworthy Data</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Our strategies are built on solid data foundations, eliminating guesswork from your marketing strategy.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-background-light dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-bold mb-4">Meet the Team</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">The experts behind Haris&amp;Co. dedicated to driving your e-commerce success.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Member 1 */}
                            <div className="bg-white dark:bg-background-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                                    <span className="material-symbols-outlined text-primary text-4xl">person</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Haris Akram</h3>
                                <p className="text-primary font-semibold text-sm mb-4">Founder &amp; CEO</p>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Leading the vision to empower e-commerce brands with data-driven growth strategies.
                                </p>
                            </div>
                            {/* Member 2 */}
                            <div className="bg-white dark:bg-background-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                                    <span className="material-symbols-outlined text-primary text-4xl">person</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Sarah Chen</h3>
                                <p className="text-primary font-semibold text-sm mb-4">Lead UX Designer</p>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Crafting intuitive and high-converting user experiences for global storefronts.
                                </p>
                            </div>
                            {/* Member 3 */}
                            <div className="bg-white dark:bg-background-dark p-8 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                                    <span className="material-symbols-outlined text-primary text-4xl">person</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Alex Rivest</h3>
                                <p className="text-primary font-semibold text-sm mb-4">Digital Strategist</p>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Turning complex data sets into actionable marketing insights and growth loops.
                                </p>
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
    );
}
