import React from 'react'
import Image from 'next/image'
import { FaInstagram, FaFacebookF, FaTiktok, FaYelp } from 'react-icons/fa'
import { SiNextdoor } from 'react-icons/si'
import type { IconType } from 'react-icons'
import { siteConfig } from '@/lib/config'

function RoverIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {/* Paw print */}
      <circle cx="6.5" cy="9" r="1.4" />
      <circle cx="10" cy="7" r="1.4" />
      <circle cx="13.5" cy="7" r="1.4" />
      <ellipse cx="10" cy="13" rx="3.8" ry="3" />
      {/* R letterform */}
      <path d="M14.5 9h2.2c1 0 1.8.7 1.8 1.6 0 .7-.4 1.3-1 1.5l1.2 2H17l-1-1.8h-.5V14h-1V9zm1 2.4h1.1c.4 0 .7-.3.7-.7s-.3-.7-.7-.7h-1.1v1.4z" />
    </svg>
  )
}

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Service Area', href: '#service-area' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Contact', href: '#contact' },
]

const { social } = siteConfig

type SocialLink = { label: string; href: string | undefined; Icon: IconType | (({ size }: { size?: number }) => React.JSX.Element); color: string }

const socialLinks: SocialLink[] = [
  { label: 'Rover',     href: social.rover,     Icon: RoverIcon,    color: '#00B494' },
  { label: 'Yelp',      href: social.yelp,       Icon: FaYelp,       color: '#D32323' },
  { label: 'Nextdoor',  href: social.nextdoor,   Icon: SiNextdoor,   color: '#00B246' },
  ...(social.instagram ? [{ label: 'Instagram', href: social.instagram, Icon: FaInstagram, color: '#E1306C' }] : []),
  ...(social.facebook  ? [{ label: 'Facebook',  href: social.facebook,  Icon: FaFacebookF, color: '#1877F2' }] : []),
  ...(social.tiktok    ? [{ label: 'TikTok',    href: social.tiktok,    Icon: FaTiktok,    color: '#010101' }] : []),
].filter((s) => s.href)

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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white hover:opacity-85 flex items-center justify-center transition-opacity shadow-sm"
                  style={{ color: s.color }}
                >
                  <s.Icon size={18} />
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
