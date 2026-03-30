import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const title = searchParams.get('title') ?? 'Top 10 Prom'
  const subtitle =
    searchParams.get('subtitle') ??
    'Luxury Prom & Bridal Boutiques — No-Duplicate Guarantee'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#D4AF37',
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#D4AF37',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '32px',
          }}
        >
          TOP 10 PROM
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? '44px' : '56px',
            fontWeight: 800,
            color: '#F5F0E8',
            textAlign: 'center',
            lineHeight: 1.15,
            marginBottom: '20px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '22px',
            color: '#B0A090',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6b6b6b',
            fontSize: '16px',
          }}
        >
          <span>top10prom.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
