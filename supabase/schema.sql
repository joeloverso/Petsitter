-- ============================================================
-- Brooke's Trusty Paws Co. — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- supabase.com/dashboard → your project → SQL Editor → New query
-- ============================================================


-- ============================================================
-- TABLES
-- ============================================================

create table if not exists messages (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null default '',
  phone         text not null default '',
  preferred_contact text not null default 'email',
  message       text not null,
  read          boolean not null default false
);

create table if not exists services (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text not null default '',
  base_price_low  numeric not null default 0,
  base_price_high numeric not null default 0,
  pricing_notes   text not null default '',
  active          boolean not null default true,
  sort_order      int not null default 0
);

create table if not exists service_area (
  id          uuid primary key default gen_random_uuid(),
  city        text not null,
  zip_codes   text[] not null default '{}',
  sort_order  int not null default 0
);

create table if not exists faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  sort_order  int not null default 0,
  active      boolean not null default true
);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table messages    enable row level security;
alter table services    enable row level security;
alter table service_area enable row level security;
alter table faqs        enable row level security;

-- messages: public can insert (contact form), only service role can read/update/delete
create policy "Public can submit messages"
  on messages for insert
  to anon
  with check (true);

create policy "Authenticated can read messages"
  on messages for select
  to authenticated
  using (true);

create policy "Authenticated can update messages"
  on messages for update
  to authenticated
  using (true);

create policy "Authenticated can delete messages"
  on messages for delete
  to authenticated
  using (true);

-- services: public can read active services, authenticated can do everything
create policy "Public can read active services"
  on services for select
  to anon
  using (active = true);

create policy "Authenticated can manage services"
  on services for all
  to authenticated
  using (true)
  with check (true);

-- service_area: public can read, authenticated can manage
create policy "Public can read service area"
  on service_area for select
  to anon
  using (true);

create policy "Authenticated can manage service area"
  on service_area for all
  to authenticated
  using (true)
  with check (true);

-- faqs: public can read active faqs, authenticated can manage all
create policy "Public can read active faqs"
  on faqs for select
  to anon
  using (active = true);

create policy "Authenticated can manage faqs"
  on faqs for all
  to authenticated
  using (true)
  with check (true);


-- ============================================================
-- SEED DATA — Services
-- ============================================================

insert into services (name, description, base_price_low, base_price_high, pricing_notes, active, sort_order) values
(
  'Pet Sitting Visit',
  'In-home visits for your furry friends while you''re away. Includes feeding, walking, playtime, and medication if needed. Visits range from 30 minutes to 1 hour depending on your pet''s needs.',
  40,
  45,
  '$40 — 1-2 dogs or cats
$45 — 2+ dogs & cats together
+$15 — medication administration',
  true,
  1
),
(
  'Overnight Stay',
  'I stay overnight in your home so your pets never feel alone. Includes everything in a pet sitting visit plus overnight companionship. Ideal for anxious pets or longer trips.',
  110,
  135,
  '$110/night — 1-2 dogs
$130/night — 2+ dogs
$135/night — 2+ dogs & cats
+$25/night — holidays',
  true,
  2
),
(
  'Dog Walking',
  'Standalone dog walking service for when your pup just needs to stretch their legs and get some fresh air. Walking is included free in visit and overnight gigs.',
  30,
  30,
  '$30 per walk
Standalone service only
Included free with visits & overnight stays',
  true,
  3
);


-- ============================================================
-- SEED DATA — Service Area
-- ============================================================

insert into service_area (city, zip_codes, sort_order) values
('West Palm Beach',               ARRAY['33401','33402','33403','33404','33405','33406','33407','33408','33409','33410','33411','33412','33413','33415','33416','33417'], 1),
('Palm Beach Gardens',            ARRAY['33408','33418'], 2),
('Wellington',                    ARRAY['33411','33414','33449'], 3),
('Boynton Beach',                 ARRAY['33424','33425','33426','33435','33436'], 4),
('Lake Worth',                    ARRAY['33460','33461'], 5),
('Greenacres',                    ARRAY['33454','33463','33467'], 6),
('Loxahatchee / Westlake / Acreage', ARRAY['33470'], 7);


-- ============================================================
-- SEED DATA — FAQs
-- ============================================================

insert into faqs (question, answer, sort_order, active) values
(
  'How do I book?',
  'You can reach Brooke by text or email — links are in the Contact section. For new clients, a free meet & greet is required before the first booking.',
  1, true
),
(
  'How far in advance do I need to book?',
  '1–2 weeks in advance for most bookings. For stays lasting 1 week or longer, please book 2–4 weeks ahead to ensure availability.',
  2, true
),
(
  'What is your cancellation policy?',
  'A minimum of 3 days notice is required to cancel without a fee. Cancellations with less than 3 days notice will incur a $50 cancellation fee.',
  3, true
),
(
  'What holidays are you unavailable?',
  'Brooke is not available on Christmas Eve, Christmas Day, Thanksgiving, Easter, or Valentine''s Day. A $25/day holiday surcharge applies to other major holidays.',
  4, true
),
(
  'Do you handle medication?',
  'Yes! Brooke has experience administering insulin, oral, topical, and injectable medications. There is an additional $15 fee per pet requiring medication.',
  5, true
),
(
  'What animals do you sit for?',
  'Primarily dogs and cats, but Brooke also has experience with birds, fish, snakes, other reptiles, and small animals. Reach out to discuss your specific pet.',
  6, true
),
(
  'Do you require a meet & greet?',
  'Yes — a free meet & greet is required for all new clients before the first booking. This lets Brooke get to know your pet and ensures it''s a good fit.',
  7, true
),
(
  'Do you accept all breeds?',
  'All friendly breeds are welcome! Brooke does not accept aggressive dogs or cats for the safety of all pets in her care.',
  8, true
),
(
  'Do you offer grooming?',
  'Grooming is not offered. Bathing is only provided if medically necessary and advised by your pet''s veterinarian.',
  9, true
);
