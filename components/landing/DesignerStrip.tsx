const DESIGNERS = [
  'Johnathan Kayne',
  'Ashley Lauren',
  'Jessica Angel',
  'Sherri Hill',
  'Mac Duggal',
  'MoriLee',
  'Rebecca Ingram',
  'Essense of Australia',
  'Kate Parker',
  'Jovani',
]

// Duplicate for seamless loop
const TRACK = [...DESIGNERS, ...DESIGNERS]

export default function DesignerStrip() {
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-4 group">
      {/* Fade masks */}
      <div
        className="pointer-events-none absolute left-0 inset-y-0 w-24 z-10"
        style={{
          background:
            'linear-gradient(to right, var(--color-onyx) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 inset-y-0 w-24 z-10"
        style={{
          background:
            'linear-gradient(to left, var(--color-onyx) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div
        className="animate-marquee group-hover:[animation-play-state:paused] flex items-center gap-0 whitespace-nowrap w-max"
        aria-hidden="true"
      >
        {TRACK.map((name, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-8">
            <span className="text-sm font-semibold text-platinum/50 tracking-widest uppercase hover:text-gold transition-colors duration-300 cursor-default">
              {name}
            </span>
            <span className="w-1 h-1 rounded-full bg-gold/30 shrink-0" />
          </span>
        ))}
      </div>

      {/* Accessible label */}
      <p className="sr-only">
        Featured designers: {DESIGNERS.join(', ')}
      </p>
    </div>
  )
}
