import Image from 'next/image'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Service Area', href: '#service-area' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Contact', href: '#contact' },
]

// Social links — add hrefs when accounts are ready
const socialLinks = [
  { label: 'Instagram', href: '#', icon: '📸' },
  { label: 'Facebook', href: '#', icon: '📘' },
]

export default function Footer() {
  return (
    <footer className="bg-driftwood text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/Transparent_Logo_Icons.png"
                alt="Brooke's Trusty Paws Co."
                width={44}
                height={44}
                className="object-contain brightness-200"
              />
              <span className="font-display text-xl">Trusty Paws Co.</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Professional pet & home care in the West Palm Beach area.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-base"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/50 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service area + contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/50 mb-4">
              Service Area
            </h4>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Serving West Palm Beach, Wellington, Palm Beach Gardens,
              Boynton Beach, Lake Worth, Greenacres & surrounding areas.
            </p>
            <a
              href="#contact"
              className="inline-block px-5 py-2 bg-coral rounded-full text-sm font-bold hover:bg-light-coral transition-colors"
            >
              Book Now
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-white/40 text-xs">
          © {new Date().getFullYear()}{' '}Brooke&apos;s Trusty Paws Co. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
