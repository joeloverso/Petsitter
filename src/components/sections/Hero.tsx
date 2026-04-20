import Image from 'next/image'
import WaveDivider from '@/components/layout/WaveDivider'

const FALLBACK_PROFILE = '/images/Profile_Sihouette.webp'

export default function Hero({ profileImageUrl }: { profileImageUrl: string }) {
  const imageSrc = profileImageUrl || FALLBACK_PROFILE

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-br from-seafoam via-ocean/30 to-white-sand pt-16 pb-0 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 py-12 md:py-20">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-deep-ocean font-semibold tracking-widest text-sm uppercase mb-3">
              West Palm Beach, FL
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-driftwood leading-tight mb-4">
              Brooke&apos;s<br />Trusty Paws Co.
            </h1>
            <p className="text-xl md:text-2xl text-deep-ocean font-semibold mb-3">
              Palm Beach&apos;s Favorite Pet Sitter
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
              Professional pet & home care with a personal touch.
              Your fur babies deserve the best, and that&apos;s exactly what they&apos;ll get.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href="#services"
                className="px-8 py-4 bg-coral text-white rounded-full font-bold text-lg hover:bg-light-coral transition-colors shadow-md"
              >
                View Services
              </a>
              <a
                href="#contact"
                className="px-8 py-4 bg-white text-coral border-2 border-coral rounded-full font-bold text-lg hover:bg-coral hover:text-white transition-colors"
              >
                Book Now
              </a>
            </div>
          </div>

          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-white shadow-2xl">
              <Image
                src={imageSrc}
                alt="Brooke Maisano, Trusty Paws Co."
                fill
                sizes="(max-width: 768px) 288px, 384px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <WaveDivider fillColor="#f5ebdf" />
    </section>
  )
}
