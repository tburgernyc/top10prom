import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { aiRatelimit } from '@/lib/ratelimit'
import { getClientIp } from '@/lib/request'
import { genAI, getAriaSystemPrompt, withExponentialBackoff } from '@/lib/gemini'
import type { EventType } from '@/types/index'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequestBody {
  messages: ChatMessage[]
  boutiqueName?: string
  boutiqueCity?: string
  eventType?: EventType | null
}

export async function POST(request: Request) {
  const ip = getClientIp(await headers())
  const { success } = await aiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  if (!genAI) {
    return NextResponse.json(
      { reply: "I'm Aria, your style concierge! Our AI assistant is currently offline. Please visit us in-store or book an appointment — our team would love to help you find your perfect dress." },
      { status: 200 }
    )
  }

  let body: ChatRequestBody
  try {
    body = (await request.json()) as ChatRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { messages, boutiqueName, boutiqueCity, eventType } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages array is required' }, { status: 400 })
  }

  const lastMessage = messages[messages.length - 1]
  if (!lastMessage || lastMessage.role !== 'user') {
    return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 })
  }

  try {
    const systemPrompt = await getAriaSystemPrompt(boutiqueName, boutiqueCity, eventType ?? null)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
    })

    // Build history from all messages except the last (the new user message)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
    })

    const result = await withExponentialBackoff(() =>
      chat.sendMessage(lastMessage.content)
    )

    const reply = result.response.text()
    return NextResponse.json({ reply })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
