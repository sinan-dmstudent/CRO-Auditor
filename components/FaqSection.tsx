"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItemConfig {
    question: string;
    answer: string;
}

const FAQS: FaqItemConfig[] = [
    {
        question: "Does this work for any platform?",
        answer: "Yes. We analyze the frontend user experience. Whether you use Shopify, WooCommerce, Magento, or custom code, the principles of conversion optimization are the same."
    },
    {
        question: "Do you need my passwords?",
        answer: "No. Our tool scans your public website just like a customer does. We never ask for backend access or credentials."
    },
    {
        question: "Is it really free?",
        answer: "The basic audit is completely free. We offer premium deep-dives for larger stores, but you get actionable value immediately without paying a cent."
    },
    {
        question: "How long does the audit take?",
        answer: "Typically less than 60 seconds. Our AI engine processes the page structure and content in parallel to give you near-instant feedback."
    }
];

export function FaqSection({ className }: { className?: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={cn("px-6 lg:px-40 py-20 bg-white dark:bg-background-dark", className)}>
            <div className="max-w-[800px] mx-auto">
                <h2 className="text-2xl font-bold text-center mb-12 text-slate-900 dark:text-white">Common Questions</h2>
                <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            className={`rounded-xl border transition-all duration-200 ${openIndex === index
                                ? "border-primary/50 bg-primary/5 dark:bg-primary/10 shadow-sm"
                                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                aria-expanded={openIndex === index}
                                suppressHydrationWarning
                            >
                                <div className="flex items-center gap-3">
                                    <HelpCircle className={`size-5 transition-colors ${openIndex === index ? "text-primary" : "text-slate-400"}`} />
                                    <span className={`font-bold text-lg ${openIndex === index ? "text-primary dark:text-primary-foreground" : "text-slate-900 dark:text-white"}`}>
                                        {faq.question}
                                    </span>
                                </div>
                                {openIndex === index ? (
                                    <ChevronUp className="size-5 text-primary" />
                                ) : (
                                    <ChevronDown className="size-5 text-slate-400" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 pt-0 pl-[3.25rem]">
                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
