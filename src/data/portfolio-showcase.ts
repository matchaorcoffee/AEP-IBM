/**
 * PORTFOLIO SHOWCASE CONFIGURATION
 *
 * This file contains the narrative / storytelling content for each portfolio:
 *   - description  : shown in "About [Portfolio]"
 *   - challenge    : shown in "From Challenge to Impact → 01 Challenge"
 *   - solution     : shown in "From Challenge to Impact → 02 Solution"
 *   - impact       : shown in "From Challenge to Impact → 03 Impact"
 *
 * SOURCE OF TRUTH
 * All values tagged TEMPORARY are Lorem Ipsum placeholders.
 * Replace them with approved copy when verified content becomes available.
 * Do NOT infer or invent business descriptions from portfolio names, acronyms,
 * projects, or any other application data.
 *
 * To update a portfolio's story, change ONLY this file — no component changes needed.
 */

export interface PortfolioShowcaseContent {
  /** Optional short expansion of the portfolio acronym / name (verified only). */
  fullName?: string | null
  /**
   * One-to-two sentence editorial description.
   * Use Lorem Ipsum if no verified description exists.
   */
  description: string
  /** Challenge stage text. Use Lorem Ipsum if unverified. */
  challenge: string
  /** Solution stage text. Use Lorem Ipsum if unverified. */
  solution: string
  /** Impact stage text. Use Lorem Ipsum if unverified. */
  impact: string
  /** Optional list of capability items shown in "What [Portfolio] Enables". Omit if unverified. */
  capabilities?: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPORARY PLACEHOLDER
// All fields below are Lorem Ipsum — no verified narrative content exists yet.
// ─────────────────────────────────────────────────────────────────────────────
const PLACEHOLDER: Omit<PortfolioShowcaseContent, 'fullName'> = {
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  challenge:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  solution:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  impact:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}

/**
 * Keyed by the portfolio route slug (matches the path segment in App.tsx routes).
 * e.g. /portfolios/wam → key "wam"
 */
export const PORTFOLIO_SHOWCASE: Record<string, PortfolioShowcaseContent> = {

  // ── WAM ────────────────────────────────────────────────────────────────────
  // All fields below are TEMPORARY Lorem Ipsum.
  // fullName intentionally omitted — WAM acronym expansion is not verified.
  wam: { ...PLACEHOLDER },

  // ── Energy Delivery ────────────────────────────────────────────────────────
  // TEMPORARY Lorem Ipsum.
  'energy-delivery': { ...PLACEHOLDER },

  // ── Grid Operations ────────────────────────────────────────────────────────
  // TEMPORARY Lorem Ipsum.
  'grid-operations': { ...PLACEHOLDER },

  // ── Generation & Commercial Ops ────────────────────────────────────────────
  // TEMPORARY Lorem Ipsum.
  'generation-commercial': { ...PLACEHOLDER },

  // ── Shared Services ────────────────────────────────────────────────────────
  // TEMPORARY Lorem Ipsum.
  'shared-services': { ...PLACEHOLDER },

  // ── ICOE ───────────────────────────────────────────────────────────────────
  // TEMPORARY Lorem Ipsum.
  // fullName intentionally omitted — ICOE acronym expansion is not verified.
  icoe: { ...PLACEHOLDER },

  // ── Automation COE ─────────────────────────────────────────────────────────
  // TEMPORARY Lorem Ipsum.
  'automation-coe': { ...PLACEHOLDER },

  // ── Digital Emerging Technology ────────────────────────────────────────────
  // TEMPORARY Lorem Ipsum.
  'digital-emerging': { ...PLACEHOLDER },

  // ── Data Platforms ─────────────────────────────────────────────────────────
  // TEMPORARY Lorem Ipsum.
  'data-platforms': { ...PLACEHOLDER },

  // ── Security ───────────────────────────────────────────────────────────────
  // TEMPORARY Lorem Ipsum.
  security: { ...PLACEHOLDER },

  // ── Customer ───────────────────────────────────────────────────────────────
  // TEMPORARY Lorem Ipsum.
  customer: { ...PLACEHOLDER },
}
