"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

interface StatCounterProps {
    target: number;
    prefix?: string;
    suffix?: string;
    label: string;
}

export function StatCounter({ target, prefix = "", suffix = "", label }: StatCounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const motionValue = useMotionValue(0);
    const numberRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (isInView) {
            animate(motionValue, target, { duration: 2, ease: "easeOut" });
        }
    }, [isInView, target, motionValue]);

    useEffect(() => {
        const unsubscribe = motionValue.on("change", (latest) => {
            if (numberRef.current) {
                numberRef.current.textContent = Math.floor(latest).toLocaleString();
            }
        });
        return unsubscribe;
    }, [motionValue]);

    return (
        <div ref={ref} className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <span className="text-4xl font-black text-primary">
                {prefix}
                <span ref={numberRef}>0</span>
                {suffix}
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>
        </div>
    );
}
