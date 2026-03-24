import { NextResponse } from 'next/server';
import { crawlStore } from '@/lib/crawler';
import { openai } from '@/lib/openai';
import { z } from 'zod';
import { AUDIT_RULES } from '@/lib/auditRules';
import { getPageInstructions } from '@/lib/auditInstructions';

export const maxDuration = 60;

interface Insight {
    section: string;
    severity: string;
    description: string;
    actionable_step: string;
}

interface CompetitorGap {
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low";
    actionable_step: string;
}

// Niche metadata extracted from the store
interface NicheContext {
    description: string;        // e.g. "luxury skincare brand targeting women aged 30-50"
    purchaseDriver: "emotional" | "rational" | "mixed";
    pricePoint: "luxury" | "mid-range" | "budget";
    excludedSections: string[]; // Checklist sections irrelevant to this niche
}

const RequestSchema = z.object({
    url: z.string().url(),
    competitorUrl: z.string().url().optional().or(z.literal(''))
});

// --- SECTION ORDER DEFINITIONS ---
const SECTION_ORDER = {
    "Homepage": [
        "Top Bar / Announcement Bar",
        "Header Section (Menu, Search, Cart, Account)",
        "Hero Section (Banners, Headline, Copy, CTA Button)",
        "Categories Section (Shop by Categories with Image + CTA)",
        "Best Sellers Section",
        "Featured Product Section",
        "USP Section (Icons with USP text)",
        "UGC / Video Section",
        "Testimonials / Reviews Section",
        "About Us Section (Short brand intro + CTA to About page)",
        "Certification Section",
        "Partners Section",
        "Instagram Feed",
        "Footer",
        "Newsletter / Email Capture"
    ],
    "Collection Page": [
        "Collection Banner",
        "Product Grid Structure",
        "Filters & Sorting",
        "Product Card Elements (image, price, rating, CTA, badges)",
        "Pagination / Infinite Scroll"
    ],
    "Product Page": [
        "Product Title",
        "Rating / Review Stars",
        "Product Description (Benefits-focused)",
        "Image Gallery",
        "Pricing Clarity",
        "Offers / Incentives",
        "Variant Selectors",
        "Primary CTA (Add to Cart / Buy Now)",
        "Trust Elements",
        "Delivery / Return Information",
        "Review Section",
        "Persuasion Elements",
        "Objection Handling",
        "Information Hierarchy",
        "Cross-Selling / Related Products"
    ],
    "Cart Page": [
        "Cart Layout",
        "Product Summary",
        "Price Breakdown",
        "Trust Elements",
        "Friction Analysis",
        "CTA Clarity",
        "Distraction Risks",
        "Cross-Selling"
    ]
};

// Niche-to-exclusion map: sections to SKIP based on purchase driver and category
function buildExclusionList(nicheDesc: string, pricePoint: string): string[] {
    const lowerNiche = nicheDesc.toLowerCase();
    const excluded: string[] = [];

    // Certification is only relevant for regulated niches (supplements, skincare, food, health)
    const needsCertification = ["supplement", "skincare", "beauty", "health", "food", "vitamin", "medical", "organic", "natural", "clinical", "wellness"];
    if (!needsCertification.some(kw => lowerNiche.includes(kw))) {
        excluded.push("Certification Section");
    }

    // Instagram Feed is less relevant for B2B, industrial, or digital product stores
    const skipInstagram = ["b2b", "wholesale", "industrial", "saas", "software", "digital", "download", "ebook"];
    if (skipInstagram.some(kw => lowerNiche.includes(kw))) {
        excluded.push("Instagram Feed");
    }

    // Partners Section only relevant if the brand has notable brand partners
    const skipPartners = ["handmade", "indie", "small batch", "artisan", "solo brand"];
    if (skipPartners.some(kw => lowerNiche.includes(kw))) {
        excluded.push("Partners Section");
    }

    // Newsletter is always optional — never flag it as missing
    excluded.push("Newsletter / Email Capture");

    return excluded;
}

function sortInsights(pageName: keyof typeof SECTION_ORDER, insights: Insight[]) {
    if (!insights || !Array.isArray(insights)) return [];
    const orderList = SECTION_ORDER[pageName] || [];
    return insights.sort((a, b) => {
        const getIndex = (section: string) => {
            let idx = orderList.indexOf(section);
            if (idx === -1) {
                idx = orderList.findIndex(item => section.includes(item) || item.includes(section));
            }
            return idx === -1 ? 999 : idx;
        };
        return getIndex(a.section) - getIndex(b.section);
    });
}

export async function POST(req: Request) {
    try {
        // 1. Validation
        const body = await req.json();
        const parseResult = RequestSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({
                "Homepage": [{
                    section: "Input",
                    severity: "High",
                    description: "Invalid URL provided.",
                    actionable_step: "Please enter a valid full URL (e.g., https://example.com)."
                }],
                "Collection Page": [],
                "Product Page": [],
                "Cart Page": []
            }, { status: 200 });
        }

        const { url, competitorUrl } = parseResult.data;

        // 2. Multi-Page Crawling
        let crawlResult;
        let competitorCrawlResult = null;
        try {
            const crawlPromises = [crawlStore(url)];
            if (competitorUrl) {
                crawlPromises.push(crawlStore(competitorUrl));
            }
            const results = await Promise.all(crawlPromises);
            crawlResult = results[0];
            if (results.length > 1) {
                competitorCrawlResult = results[1];
            }
        } catch (scrapeError) {
            console.error("Scraping failed:", scrapeError);
            return NextResponse.json({
                "Homepage": [{
                    section: "Access",
                    severity: "High",
                    description: "We couldn't visit this store.",
                    actionable_step: "The site might be blocking bots, is down, or took too long to load. Please check the URL."
                }],
                "Collection Page": [],
                "Product Page": [],
                "Cart Page": []
            });
        }

        // 3. Rich Niche Context Identification
        let nicheContext: NicheContext = {
            description: "e-commerce store",
            purchaseDriver: "mixed",
            pricePoint: "mid-range",
            excludedSections: ["Newsletter / Email Capture", "Certification Section"]
        };

        try {
            console.log("Identifying Rich Niche Context...");
            const nicheResponse = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                    role: "user",
                    content: `Analyze this e-commerce store's homepage HTML and provide a niche analysis. Return STRICT JSON only.

Format:
{
  "description": "one sentence describing the niche, price point, and target buyer (max 20 words)",
  "purchaseDriver": "emotional" or "rational" or "mixed",
  "pricePoint": "luxury" or "mid-range" or "budget"
}

Rules:
- purchaseDriver is "emotional" for: fashion, beauty, lifestyle, luxury, home decor, gifts, apparel
- purchaseDriver is "rational" for: supplements, tools, electronics, B2B, health, software, appliances
- purchaseDriver is "mixed" for: sports, fitness, food, pet products, outdoor gear
- pricePoint is "luxury" if products are clearly premium/designer/high-end
- pricePoint is "budget" if store emphasizes deals, discounts, or mass-market pricing

HTML Snippet (first 8000 chars):
${crawlResult.home?.html?.slice(0, 8000)}`
                }],
                response_format: { type: "json_object" },
                temperature: 0,
            });

            const nicheJson = JSON.parse(nicheResponse.choices[0].message?.content || "{}");
            const detectedExclusions = buildExclusionList(nicheJson.description || "", nicheJson.pricePoint || "mid-range");

            nicheContext = {
                description: nicheJson.description || "e-commerce store",
                purchaseDriver: nicheJson.purchaseDriver || "mixed",
                pricePoint: nicheJson.pricePoint || "mid-range",
                excludedSections: detectedExclusions
            };

            console.log("Niche Context:", nicheContext);
        } catch (nicheError) {
            console.error("Niche Identification failed, using defaults:", nicheError);
        }

        // 4. Section Analysis Worker
        const analyzeSection = async (
            sectionName: string,
            pageData?: { html: string; screenshot: string; desktopScreenshot?: string },
            niche: NicheContext = nicheContext
        ) => {
            if (!pageData) {
                console.log(`Skipping ${sectionName} - No data found.`);
                return { [sectionName]: [] };
            }

            const excludedList = niche.excludedSections.length > 0
                ? `EXCLUDED_SECTIONS (do NOT audit these, do NOT flag as missing): ${niche.excludedSections.join(", ")}`
                : "EXCLUDED_SECTIONS: None";

            const prompt = `
GLOBAL CONTEXT: You are auditing a **${niche.description}**.
Purchase Driver: **${niche.purchaseDriver.toUpperCase()}** (${niche.purchaseDriver === 'emotional' ? 'focus on Aspiration, Status, Exclusivity, Social Proof' : niche.purchaseDriver === 'rational' ? 'focus on Trust, Efficacy, Clinical Proof, Risk Reversal' : 'balance emotional appeal with rational proof'})
Price Point: **${niche.pricePoint.toUpperCase()}**

${excludedList}

You are a CRO Specialist auditing ONLY the **${sectionName}**.

STRICT AUDIT RULES:
${AUDIT_RULES}

AUDIT INSTRUCTIONS FOR ${sectionName.toUpperCase()}:
${getPageInstructions(sectionName)}

TASK:
1. Use the checklist above for "${sectionName}" ONLY.
2. SKIP any section in EXCLUDED_SECTIONS — do not mention them at all.
3. Verify each item against the evidence signals (HTML + screenshot).
4. Only flag as "Missing" High severity if you find NO evidence in either source.
5. Self-verify every High/Missing finding before outputting.
6. Output STRICT JSON only. No markdown, no extra text.
7. Format: { "${sectionName}": [{ "section": "...", "severity": "High|Medium|Low", "description": "...", "actionable_step": "..." }] }

FORMATTING:
- Use • bullet points. Each bullet on its own line (\\n).
- description: Observation • User Psychology • Lost Sale Example • Financial Toll
- actionable_step: What To Do • Exact Copy/Design Spec • Expected Revenue Gain
- Do NOT use labels like "Observation:" — just write the bullets.
- Cover ALL non-excluded checklist items. Do not stop early.

## ${sectionName} Page Data
HTML (Body):
${pageData.html}

Below are screenshots. First is mobile (390px).${pageData.desktopScreenshot ? ' Second is desktop (1280px) — use BOTH to detect desktop-only elements.' : ''}

${sectionName} Mobile Screenshot:
`;

            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const imageContent: any[] = [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${pageData.screenshot}` } }
                ];
                // Add desktop screenshot as second image if available
                if (pageData.desktopScreenshot) {
                    imageContent.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${pageData.desktopScreenshot}` } });
                }
                const response = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "user",
                            content: imageContent
                        }
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0,
                });

                const text = response.choices[0].message?.content || "{}";
                const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
                const json = JSON.parse(cleanText);
                return json;

            } catch (error) {
                console.error(`Analysis failed for ${sectionName}:`, error);
                // Return a visible error card instead of silently hiding the section
                return {
                    [sectionName]: [{
                        section: "Analysis Error",
                        severity: "Medium",
                        description: `• The ${sectionName} audit could not be completed.\n• This is usually caused by the page taking too long to respond, or the store blocking our scanner.\n• The store may have bot protection enabled on this page type.`,
                        actionable_step: `• Try running the audit again — transient errors often resolve on retry.\n• If this page consistently fails, check that the URL is publicly accessible without login.\n• You can also try running the audit at a different time if the store is under high load.`
                    }]
                };
            }
        };

        // 5. Execute Audits Sequentially
        console.log("Starting Sequential Audit Engine...");
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        const homeResult = await analyzeSection("Homepage", crawlResult.home, nicheContext);
        await delay(2000);

        const collectionResult = await analyzeSection("Collection Page", crawlResult.collection, nicheContext);
        await delay(2000);

        const productResult = await analyzeSection("Product Page", crawlResult.product, nicheContext);
        await delay(2000);

        const cartResult = await analyzeSection("Cart Page", crawlResult.cart, nicheContext);

        // 6. Competitor Analysis (if provided)
        let competitorAnalysis: CompetitorGap[] = [];

        if (competitorUrl && competitorCrawlResult?.home) {
            console.log("Starting Competitor Kill-Screen Analysis...");
            const compPrompt = `
You are a top-tier CRO Specialist running a "Competitive Kill-Screen Analysis."
PRIMARY STORE: ${url} — Niche: ${nicheContext.description}
COMPETITOR STORE: ${competitorUrl}

Find exactly 3 HIGH-IMPACT gaps where the competitor outperforms the primary store.

STRICT AUDIT RULES:
${AUDIT_RULES}

TASK:
1. Compare both HTML snippets and screenshots.
2. Identify 3 distinct competitive gaps where the competitor drives more conversions.
3. Every gap must relate to elements in the Master Checklist only.
4. Output STRICT JSON: { "competitor_analysis": [ { "title": "...", "description": "...", "impact": "High", "actionable_step": "..." } ] }

PRIMARY STORE HTML:
${crawlResult.home?.html}

COMPETITOR STORE HTML:
${competitorCrawlResult.home.html}
            `;

            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const messagesList: any[] = [
                    { type: "text", text: compPrompt }
                ];
                if (crawlResult.home?.screenshot) {
                    messagesList.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${crawlResult.home.screenshot}` } });
                }
                if (competitorCrawlResult.home.screenshot) {
                    messagesList.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${competitorCrawlResult.home.screenshot}` } });
                }

                const compResult = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: "user", content: messagesList }],
                    response_format: { type: "json_object" },
                    temperature: 0,
                });
                const compText = (compResult.choices[0].message?.content || "{}").replace(/```json/g, "").replace(/```/g, "").trim();
                const compJson = JSON.parse(compText);
                competitorAnalysis = compJson.competitor_analysis || [];
            } catch (compError) {
                console.error("Competitor Analysis Failed:", compError);
            }
        }

        // 7. Merge & Sort Results
        const rawReport = {
            ...homeResult,
            ...collectionResult,
            ...productResult,
            ...cartResult
        };

        const finalReport = {
            "Homepage": sortInsights("Homepage", rawReport["Homepage"] || []),
            "Collection Page": sortInsights("Collection Page", rawReport["Collection Page"] || []),
            "Product Page": sortInsights("Product Page", rawReport["Product Page"] || []),
            "Cart Page": sortInsights("Cart Page", rawReport["Cart Page"] || []),
            "competitor_analysis": competitorAnalysis
        };

        return NextResponse.json(finalReport);

    } catch (error) {
        console.error("Audit failed:", error);
        return NextResponse.json(
            { error: "Failed to generate audit report" },
            { status: 500 }
        );
    }
}
