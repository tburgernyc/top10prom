import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('gemini module', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('exports null genAI when GEMINI_API_KEY is missing', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    // Re-import after stubbing env
    const mod = await import('@/lib/gemini')
    expect(mod.genAI).toBeNull()
  })

  it('getAriaSystemPrompt includes event type for prom', async () => {
    const { getAriaSystemPrompt } = await import('@/lib/gemini')
    const prompt = await getAriaSystemPrompt('Luxe Boutique', 'Dallas', 'prom')
    expect(prompt).toContain('PROM')
    expect(prompt).toContain('Luxe Boutique')
    expect(prompt).toContain('Dallas')
    expect(prompt).toContain('no-duplicate-dress guarantee')
  })

  it('getAriaSystemPrompt includes wedding context', async () => {
    const { getAriaSystemPrompt } = await import('@/lib/gemini')
    const prompt = await getAriaSystemPrompt('Bridal House', 'Austin', 'wedding')
    expect(prompt).toContain('WEDDING')
    expect(prompt).toContain('bridal party')
  })

  it('getAriaSystemPrompt handles missing boutique info', async () => {
    const { getAriaSystemPrompt } = await import('@/lib/gemini')
    const prompt = await getAriaSystemPrompt()
    expect(prompt).toContain('boutique locations')
    expect(typeof prompt).toBe('string')
    expect(prompt.length).toBeGreaterThan(100)
  })

  it('createAriaChat returns null when genAI is null', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    const { createAriaChat } = await import('@/lib/gemini')
    const chat = await createAriaChat()
    expect(chat).toBeNull()
  })
})
