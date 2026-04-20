import Image from 'next/image'
import Badge from '@/components/ui/Badge'
import WaveDivider from '@/components/layout/WaveDivider'

const FALLBACK_PET = '/images/Walking_Dog_Neutral_Colors_Silhouette.webp'

const badges = [
  { label: '4 Yrs Vet Experience', color: 'ocean' as const },
  { label: '3 Yrs Professional', color: 'sunshine' as const },
  { label: 'All Friendly Breeds Welcome', color: 'coral' as const },
]

interface AboutProps {
  petImageUrls: [string, string]
  familyImageUrls: [string, string]
}

function AboutImage({ src, alt, tall = false }: { src: string; alt: string; tall?: boolean }) {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden shadow-lg border-4 border-white ${
        tall ? 'w-44 h-56 md:w-52 md:h-68' : 'w-36 h-44 md:w-44 md:h-56'
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={tall ? '(max-width: 768px) 176px, 208px' : '(max-width: 768px) 144px, 176px'}
        className="object-cover"
      />
    </div>
  )
}

export default function About({ petImageUrls, familyImageUrls }: AboutProps) {
  const primaryPet = petImageUrls[0] || petImageUrls[1] || FALLBACK_PET
  const secondaryPet = petImageUrls[1] || ''
  const family1 = familyImageUrls[0] || ''
  const family2 = familyImageUrls[1] || ''

  // Collect all available photos to display in a mosaic (max 4)
  const photos = [
    { src: primaryPet, alt: 'Brooke with pets', tall: true },
    ...(secondaryPet ? [{ src: secondaryPet, alt: 'Brooke with pets', tall: false }] : []),
    ...(family1 ? [{ src: family1, alt: 'Family photo', tall: false }] : []),
    ...(family2 ? [{ src: family2, alt: 'Family photo', tall: true }] : []),
  ]

  return (
    <section id="about" className="bg-white-sand py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-14">
          {/* Photo mosaic */}
          <div className="flex-shrink-0 flex gap-3 items-end">
            {photos.map((photo, i) => (
              <AboutImage key={i} src={photo.src} alt={photo.alt} tall={photo.tall} />
            ))}
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-ocean font-semibold tracking-widest text-sm uppercase mb-2">
              About Me
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-driftwood mb-2">
              Hi, I&apos;m Brooke!
            </h2>
            <p className="text-deep-ocean font-semibold text-lg mb-5">
              My story and passion for animals
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              I&apos;m a pet sitter born and raised in Wellington, FL with a lifelong love for animals.
              I&apos;ve spent 4 years working in a veterinary clinic and have been pet sitting
              professionally for 3 years, giving me a unique ability to care for pets with
              special medical needs alongside everyday companionship.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              I work with dogs, cats, birds, fish, snakes, reptiles, and all kinds of furry friends.
              Every pet gets treated like my own, with patience, love, and plenty of playtime.
            </p>
            <div className="flex flex-wrap gap-3">
              {badges.map((b) => (
                <Badge key={b.label} color={b.color}>
                  {b.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WaveDivider fillColor="#ffffff" />
    </section>
  )
}
