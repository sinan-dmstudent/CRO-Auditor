"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintableReport } from "./PrintableReport";

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

// New Structured Data Interface
interface AuditResults {
    "Homepage": Insight[];
    "Collection Page": Insight[];
    "Product Page": Insight[];
    "Cart Page": Insight[];
    render_method?: string; // Optional flag from backend
    scraped_urls?: {
        homepage: string;
        collection: string;
        product: string;
        cart: string;
    };
    competitor_analysis?: CompetitorGap[];
}

interface ResultsViewProps {
    data: AuditResults | Insight[]; // Handling backward compatibility briefly or strict typed
    url: string;
}

export function ResultsView({ data, url }: ResultsViewProps) {
    // Normalize data: ensure we have the structured format. 
    // If it's the old array format (unlikely now), we guard against it.
    const structuredData = Array.isArray(data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? { "Old Format": data } as any
        : data as AuditResults;

    const [competitorUrl, setCompetitorUrl] = React.useState("");
    const [isAnalyzingCompetitor, setIsAnalyzingCompetitor] = React.useState(false);
    const [competitorGaps, setCompetitorGaps] = React.useState<CompetitorGap[] | null>(structuredData.competitor_analysis || null);

    // PDF Print Logic
    const displayUrl = url.replace(/^https?:\/\//, "").replace(/^www\./, "").split('/')[0];
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `CRO_Audit_${displayUrl}`,
        pageStyle: `@page { size: auto; margin: 20mm !important; }`,
        suppressErrors: true
    });

    const handleCompetitorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!competitorUrl.trim()) return;

        setIsAnalyzingCompetitor(true);
        try {
            const response = await fetch('/api/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url, competitorUrl: competitorUrl })
            });

            if (!response.ok) throw new Error("Failed analyze competitor");

            const newData: AuditResults = await response.json();
            if (newData.competitor_analysis) {
                setCompetitorGaps(newData.competitor_analysis);
            }
        } catch (error) {
            console.error(error);
            alert("Error analyzing competitor.");
        } finally {
            setIsAnalyzingCompetitor(false);
        }
    };

    // Clean URL for display
    // (moved displayUrl up for documentTitle usage)

    // Stats Logic (exclude non-insight keys)
    const allInsights = (Object.entries(structuredData)
        .filter(([key]) => key !== "render_method" && key !== "scraped_urls" && key !== "competitor_analysis")
        .map(([, value]) => value) as Insight[][]).flat();

    // Calibrated Scoring Logic (Fair & Weighted)
    const highCount = allInsights.filter((i) => i.severity === "High").length;
    const mediumCount = allInsights.filter((i) => i.severity === "Medium").length;
    const lowCount = allInsights.filter((i) => i.severity === "Low").length;

    // Deductions: High (-6), Medium (-3), Low (-1)
    // "Sales-Friendly" Model: Keeps users motivated in the 60-80 range.
    const penalty = (highCount * 6) + (mediumCount * 3) + (lowCount * 1);

    // Ensure score never drops below 40.
    const score = Math.max(40, Math.round(100 - penalty));

    // Helper for badge colors
    const getBadgeStyles = (severity: string) => {
        switch (severity) {
            case "High":
                return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
            case "Medium":
                return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
            case "Low":
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    // Strict Page Order
    const ORDERED_PAGES = ["Homepage", "Collection Page", "Product Page", "Cart Page"];

    // Master Checklist Maps (Page-Specific)
    const PAGE_CHECKLISTS: Record<string, string[]> = {
        "Homepage": [
            "Top Bar / Announcement Bar", "Header Section", "Hero Section", "Categories Section", "Best Sellers Section",
            "Featured Product Section", "USP Section", "UGC / Video Section", "Testimonials / Reviews Section",
            "About Us Section", "Certification Section", "Partners Section", "Instagram Feed", "Footer", "Newsletter / Email Capture"
        ],
        "Collection Page": [
            "Collection Banner", "Product Grid Structure", "Filters & Sorting", "Product Card Elements", "Pagination / Infinite Scroll"
        ],
        "Product Page": [
            "Product Title", "Rating / Review Stars", "Product Description", "Image Gallery", "Pricing Clarity",
            "Offers / Incentives", "Variant Selectors", "Primary CTA", "Trust Elements", "Delivery / Return Information",
            "Review Section", "Persuasion Elements", "Objection Handling", "Information Hierarchy", "Cross-Selling / Related Products"
        ],
        "Cart Page": [
            "Cart Layout", "Product Summary", "Price Breakdown", "Trust Elements", "Friction Analysis",
            "CTA Clarity", "Distraction Risks", "Cross-Selling"
        ]
    };

    const sections = ORDERED_PAGES
        .map(key => {
            const insights = structuredData[key as keyof AuditResults] as Insight[];
            if (!insights || !Array.isArray(insights) || insights.length === 0) return null;

            // Get the specific checklist for this page
            const pageChecklist = PAGE_CHECKLISTS[key] || [];

            // Smart Fuzzy Match Helper
            const getFuzzyIndex = (sectionName: string, checklist: string[]) => {
                const distinctName = sectionName.toLowerCase().trim();

                // 1. Exact Match (Fastest)
                let idx = checklist.findIndex(item => item.toLowerCase() === distinctName);
                if (idx !== -1) return idx;

                // 2. Partial Match (Robust) behavior:
                // If "Top Bar" is returned, it should match "Top Bar/Announcement bar"
                idx = checklist.findIndex(item => {
                    const checkItem = item.toLowerCase();
                    return checkItem.includes(distinctName) || distinctName.includes(checkItem);
                });

                return idx === -1 ? 999 : idx;
            };

            // Strict Sort by Page-Specific Order using Fuzzy Match
            const sortedInsights = [...insights].sort((a, b) => {
                const indexA = getFuzzyIndex(a.section, pageChecklist);
                const indexB = getFuzzyIndex(b.section, pageChecklist);

                // If both are unknown (999), sort alphabetically to be stable
                if (indexA === 999 && indexB === 999) {
                    return a.section.localeCompare(b.section);
                }

                return indexA - indexB;
            });

            return [key, sortedInsights];
        })
        .filter(entry => entry !== null) as [string, Insight[]][];

    const scrapedUrls = structuredData.scraped_urls;

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-20 py-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg text-white">
                                <span className="material-symbols-outlined block text-2xl">analytics</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">Audit My Store</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end mr-4">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Auditing URL</span>
                                <span className="text-sm font-medium text-primary">{displayUrl}</span>
                            </div>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-lg">print</span>
                                <span className="hidden sm:inline">Download PDF</span>
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                <span>New Audit</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto w-full px-6 lg:px-20 py-8">
                    {/* Header Section with Screenshot */}
                    <div className="flex flex-col lg:flex-row gap-8 mb-12 items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded uppercase">Completed</span>
                                <span className="text-slate-500 dark:text-slate-400 text-sm italic">Audit generated just now</span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">Audit Results for {displayUrl}</h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                                We&apos;ve analyzed your storefront using our AI conversion engine. Below are key insights categorized by page type to improve your customer journey.
                            </p>

                            {/* Coverage Indicators */}
                            {scrapedUrls && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {Object.entries(scrapedUrls).map(([key, value]) => (
                                        <div key={key} className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${value === 'Not Detected' || value === 'Failed'
                                            ? 'bg-red-50 text-red-600 border-red-200'
                                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                            <span className="capitalize">{key}</span>:
                                            {value === 'Not Detected' || value === 'Failed' ? 'Missing ✕' : 'Detected ✓'}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-6 mt-6">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{score}/100</span>
                                    <span className="text-sm text-slate-500 uppercase font-medium">Conversion Score</span>
                                </div>
                                <div className="w-px h-10 bg-slate-200 dark:border-slate-800"></div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-orange-500">{highCount} High</span>
                                    <span className="text-sm text-slate-500 uppercase font-medium">Priority Fixes</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-80 shrink-0">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl cursor-pointer"
                            >
                                <div
                                    className="w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7RRSCMDo1rvUq-zygJTglOrWQGd4ehXWlIzTVz6vWtopcCaNUNHR5I1v1GY2K_Sp9CJyFrr7Q37qUBQFoQ9CVdf-lzIS5nmw_wbUAbW7XCDQ3gIsdAqKlJU76ixZtA9ij9eYku5alKPg2tpYi0QFH0OObhmIlliLIWHmXkbwyrE3OVNBIDV8KWbS6POBlKXGIoIsElVBwGzxf361RNyT071CUrOYJ_i6vaI0XIiyosjrUOr0Bv2E6nP-U-d769h7JZn-aJlSaulI')" }}
                                >
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <span className="text-white text-xs font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                        Visit Site
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Section-Based Insights Stream */}
                    <div className="space-y-12">
                        {sections.map(([sectionName, insights], sectionIdx) => (
                            <div key={sectionIdx} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{sectionName}</h2>
                                    <div className="h-px flex-1 bg-slate-200 dark:border-slate-800"></div>
                                    <span className="text-sm font-medium text-slate-500">{insights.length} Insights</span>
                                </div>

                                {insights.length === 0 ? (
                                    <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500">
                                        No critical issues detected in this section. Good job!
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {insights.map((item, idx) => (
                                            <AuditInsightCard
                                                key={idx}
                                                item={item}
                                                getBadgeStyles={getBadgeStyles}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Competitor Kill-Screen (Comparative Results) */}
                    {competitorGaps && competitorGaps.length > 0 && (
                        <div className="mt-12 mb-12 p-8 md:p-10 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-3xl -tranglate-y-1/2 translate-x-1/3"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="material-symbols-outlined text-red-500 text-3xl">swords</span>
                                    <h2 className="text-3xl font-black tracking-tight text-white">Competitor Kill-Screen</h2>
                                    <span className="ml-auto px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider border border-red-500/30">
                                        Gap Analysis Letal
                                    </span>
                                </div>
                                <p className="text-slate-400 mb-8 max-w-2xl text-lg">
                                    We analyzed your competitor&apos;s primary funnel. Below are the critical psychological triggers and UX choices they are using to steal your conversions.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {competitorGaps.map((gap, idx) => (
                                        <div key={idx} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/80 transition-colors">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="size-10 bg-red-500/10 text-red-400 rounded-lg flex items-center justify-center border border-red-500/20">
                                                    <span className="material-symbols-outlined font-bold">warning</span>
                                                </div>
                                            </div>
                                            <h4 className="text-xl font-bold text-white mb-3">{gap.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed mb-6">{gap.description}</p>

                                            <div className="mt-auto pt-4 border-t border-slate-700/50">
                                                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                                                    How to steal it
                                                </h5>
                                                <p className="text-sm text-slate-300 font-medium">{gap.actionable_step}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom CTA to Trigger Kill-Screen */}
                    {(!competitorGaps || competitorGaps.length === 0) && (
                        <div className="mt-12 p-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">visibility</span>
                                    Spy on a Competitor
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400">Our AI can run a comparative Kill-Screen audit against your biggest rival to reveal what they do better.</p>
                            </div>
                            <form onSubmit={handleCompetitorSubmit} className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                                <input
                                    type="url"
                                    required
                                    placeholder="https://competitor.com"
                                    value={competitorUrl}
                                    onChange={(e) => setCompetitorUrl(e.target.value)}
                                    className="flex-1 h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={isAnalyzingCompetitor}
                                    className="h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 rounded-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isAnalyzingCompetitor ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Run Analysis'
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </main>

                {/* Simple Footer */}
                <footer className="max-w-7xl mx-auto w-full px-6 lg:px-20 py-10 border-t border-slate-200 dark:border-slate-800 mt-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">© 2024 Audit My Store. No login required.</p>
                        <div className="flex gap-6">
                            <a className="text-sm text-slate-500 hover:text-primary" href="#">Terms</a>
                            <a className="text-sm text-slate-500 hover:text-primary" href="#">Privacy</a>
                            <a className="text-sm text-slate-500 hover:text-primary" href="#">Contact</a>
                        </div>
                    </div>
                </footer>
            </div>

            <div style={{ display: 'none' }}>
                <PrintableReport ref={printRef} data={structuredData} url={url} />
            </div>
        </div>
    );
}

/**
 * Sub-component for individual audit insight card to manage its own 'Fixed' state.
 */
function AuditInsightCard({ item, getBadgeStyles }: { item: Insight, getBadgeStyles: (severity: string) => string }) {
    const [isFixed, setIsFixed] = React.useState(false);

    return (
        <div className={cn(
            "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden",
            isFixed && "opacity-75 border-emerald-200 dark:border-emerald-900/50"
        )}>
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "size-10 flex items-center justify-center rounded-lg transition-colors",
                        isFixed ? "bg-emerald-100 text-emerald-600" : "bg-primary/10 text-primary"
                    )}>
                        <span className="material-symbols-outlined">
                            {isFixed ? "check_circle" :
                                item.section.toLowerCase().includes('hero') ? 'top_panel_close' :
                                    item.section.toLowerCase().includes('product') ? 'shopping_cart' :
                                        'verified'}
                        </span>
                    </div>
                    <h3 className={cn("text-lg font-bold transition-colors", isFixed && "text-emerald-600")}>
                        {item.section}
                    </h3>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${isFixed ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : getBadgeStyles(item.severity)}`}>
                    {isFixed ? "Fixed" : `${item.severity} Impact`}
                </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Problem & Pain</h4>
                    <div className={cn("text-slate-700 dark:text-slate-300 leading-relaxed text-base transition-all whitespace-pre-wrap", isFixed && "text-slate-400")}>
                        {item.description}
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">The Fix & Future</h4>
                    <div className={cn("text-slate-700 dark:text-slate-300 leading-relaxed text-base transition-all whitespace-pre-wrap", isFixed && "text-slate-400")}>
                        {item.actionable_step}
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap justify-end items-center gap-4">
                <div className="flex items-center gap-3">
                    {!isFixed ? (
                        <>
                            <button className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Ignore</button>
                            <button
                                onClick={() => {
                                    setIsFixed(true);
                                }}
                                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <span>Mark as Fixed</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4 text-emerald-600 py-1 px-1">
                            <span className="material-symbols-outlined text-3xl animate-in zoom-in duration-300">check_circle</span>
                            <button
                                onClick={() => setIsFixed(false)}
                                className="text-xs font-medium text-slate-500 hover:text-primary underline transition-colors"
                            >
                                Undo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Re-using utils
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}

