import React, { forwardRef } from "react";

interface Insight {
    section: string;
    severity: "High" | "Medium" | "Low";
    description: string;
    actionable_step: string;
}

interface CompetitorGap {
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low";
    actionable_step: string;
}

interface AuditResults {
    "Homepage": Insight[];
    "Collection Page": Insight[];
    "Product Page": Insight[];
    "Cart Page": Insight[];
    render_method?: string;
    scraped_urls?: {
        homepage: string;
        collection: string;
        product: string;
        cart: string;
    };
    competitor_analysis?: CompetitorGap[];
}

interface PrintableReportProps {
    data: AuditResults;
    url: string;
}

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(({ data, url }, ref) => {
    const displayUrl = url.replace(/^https?:\/\//, "").replace(/^www\./, "").split('/')[0];
    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Stats Logic
    const allInsights = (Object.entries(data)
        .filter(([key]) => key !== "render_method" && key !== "scraped_urls" && key !== "competitor_analysis")
        .map(([, value]) => value) as Insight[][]).flat();

    const highCount = allInsights.filter((i) => i.severity === "High").length;
    const mediumCount = allInsights.filter((i) => i.severity === "Medium").length;
    const lowCount = allInsights.filter((i) => i.severity === "Low").length;

    const penalty = (highCount * 6) + (mediumCount * 3) + (lowCount * 1);
    const score = Math.max(40, Math.round(100 - penalty));

    // Priority Fixes (Top 3 highest severity issues)
    const priorityFixes = [...allInsights].sort((a, b) => {
        const severityScores = { High: 3, Medium: 2, Low: 1 };
        return severityScores[b.severity] - severityScores[a.severity];
    }).slice(0, 3);

    // Strict Page Order
    const ORDERED_PAGES = ["Homepage", "Collection Page", "Product Page", "Cart Page"];

    const PAGE_CHECKLISTS: Record<string, string[]> = {
        "Homepage": [
            "Top Bar/Announcement bar", "Header Section", "Hero Section", "Categories section", "Best Sellers section",
            "Featured Product Section", "Product labels", "USP section", "UGC/Video section", "Testimonials",
            "About Us", "Certification", "Partners", "Instagram feed", "Footer"
        ],
        "Collection Page": [
            "Collection Banner", "Product grid structure", "Filters & Sorting", "Product card elements", "Pagination/infinite scroll"
        ],
        "Product Page": [
            "Product title", "Rating/Preview stars", "Product description", "Image gallery", "Pricing clarity",
            "Offers/incentives", "Variant selectors", "Primary CTAs", "Trust elements", "Delivery/Return info",
            "Review Section", "Persuasion elements", "Objection handling", "Information hierarchy", "Cross-selling"
        ],
        "Cart Page": [
            "Cart layout", "Product summary", "Price breakdown", "Trust elements", "Friction analysis",
            "CTA clarity", "Distraction risks", "Cross-selling"
        ]
    };

    const sections = ORDERED_PAGES
        .map(key => {
            const insights = data[key as keyof AuditResults] as Insight[];
            if (!insights || !Array.isArray(insights) || insights.length === 0) return null;

            const pageChecklist = PAGE_CHECKLISTS[key] || [];

            const getFuzzyIndex = (sectionName: string, checklist: string[]) => {
                const distinctName = sectionName.toLowerCase().trim();
                let idx = checklist.findIndex(item => item.toLowerCase() === distinctName);
                if (idx !== -1) return idx;
                idx = checklist.findIndex(item => {
                    const checkItem = item.toLowerCase();
                    return checkItem.includes(distinctName) || distinctName.includes(checkItem);
                });
                return idx === -1 ? 999 : idx;
            };

            const sortedInsights = [...insights].sort((a, b) => {
                const indexA = getFuzzyIndex(a.section, pageChecklist);
                const indexB = getFuzzyIndex(b.section, pageChecklist);
                if (indexA === 999 && indexB === 999) {
                    return a.section.localeCompare(b.section);
                }
                return indexA - indexB;
            });

            return [key, sortedInsights];
        })
        .filter(entry => entry !== null) as [string, Insight[]][];

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'High': return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case 'Medium': return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            case 'Low': return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            default: return "";
        }
    };

    const getPageIcon = (pageName: string) => {
        if (pageName === "Homepage") return "home";
        if (pageName === "Collection Page") return "grid_view";
        if (pageName === "Product Page") return "shopping_bag";
        if (pageName === "Cart Page") return "shopping_cart_checkout";
        return "view_quilt";
    };

    // Note: The print preview automatically forces a white background for print via standard browser rules
    // using the Tailwind print:* modifiers would work, but inline styles are guaranteed for `react-to-print`.
    // The wrapper size of 800px closely mimics an A4 width for the preview generation.
    const pageBreakInsideAvoid = { pageBreakInside: 'avoid' as const };

    return (
        <div ref={ref} className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased print:bg-white w-[800px] print:w-full mx-auto print:mx-0">
            {/* Main Report Container (A4 Proportions) */}
            <div className="max-w-[800px] print:max-w-full mx-auto bg-white dark:bg-slate-900 shadow-xl my-8 min-h-[1123px] print:min-h-0 flex flex-col border border-slate-200 dark:border-slate-800 print:shadow-none print:my-0 print:border-none">

                {/* Header */}
                <header className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-3xl font-bold">analytics</span>
                            <h1 className="text-xl font-black uppercase tracking-tight">Audit My Store</h1>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                            <span className="material-symbols-outlined text-sm">language</span>
                            <span>{displayUrl}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Report Generated</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{generatedDate}</p>
                    </div>
                </header>

                {/* Summary Section */}
                <div className="px-10 py-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800" style={pageBreakInsideAvoid}>
                    <div className="grid grid-cols-12 gap-8 items-center">
                        <div className="col-span-4 flex flex-col items-center justify-center border-r border-slate-200 dark:border-slate-700 py-4">
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Conversion Score</p>
                            <div className="relative flex items-center justify-center">
                                <span className="text-6xl font-black text-primary">{score}</span>
                                <span className="text-xl font-bold text-slate-400">/100</span>
                            </div>
                        </div>
                        <div className="col-span-8">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">priority_high</span>
                                Priority Fixes
                            </h2>
                            <ul className="space-y-3">
                                {priorityFixes.length > 0 ? priorityFixes.map((fix, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <span className="material-symbols-outlined text-primary text-xs mt-1 shrink-0">check_box</span>
                                        <span className="leading-relaxed whitespace-pre-wrap">{fix.actionable_step}</span>
                                    </li>
                                )) : (
                                    <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <span>No high priority fixes found. Excellent performance!</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Report Body */}
                <main className="p-10 flex-grow space-y-8">
                    {sections.map(([pageName, insights]) => (
                        <div key={pageName} className="space-y-8">
                            {/* Instead of a loose header, we show the page icon in each insight card, 
                                but to follow the HTML EXACTLY, we map each insight into an Audit Card. */}
                            {insights.map((insight, idx) => (
                                <div key={`${pageName}-${idx}`} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden" style={pageBreakInsideAvoid}>
                                    <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary">{getPageIcon(pageName)}</span>
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{insight.section} <span className="text-slate-400 font-normal text-sm">({pageName})</span></h3>
                                        </div>
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getSeverityBadge(insight.severity)}`}>
                                            {insight.severity} Impact
                                        </span>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs font-bold uppercase text-slate-400 mb-2">Problem & Pain</p>
                                            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                {insight.description}
                                            </div>
                                        </div>
                                        <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                                            <p className="text-xs font-bold uppercase text-primary mb-2">The Fix & Future</p>
                                            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                {insight.actionable_step}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </main>

                {/* Footer */}
                <footer className="px-10 py-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-auto">
                    <div>
                        Powered by <span className="text-primary">Audit My Store</span>
                    </div>
                    <div className="flex gap-4">
                        <span>Report Extracted</span>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <span>Confidential Report</span>
                    </div>
                </footer>
            </div>
        </div>
    );
});

PrintableReport.displayName = "PrintableReport";
