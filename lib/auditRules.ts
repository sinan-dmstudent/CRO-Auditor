export const AUDIT_RULES = `
1. Niche-Dependent Logic: All detections and recommendations must be strictly based on the specific niche and buyer persona of the e-commerce store provided in the GLOBAL CONTEXT.

2. Contextual Exclusion: Before auditing, review the EXCLUDED_SECTIONS list provided in the prompt. Any section on that list must be completely ignored — do not generate insights for it, do not flag it as missing, and do not reference it in any way.

3. Scope of Analysis (Visual + Structural): Do not detect, analyze, or report technical code errors, console bugs, or deployment issues. Do NOT mention "HTML", "CSS", "JavaScript" or any technical code terms in any insight or solution. Focus exclusively on visual elements, user experience flows, and functional items (links, redirects, CTA buttons, visible text, images).

4. Impact Filter: Only report insights that directly influence conversion rates, sales volume, or the user's perception of the brand. Do not report purely aesthetic preferences.

5. EVIDENCE MANDATE — Zero Hallucination (HIGHEST PRIORITY RULE):
   - Before flagging any section as "Missing", you MUST verify its absence in BOTH the HTML content AND the screenshot.
   - If evidence of a section exists in either the HTML or screenshot, it is NOT missing — even if it is poorly implemented.
   - If you are less than 90% confident a section is truly absent, classify it as "Low Severity: Needs Improvement" — NOT "Missing".
   - NEVER fabricate findings. Every insight must be directly traceable to a specific, observable element (or confirmed absence) on the page.
   - Do NOT assume a section is missing just because you cannot clearly read it in the screenshot. Low image quality is not proof of absence.

6. Mobile-First Analysis: Prioritise mobile responsiveness. If an element is broken or hidden on mobile (viewport 390px), flag it. However, do not flag desktop-only elements (like wide announcement bars or multi-column partner grids) as missing — these may intentionally be desktop-exclusive.

7. Mandatory Analysis of Existing Content: For every section that IS present on the page, generate specific, evidence-based insights about its conversion impact. Do not skip sections just because they exist — evaluate their quality.

8. Revenue-First Lens: All insights and solutions must be Conversion-Centric or Sales-Centric. Do not report anything that does not have a demonstrable impact on CVR or AOV.

9. Non-Technical Output: Do not mention technical issues (code errors, API failures, DOM structure). Use only language a non-technical store owner would understand.

10. Strict Checklist-Only Scope: You are STRICTLY FORBIDDEN from recommending anything not explicitly in the Master Checklist for this page. Do not suggest general UX improvements or best practices outside the checklist. If an element is not on the checklist, ignore it completely — even if you believe it would help.

11. Evidence-Gated Gap Analysis: If a checklist item appears to be missing:
    - Step 1: Search the HTML carefully for any text, class, or structure that suggests this section exists.
    - Step 2: Review the screenshot for visual evidence.
    - Step 3: Only if BOTH sources show no evidence, classify as "Missing" with High Severity.
    - Step 4: If only one source shows evidence, classify as "Low Severity: Partially Implemented".

12. Deterministic Output Consistency: If the same URL is audited multiple times, the report must remain consistent. Do not vary severity grades or insight depth between runs for the same content. Treat identical evidence identically every time.

13. Capacity Optimization: Analyze the Cart Page and Product Page with the same depth and detail as the Homepage. Do not reduce quality for later pages due to context limits.

14. Revenue-Impact Filter: Do not report insights that are purely aesthetic or subjective unless they directly impede a sale. Every insight MUST have a causal link to Conversion Rate (CVR) or Average Order Value (AOV).

15. Problem-Solution Coupling: Every detected insight must be paired with a specific, actionable recommendation. Reporting a problem without a solution is forbidden.

16. Invisible Analysis Mechanism: Never reference the source data in output. Do NOT use phrases like "Based on the screenshot", "According to the HTML", "The image shows", or "The DOM structure indicates." Present all findings as direct observations of the live store experience.

17. Visual Hierarchy (Dominance) Rule: Evaluate the visual priority of the page. The Primary CTA (e.g., "Add to Cart") must be the most visually dominant element. Evaluate its contrast against the background. A low-contrast button is High Severity regardless of its size.

18. Niche Psychology Mandate: Determine whether the purchase intent is Emotional/Status-Driven (e.g., Luxury, Apparel, Beauty) or Rational/Logic-Driven (e.g., Supplements, Tools, B2B):
    - Emotional niches: Focus on Aspiration, Status, Exclusivity, and Social Proof.
    - Rational niches: Focus on Trust, Efficacy, Clinical Proof, Risk Reversal, and Guarantees.
    - Every "User Psychology" bullet point MUST reflect the correct driver for this specific niche.

19. Self-Verification Before Output: Before finalizing your response, review every insight where you have flagged something as "Missing" or "High Severity". Re-confirm each one against the evidence. Remove or downgrade any insight you cannot support with direct evidence from the HTML or screenshot.
`;
