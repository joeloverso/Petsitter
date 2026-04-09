# Brooke's Trusty Paws Co. — Project Plan

## Project Overview

A full-stack Next.js web application for **Brooke's Trusty Paws Co.**, a professional pet sitting business based in Wellington, FL serving the greater West Palm Beach area.

The app has two distinct surfaces:
- **Public site** — marketing/booking site for potential clients
- **Owner portal** — private dashboard for Brooke to manage messages, view analytics, view her calendar, and edit site content without a code redeploy

**Owner:** Brooke Maisano  
**Tagline:** Palm Beach's Favorite Pet Sitter  
**Contact:** Clients book via Google Voice text or email

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| **Framework** | Next.js 14 (App Router) + TypeScript | API routes eliminate a separate server; SSR improves SEO; seamless Vercel deployment |
| **Styling** | Tailwind CSS | Utility-first, fast to build, easy to keep consistent |
| **Database** | Supabase (PostgreSQL) | Free tier, built-in auth, visual dashboard, real-time subscriptions for inbox |
| **Authentication** | Supabase Auth | Email + password login for owner portal; no third-party service needed |
| **Analytics** | Vercel Analytics | Zero-config page view tracking; viewable directly in the owner portal |
| **Email notifications** | Resend | Alerts Brooke by email when a new contact message arrives; free tier sufficient |
| **Hosting** | Vercel | Native Next.js platform, free tier, automatic preview deployments |

---

## Design & Theme

### Beachy West Palm Beach Aesthetic
The site should evoke the warm, sunny, coastal vibe of West Palm Beach, FL.

**Color Palette:**
| Token | Hex | Use |
|---|---|---|
| `--sand` | `#dabea0` | Backgrounds, cards |
| `--ocean` | `#76bcb7` | Primary accent (cyan/teal) |
| `--seafoam` | `#addbd4` | Hover states, light accents |
| `--coral` | `#fe8769` | CTAs, highlights |
| `--light-coral` | `#fda371` | Hover on CTAs |
| `--sunshine` | `#fed87d` | Badges, holiday callouts |
| `--white-sand` | `#f5ebdf` | Section backgrounds |

**Typography:**
- Display/headings: Pacifico or Nunito (casual, friendly, beachy)
- Body: Inter or Nunito Sans (clean, readable)
- Import from Google Fonts

**Visual Style:**
- Soft SVG wave dividers between page sections
- Warm sandy background gradients
- Rounded corners on all cards and buttons
- Subtle paw print motifs in section accents
- Photography-forward — Brooke's real photos take center stage

---

## Public Site — Pages & Sections

Single-page app (`/`) with smooth scrolling to named anchors. Navbar links scroll to each section.

### 1. `Hero`
- Full-width section with Brooke's photo
- Headline: "Brooke's Trusty Paws Co."
- Subheadline: "Palm Beach's Favorite Pet Sitter"
- Tagline: "Professional pet & home care in the West Palm Beach area"
- CTAs: "View Services" (scroll) and "Book Now" (scroll to Contact)
- Wave SVG divider at bottom

### 2. `About`
- Brooke's bio: born & raised in Wellington FL, 4 years vet clinic experience, 6 years family sitting, 3 years professional
- Experience with dogs, cats, birds, fish, snakes, reptiles, and more
- Photo of Brooke with pets
- Highlight badges: "4 Yrs Vet Experience" · "3 Yrs Professional" · "All Friendly Breeds Welcome"

### 3. `Services`
Content sourced from the `services` database table (editable in owner portal).

| Service | Price |
|---|---|
| Petsitting Visit | $40 (1-2 dogs/cats), $45 (2+ dogs & cats) |
| Overnight / Day Stay | $110 (1-2 dogs), $130 (2+ dogs), $135 (2+ dogs & cats) |
| Dog Walking | $30 (standalone only) |

**Add-ons:**
- Medication administration: +$15
- Holiday surcharge: +$25/day

**Policy callouts:**
- Free meet & greet required for all new clients
- Does NOT accept aggressive dogs or cats
- All friendly breeds welcome
- Medication experience: insulin, oral, topical, injectable
- No grooming (medical bath only if vet-recommended)

### 4. `Cost Estimator` (interactive, client-side)
Pure client-side calculation — no backend call needed.

Inputs:
- Service type (visit / overnight / walk)
- Number of dogs, number of cats
- Number of days or visits
- Medications? (yes/no + how many pets)
- Any holiday dates? (toggle)

Output: estimated cost range displayed live as inputs change.

**Calculation logic:**
```
base = service base rate (by pet count/type)
meds = $15 × numberOfPetsOnMeds
holiday = $25 × numberOfHolidayDays
total = (base + meds) × numberOfDaysOrVisits + holiday
```

### 5. `Service Area`
Content sourced from the `service_area` database table (editable in owner portal).

Initial zip codes:
- West Palm Beach: 33401–33417
- Palm Beach Gardens: 33408, 33418
- Boynton Beach: 33424–33436
- Wellington: 33411, 33414, 33449
- Lake Worth: 33460, 33461
- Greenacres: 33454, 33463, 33467
- Loxahatchee / Westlake / Acreage: 33470

Display as a styled grid of city cards, each expandable to show zip codes.

### 6. `Availability Calendar`
- Embed Brooke's public Google Calendar via `<iframe>` (embed URL already collected)
- Read-only public view — no credentials needed
- Shows her booked/busy dates to potential clients

### 7. `FAQs`
Content sourced from the `faqs` database table (editable in owner portal). Accordion-style.

Initial questions:
- How do I book? → Text or email; links provided in Contact section
- How far in advance? → 1–2 weeks; 2–4 weeks for stays 1 week+
- Cancellation policy? → 3 days minimum notice or $50 fee applies
- What holidays are you unavailable? → Christmas Eve, Christmas Day, Thanksgiving, Easter, Valentine's Day
- Do you handle medication? → Yes, +$15; insulin, oral, topical, injectable
- What pets do you sit for? → Dogs, cats, birds, fish, snakes, reptiles, and more
- Do you require a meet & greet? → Yes, free for all new clients
- Do you offer grooming? → No; medical baths only if vet-recommended

### 8. `Testimonials`
Two confirmed reviews displayed as beach-card style quote blocks.

- **Kristen McCaughan** (Oso, Sylvie & George) — trustworthy with multiple dogs, treats them like her own, even tidies the house
- **Cathy Sacher** (Ziggy) — exceptional care for an older dog with health issues, regular photo/video updates, very flexible

Future: link to Google Reviews for new submissions.

### 9. `Contact / Book Now`
- Prominent CTA section
- "Send a Text" button → `sms:` link to Google Voice number
- "Send an Email" button → `mailto:` link
- **Contact form** — name, email/phone, message, preferred contact method → stores submission in Supabase `messages` table + triggers Resend email notification to Brooke
- Booking lead time note
- Free meet & greet note
- Social media icon links (placeholders until accounts are ready)

### 10. `Footer`
- Business name and logo
- Smooth-scroll nav links
- "Serving West Palm Beach & surrounding areas"
- Social media icons (placeholder)
- Copyright

---

## Owner Portal — `/admin`

Protected by Supabase Auth. Only accessible after login with Brooke's credentials.

### `/admin/login`
- Email + password form
- Supabase Auth handles session management
- Redirects to `/admin/dashboard` on success

### `/admin/dashboard`
Overview page with:
- Unread message count badge
- Recent messages preview (last 3)
- Quick-links to all portal sections
- Embedded Vercel Analytics summary (page views, top pages)

### `/admin/messages`
Full in-app inbox:
- List of all contact form submissions (name, date, preview)
- Click to open full message thread view
- Mark as read / unread
- Delete message
- "Reply via Email" and "Reply via Text" quick-action buttons (open mailto/sms links pre-filled)
- Unread messages highlighted; badge count in nav
- Real-time updates via Supabase subscriptions (new messages appear without refresh)

### `/admin/calendar`
- Embedded Google Calendar iframe (same public embed used on public site)
- Full-size view for easier scheduling review

### `/admin/analytics`
- Embedded Vercel Analytics dashboard
- Page views over time, top referrers, device breakdown

### `/admin/content`
Content editor split into tabs:

**Services tab**
- List of current services with price fields
- Edit name, description, base price, per-pet pricing tiers
- Add new service / toggle active/inactive
- Save → updates `services` table → public site reflects change immediately

**Service Area tab**
- List of cities, each with their zip codes
- Add/remove zip codes inline
- Add/remove cities
- Save → updates `service_area` table

**FAQs tab**
- List of FAQ items (question + answer)
- Reorder via drag-and-drop
- Add / edit / delete entries
- Save → updates `faqs` table

**General tab**
- Business tagline
- About section text / bio
- Holiday unavailability dates (add/remove)
- Holiday surcharge amount

---

## Database Schema (Supabase / PostgreSQL)

```sql
-- Editable site content
services (
  id uuid primary key,
  name text,
  description text,
  base_price_low numeric,
  base_price_high numeric,
  pricing_notes text,
  active boolean default true,
  sort_order int
)

service_area (
  id uuid primary key,
  city text,
  zip_codes text[],
  sort_order int
)

faqs (
  id uuid primary key,
  question text,
  answer text,
  sort_order int,
  active boolean default true
)

-- Contact form submissions
messages (
  id uuid primary key,
  created_at timestamptz default now(),
  name text,
  email text,
  phone text,
  preferred_contact text,   -- 'email' | 'text'
  message text,
  read boolean default false
)

-- Auth handled entirely by Supabase Auth (no custom users table needed)
```

**Row-level security:** `messages` and all content tables are only writable/readable server-side via the service role key. Public site reads content via the anon key (read-only). Owner portal uses authenticated session.

---

## Project Structure

```
src/
  app/
    (public)/               # Public site route group
      page.tsx              # Single page, all sections
      layout.tsx
    admin/                  # Owner portal route group
      login/
        page.tsx
      dashboard/
        page.tsx
      messages/
        page.tsx
        [id]/
          page.tsx
      calendar/
        page.tsx
      analytics/
        page.tsx
      content/
        page.tsx
      layout.tsx            # Shared admin layout + auth guard
  components/
    layout/
      Navbar.tsx
      Footer.tsx
      WaveDivider.tsx
    sections/               # Public site sections
      Hero.tsx
      About.tsx
      Services.tsx
      CostEstimator.tsx
      ServiceArea.tsx
      AvailabilityCalendar.tsx
      FAQ.tsx
      Testimonials.tsx
      Contact.tsx
    admin/                  # Owner portal components
      Sidebar.tsx
      MessageList.tsx
      MessageDetail.tsx
      ContentEditor/
        ServicesEditor.tsx
        ServiceAreaEditor.tsx
        FAQEditor.tsx
        GeneralEditor.tsx
    ui/                     # Shared primitives
      ServiceCard.tsx
      FAQItem.tsx
      TestimonialCard.tsx
      Badge.tsx
      Button.tsx
  lib/
    supabase/
      client.ts             # Browser client
      server.ts             # Server client (for API routes + server components)
    resend.ts               # Email notification helper
  assets/
    images/                 # Brooke's photos + logos
  styles/
    globals.css
```

---

## Business Logic — Cost Estimator

Rates (seeded into `services` table; also hardcoded in estimator as fallback):
- Visit: $40 (1-2 pets), $45 (2+ mixed dogs & cats)
- Overnight: $110 (1-2 dogs), $130 (2+ dogs), $135 (2+ dogs & cats)
- Walk: $30 flat (standalone only)
- Meds: +$15 per pet on medication
- Holiday: +$25 per day/night

---

## Confirmed Assets & Decisions

- **Google Voice number:** collected ✓
- **Email address:** `BrookeMaisano.petsitting@gmail.com` ✓
- **Supabase project:** created ✓ — publishable + secret keys in `.env.local`
- **Google Calendar embed URL:** pending correct embed format (see TODO below)
- **Photos:** `BusinessDetails/BrookePhotos/` — 9 photos, migrate to `src/assets/images/`
- **Logos:** `images/` directory — use `Transparent_Logo_Icons.png` as primary
- **Testimonials:** `BusinessDetails/testimonials.txt` — 2 reviews (Kristen McCaughan, Cathy Sacher)
- **Hosting:** Vercel ✓
- **Social media:** pending — footer placeholder slots ready

---

## TODO — Awaiting Client

### Pending from Brooke
- [ ] **Social media handles** — Instagram, Facebook, TikTok (footer + contact section)
- [x] **Google Calendar embed URL** — correct embed URL now in `.env.local` ✓
- [x] **Payment info / DNS** — `trustypawco.com` purchased ✓

### Pending Infrastructure
- [ ] **DNS / Domain** — `trustypawco.com` purchased ✓. Still to do:
  - Point domain to Vercel
  - Add `https://trustypawco.com/auth/callback` to Supabase Redirect URLs
  - Update Supabase Site URL to `https://trustypawco.com`
  - Update Resend sender domain from `onboarding@resend.dev` to `noreply@trustypawco.com`
  - Add `NEXT_PUBLIC_SITE_URL=https://trustypawco.com` to Vercel env vars
- [x] **Supabase database tables** — tables created, RLS policies set, all data seeded ✓
- [x] **Supabase user** — Brooke's owner portal login created ✓
- [ ] **Resend account** — create account at resend.com, generate API key, add to `.env.local` and Vercel env vars. Update `RESEND_TO_EMAIL` to `brookemaisano.petsitting@gmail.com`
- [ ] **Vercel deployment** — push to GitHub, connect repo to Vercel, add all env vars in Vercel dashboard

---

## Development Notes

- Mobile-first responsive design throughout
- All public-facing content sections fetch from Supabase at request time (Next.js server components) so edits in the portal reflect immediately — no redeploy needed
- Cost Estimator is fully client-side; no DB fetch required
- Admin route group protected by middleware: unauthenticated requests redirect to `/admin/login`
- The existing `index.html` + `styles.css` prototype is a visual reference only; the Next.js app is built fresh
- Existing images in `/images` and `BusinessDetails/BrookePhotos/` migrate to `src/assets/images/`
