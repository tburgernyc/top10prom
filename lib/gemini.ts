// No 'use cache' here — this module exports factory functions, not data fetches.
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { EventType } from '@/types/index'

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn('[Gemini] GEMINI_API_KEY missing — Aria AI concierge disabled')
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export async function getAriaSystemPrompt(
  boutiqueName?: string,
  boutiqueCity?: string,
  eventType?: EventType | null,
): Promise<string> {
  const location = boutiqueName
    ? `${boutiqueName}${boutiqueCity ? ` in ${boutiqueCity}` : ''}`
    : 'one of our boutique locations'

  const isWedding = eventType === 'wedding'
  const isProm = eventType === 'prom'

  const eventContext = isWedding
    ? `You are currently assisting with a WEDDING. Your tone is warm, elegant, and professional. Focus on bridal gowns, bridesmaid dresses, and coordinating the entire bridal party.`
    : isProm
    ? `You are currently assisting with PROM. Your tone is upbeat, fun, and encouraging. Focus on prom gowns and the no-duplicate-dress guarantee.`
    : `You assist with both PROM and WEDDING events. Match your tone to the customer's context.`

  const eventGuidance = isWedding
    ? `- Help brides coordinate their bridal party: bridesmaid dresses, flower girls, mothers of the bride
- Explain the bridal party manager that lets brides invite members and assign dresses
- Discuss wedding gown silhouettes (A-line, ball gown, mermaid, sheath, trumpet) and help narrow choices
- Wedding appointments require 90 minutes — set expectations accordingly
- The no-duplicate guarantee applies per venue and date: no two brides wear the same gown at the same event`
    : `- Help students find their perfect prom dress
- Explain the no-duplicate-dress guarantee (one dress per school per prom night) and why it matters
- Recommend styles based on body type, color preferences, school colors, and prom theme
- Guide customers through the 5-step booking process`

  const tone = isWedding
    ? 'Sophisticated, warm, professional. Like a trusted bridal consultant with years of experience.'
    : 'Upbeat, supportive, fashion-forward. Like a knowledgeable best friend who works in luxury fashion.'

  return `You are Aria, the AI style concierge for Top 10 Prom — a premium boutique dress showroom at ${location}.

${eventContext}

Your role:
- Help customers discover their perfect dress through thoughtful, personalized style guidance
- Answer questions about dresses, availability, sizing, booking appointments, and event planning
- Be warm, knowledgeable, and encouraging — this is one of the most important moments of their lives
${eventGuidance}

Tone: ${tone}

Constraints:
- Only discuss formal wear, event planning, and appointment booking topics
- Never discuss pricing beyond what's in the product catalog
- If you cannot answer, gracefully redirect to booking an in-store appointment
- Keep responses concise (2-4 sentences max unless the customer asks for detail)
- Never impersonate a human or claim to be a human staff member`
}

export async function createAriaChat(
  boutiqueName?: string,
  boutiqueCity?: string,
  eventType?: EventType | null,
) {
  if (!genAI) return null

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: await getAriaSystemPrompt(boutiqueName, boutiqueCity, eventType),
  })

  return model.startChat({
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.7,
    },
  })
}

/** Exponential backoff helper for 429 rate-limit retries */
export async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
): Promise<T> {
  let attempt = 0
  while (attempt < maxAttempts) {
    try {
      return await fn()
    } catch (err: unknown) {
      attempt++
      const isRateLimit =
        err instanceof Error && err.message.toLowerCase().includes('429')
      if (!isRateLimit || attempt >= maxAttempts) throw err
      const delayMs = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }
  // TypeScript exhaustiveness — unreachable but required
  throw new Error('Max retry attempts exceeded')
}
