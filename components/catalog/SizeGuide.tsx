'use client'

import Modal from '@/components/ui/Modal'

interface SizeGuideProps {
  open: boolean
  onClose: () => void
}

const US_SIZES = [
  { size: '0', bust: '32"', waist: '24"', hips: '35"' },
  { size: '2', bust: '33"', waist: '25"', hips: '36"' },
  { size: '4', bust: '34"', waist: '26"', hips: '37"' },
  { size: '6', bust: '35"', waist: '27"', hips: '38"' },
  { size: '8', bust: '36"', waist: '28"', hips: '39"' },
  { size: '10', bust: '37"', waist: '29"', hips: '40"' },
  { size: '12', bust: '38.5"', waist: '30.5"', hips: '41.5"' },
  { size: '14', bust: '40"', waist: '32"', hips: '43"' },
  { size: '16', bust: '41.5"', waist: '33.5"', hips: '44.5"' },
]

const INTL_SIZES = [
  { us: '0', uk: '4', eu: '32', fr: '34' },
  { us: '2', uk: '6', eu: '34', fr: '36' },
  { us: '4', uk: '8', eu: '36', fr: '38' },
  { us: '6', uk: '10', eu: '38', fr: '40' },
  { us: '8', uk: '12', eu: '40', fr: '42' },
  { us: '10', uk: '14', eu: '42', fr: '44' },
  { us: '12', uk: '16', eu: '44', fr: '46' },
  { us: '14', uk: '18', eu: '46', fr: '48' },
  { us: '16', uk: '20', eu: '48', fr: '50' },
]

export default function SizeGuide({ open, onClose }: SizeGuideProps) {
  return (
    <Modal open={open} onClose={onClose} title="Size Guide" className="max-w-xl">
      <div className="space-y-6 text-sm">
        {/* US Measurements */}
        <div>
          <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">
            US Dress Sizes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  {['Size', 'Bust', 'Waist', 'Hips'].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="pb-2 pr-4 text-xs font-medium text-platinum/60 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {US_SIZES.map(({ size, bust, waist, hips }) => (
                  <tr
                    key={size}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-2 pr-4 font-semibold text-ivory">{size}</td>
                    <td className="py-2 pr-4 text-platinum">{bust}</td>
                    <td className="py-2 pr-4 text-platinum">{waist}</td>
                    <td className="py-2 pr-4 text-platinum">{hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* International */}
        <div>
          <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">
            International Conversion
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  {['US', 'UK', 'EU', 'FR'].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="pb-2 pr-6 text-xs font-medium text-platinum/60 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INTL_SIZES.map(({ us, uk, eu, fr }) => (
                  <tr
                    key={us}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-2 pr-6 font-semibold text-ivory">{us}</td>
                    <td className="py-2 pr-6 text-platinum">{uk}</td>
                    <td className="py-2 pr-6 text-platinum">{eu}</td>
                    <td className="py-2 pr-6 text-platinum">{fr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-platinum/40 leading-relaxed">
          Measurements are approximate. If you are between sizes, our stylists
          recommend sizing up for the best alterations fit.
        </p>
      </div>
    </Modal>
  )
}
