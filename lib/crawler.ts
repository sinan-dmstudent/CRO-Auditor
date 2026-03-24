
import { Browser, Page } from 'playwright';
import { getBrowser } from './playwright';

export interface PageData {
    url: string;
    screenshot: string;          // Base64 mobile screenshot
    desktopScreenshot?: string;  // Base64 desktop screenshot
    html: string;
}

export interface CrawlResult {
    home: PageData;
    collection?: PageData;
    product?: PageData;
    cart?: PageData;
}

// ─────────────────────────────────────────────────────────────
// FIX 3: Scored keyword lists — earlier index = higher priority
// ─────────────────────────────────────────────────────────────
const COLLECTION_KEYWORDS = [
    '/collections/', '/collection/',
    '/product-category/', '/product-categories/',
    '/category/', '/categories/',
    '/catalog/', '/boutique/',
    '/browse/', '/all-products',
    '/shop/', '/store/', '/all'
];

const PRODUCT_KEYWORDS = [
    '/products/', '/product/',
    '/item/', '/items/',
    '/p/'
];

// ─────────────────────────────────────────────────────────────
// capturePage — visits a URL and returns HTML + screenshots
// ─────────────────────────────────────────────────────────────
async function capturePage(page: Page, url: string, captureDesktop = false): Promise<PageData> {
    try {
        console.log(`Visiting: ${url}`);
        await page.goto(url, { waitUntil: 'load', timeout: 45000 });

        // Deep human-like scroll to trigger lazy-loaded sections (reviews, UGC, Instagram feeds)
        await page.evaluate(async () => {
            const distance = 400;  // Slower scroll — gives intersection observers more time to fire
            const delay = 300;     // FIX 5: Increased from 150ms to 300ms for slow lazy loaders
            const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
            let noChangeCount = 0;
            const maxScrolls = 50; // Support pages up to ~20,000px

            for (let i = 0; i < maxScrolls; i++) {
                const before = document.body.scrollHeight;
                window.scrollBy(0, distance);
                await timer(delay);
                const after = document.body.scrollHeight;

                if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
                    noChangeCount++;
                    if (noChangeCount > 3) break;
                } else {
                    noChangeCount = 0;
                }
                // If page grew (new content loaded), reset stall counter
                if (after > before) noChangeCount = 0;
            }
            window.scrollTo(0, 0);
        });

        await page.waitForTimeout(2500); // Settle time after scroll

        // Freeze animations for a clean screenshot
        try {
            await page.addStyleTag({
                content: `*, *::before, *::after { transition: none !important; animation: none !important; caret-color: transparent !important; }`
            });
        } catch { /* CSP may block this — safe to ignore */ }

        // ── FIX 3a: Annotate meaningful SVG containers BEFORE HTML capture ──
        // This gives GPT-4o clear text signals even after SVGs are stripped
        try {
            await page.evaluate(() => {
                // Star ratings
                const starSelectors = [
                    '[class*="star"]', '[class*="rating"]', '[class*="review-star"]',
                    '[aria-label*="star"]', '[data-rating]', '[class*="StarRating"]',
                    '[class*="star-rating"]', '.jdgm-star', '.spr-icon', '.loox-rating'
                ].join(', ');
                document.querySelectorAll(starSelectors).forEach(el => {
                    if (el.querySelector('svg') || el.querySelector('i[class*="star"]') || el.querySelector('span[class*="star"]')) {
                        el.setAttribute('data-audit-stars', 'STAR-RATING-ICONS-PRESENT');
                    }
                });

                // Trust / security badges
                const trustSelectors = [
                    '[class*="trust"]', '[class*="badge"]', '[class*="secure"]',
                    '[class*="guarantee"]', '[class*="safety"]', '[class*="shield"]',
                    '[class*="money-back"]', '[class*="certified"]', '[class*="norton"]', '[class*="mcafee"]'
                ].join(', ');
                document.querySelectorAll(trustSelectors).forEach(el => {
                    if (el.querySelector('svg') || el.querySelector('img')) {
                        el.setAttribute('data-audit-trust', 'TRUST-BADGE-PRESENT');
                    }
                });

                // Payment icons
                const paymentSelectors = [
                    '[class*="payment"]', '[class*="pay-method"]', '[class*="accepted-cards"]',
                    '[class*="paypal"]', '[class*="visa"]', '[class*="mastercard"]',
                    '[class*="stripe"]', '[class*="apple-pay"]', '[class*="google-pay"]'
                ].join(', ');
                document.querySelectorAll(paymentSelectors).forEach(el => {
                    el.setAttribute('data-audit-payment', 'PAYMENT-ICONS-PRESENT');
                });

                // Social icons
                const socialSelectors = [
                    '[class*="social"]', '[class*="instagram"]', '[class*="facebook"]',
                    '[class*="tiktok"]', '[class*="youtube"]', '[class*="twitter"]'
                ].join(', ');
                document.querySelectorAll(socialSelectors).forEach(el => {
                    if (el.querySelector('svg') || el.querySelector('a')) {
                        el.setAttribute('data-audit-social', 'SOCIAL-ICONS-PRESENT');
                    }
                });
            });
        } catch (annotateErr) {
            console.warn('SVG annotation failed (CSP):', annotateErr);
        }

        // Media detection (videos, reels, UGC)
        let detectedMediaCount = 0;
        try {
            detectedMediaCount = await page.evaluate(() => {
                const selectors = [
                    'video',
                    'iframe[src*="youtube"]', 'iframe[src*="vimeo"]', 'iframe[src*="instagram"]',
                    'img[src$=".gif"]',
                    '[class*="video"]', '[id*="video"]',
                    '[class*="player"]', '[id*="player"]',
                    '[class*="tiktok"]', '[class*="reel"]',
                    '.lite-youtube'
                ];
                const mediaElements = document.querySelectorAll(selectors.join(', '));
                let count = 0;
                mediaElements.forEach(el => {
                    count++;
                    const htmlEl = el as HTMLElement;
                    htmlEl.setAttribute('data-audit-label', 'MEDIA-PLAYER-DETECTED');
                    const rect = htmlEl.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        const overlay = document.createElement('div');
                        overlay.style.cssText = `position:absolute!important;top:${rect.top + window.scrollY}px!important;left:${rect.left + window.scrollX}px!important;width:${rect.width}px!important;height:${rect.height}px!important;border:10px solid #FF0000!important;background:rgba(255,0,0,0.2)!important;box-sizing:border-box!important;z-index:2147483647!important;pointer-events:none!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;`;
                        const banner = document.createElement('div');
                        banner.innerText = 'MEDIA PLAYER DETECTED';
                        banner.style.cssText = 'background:red!important;color:white!important;font-weight:bold!important;padding:5px 10px!important;font-size:18px!important;';
                        overlay.appendChild(banner);
                        document.body.appendChild(overlay);
                    }
                });
                return count;
            });
        } catch (tagError) {
            console.warn('Media tagging failed:', tagError);
        }

        // Wait for network to settle
        try {
            await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        } catch { /* safe to ignore */ }

        // Mobile screenshot
        const buffer = await page.screenshot({ type: 'jpeg', quality: 80, fullPage: true });

        // Desktop screenshot (optional, only when requested)
        let desktopBuffer: Buffer | null = null;
        if (captureDesktop) {
            try {
                await page.setViewportSize({ width: 1280, height: 900 });
                await page.waitForTimeout(800);
                desktopBuffer = await page.screenshot({ type: 'jpeg', quality: 75, fullPage: true });
                await page.setViewportSize({ width: 390, height: 844 });
            } catch (desktopErr) {
                console.warn('Desktop screenshot failed:', desktopErr);
            }
        }

        let html = await page.content();

        // ── HTML Cleaning ──
        html = html
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, '')
            .replace(/<svg\b[^>]*>([\s\S]*?)<\/svg>/gim, '[icon]') // SVG meaning now captured via data-audit-* annotations above
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/src="data:image\/[^;]+;base64,[^"]+"/g, 'src="[base64-image]"')
            .replace(/\s+/g, ' ').trim();

        // ── FIX 4: Smart truncation — preserve TOP + BOTTOM of page ──
        // Before: simply cut at 100K (always lost footer/instagram/newsletter)
        // After: keep first 110K + last 20K — footer sections are always preserved
        const TOP_LIMIT = 110000;
        const BOTTOM_RESERVE = 20000;
        const TOTAL_LIMIT = TOP_LIMIT + BOTTOM_RESERVE;

        if (html.length > TOTAL_LIMIT) {
            const topChunk = html.substring(0, TOP_LIMIT);
            const bottomChunk = html.substring(html.length - BOTTOM_RESERVE);
            html = topChunk + '\n...[MIDDLE CONTENT TRUNCATED — BOTTOM OF PAGE PRESERVED BELOW]...\n' + bottomChunk;
            console.warn(`HTML smart-truncated: kept first ${TOP_LIMIT} + last ${BOTTOM_RESERVE} chars`);
        }

        // Prepend media detection signal so it survives any truncation
        if (detectedMediaCount > 0) {
            html = `[CRITICAL AUDIT DATA: ${detectedMediaCount} MEDIA PLAYER(S) DETECTED ON PAGE. UGC/VIDEO SECTION IS PRESENT.]\n` + html;
        }

        return {
            url,
            screenshot: buffer.toString('base64'),
            desktopScreenshot: desktopBuffer ? desktopBuffer.toString('base64') : undefined,
            html
        };
    } catch (e) {
        console.error(`Failed to capture ${url}`, e);
        throw e;
    }
}

// ─────────────────────────────────────────────────────────────
// crawlStore — main entry point
// ─────────────────────────────────────────────────────────────
export async function crawlStore(startUrl: string): Promise<CrawlResult> {
    let browser: Browser | null = null;
    try {
        browser = await getBrowser();
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
            viewport: { width: 390, height: 844 },
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true
        });

        // Stealth: hide headless browser signals
        await context.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });

        // 1. Visit Homepage
        const homePage = await context.newPage();
        const homeData = await capturePage(homePage, startUrl, true);

        // ── FIX 1: Smart Link Discovery — nav-first, scored matching ──
        // Previous: `links.find()` → took the very first matching link regardless of quality
        // Now: prioritize nav/header links, score by keyword priority, pick the best match

        const { navLinks, allLinks } = await homePage.evaluate(() => {
            // Navigation links are highest quality (set = deduplicate)
            const navSet = new Set<string>();
            ['header a', 'nav a', '[class*="nav"] a', '[class*="menu"] a',
             '[class*="navigation"] a', '[role="navigation"] a', '[class*="header"] a'
            ].forEach(sel => {
                document.querySelectorAll(sel).forEach(a => {
                    const href = (a as HTMLAnchorElement).href;
                    if (href && href.startsWith('http')) navSet.add(href);
                });
            });
            // All page links as fallback pool
            const all = Array.from(document.querySelectorAll('a'))
                .map(a => (a as HTMLAnchorElement).href)
                .filter(href => href && href.startsWith('http'));
            return { navLinks: Array.from(navSet), allLinks: all };
        });

        // Combined pool: nav links first (better quality), then everything else
        const linkPool = [...new Set([...navLinks, ...allLinks])];
        const navSet = new Set(navLinks);

        // Score a link against a keyword list (higher score = better match)
        const scoreLink = (href: string, keywords: string[]) => {
            const lower = href.toLowerCase();
            for (let i = 0; i < keywords.length; i++) {
                if (lower.includes(keywords[i])) {
                    // Bonus: nav links are more likely to be the canonical collection/product page
                    return (keywords.length - i) + (navSet.has(href) ? 10 : 0);
                }
            }
            return 0;
        };

        const findBestLink = (pool: string[], keywords: string[]) => {
            let bestUrl = '';
            let bestScore = 0;
            for (const href of pool) {
                const score = scoreLink(href, keywords);
                if (score > bestScore) { bestScore = score; bestUrl = href; }
            }
            return bestUrl || undefined;
        };

        const collectionUrl = findBestLink(linkPool, COLLECTION_KEYWORDS);

        // Product: look for a specific product URL (has segment + slug, not just a category)
        const productUrl = (() => {
            // First try direct product links
            const direct = findBestLink(linkPool, PRODUCT_KEYWORDS);
            if (direct) return direct;
            // Fallback: any link with 2+ path segments that looks like a product (has a slug)
            return linkPool.find(href => {
                const path = new URL(href).pathname.toLowerCase();
                return path.split('/').filter(Boolean).length >= 2 &&
                    !COLLECTION_KEYWORDS.some(k => path.includes(k));
            });
        })();

        // ── FIX 2: Cart URL — find from page links first, then try common paths ──
        // Previous: always used /cart (only works for Shopify)
        // Now: look for a cart link on the page (works for all platforms)
        const cartFromPage = linkPool.find(href => {
            const lower = href.toLowerCase();
            // Match /cart, /basket, /bag — but NOT /cart-abandonment or similar marketing pages
            return /\/(cart|basket|bag)(\/|\?|$)/.test(lower);
        });
        const cartUrl = cartFromPage || new URL('/cart', startUrl).toString();

        console.log(`Discovered — Collection: ${collectionUrl || 'NOT FOUND'} | Product: ${productUrl || 'NOT FOUND'} | Cart: ${cartUrl}`);

        // 3. Parallel visits for Collection, Product, and Cart
        const additionalTasks: Promise<PageData | null>[] = [];

        // Collection
        let collectionPagePromise: Promise<Page | null> = Promise.resolve(null);
        if (collectionUrl && collectionUrl !== startUrl) {
            const p = context.newPage();
            collectionPagePromise = p;
            additionalTasks.push(
                p.then(page => capturePage(page, collectionUrl!, true).catch(() => null))
            );
        } else {
            console.log('No Collection URL found — skipping');
            additionalTasks.push(Promise.resolve(null));
        }

        // Product (with deep-search fallback via collection page)
        if (productUrl && productUrl !== startUrl) {
            additionalTasks.push(
                context.newPage().then(p => capturePage(p, productUrl!, true).catch(() => null))
            );
        } else {
            const deepSearchPromise = (async () => {
                try {
                    const collectionPage = await collectionPagePromise;
                    if (!collectionPage) return null;
                    const productLinks = await collectionPage.evaluate(() => {
                        return Array.from(document.querySelectorAll('a'))
                            .map(a => (a as HTMLAnchorElement).href)
                            .filter(href => href.includes('/products/') || href.includes('/product/') || href.includes('/item/') || href.includes('/p/'));
                    });
                    if (productLinks.length > 0) {
                        console.log(`Deep search found product: ${productLinks[0]}`);
                        const productPage = await context.newPage();
                        return await capturePage(productPage, productLinks[0], true);
                    }
                    return null;
                } catch (e) {
                    console.error('Deep search failed:', e);
                    return null;
                }
            })();
            additionalTasks.push(deepSearchPromise);
        }

        // Cart
        additionalTasks.push(
            context.newPage().then(p => capturePage(p, cartUrl, true).catch(() => null))
        );

        const [collectionData, productData, cartData] = await Promise.all(additionalTasks);

        return {
            home: homeData,
            collection: collectionData || undefined,
            product: productData || undefined,
            cart: cartData || undefined
        };

    } catch (error) {
        console.error('Crawl failed:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
}
