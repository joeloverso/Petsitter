-- ============================================================
-- Sync services table to match current hardcoded site copy
-- Run in Supabase SQL Editor: supabase.com/dashboard → SQL Editor
--
-- The public Services.tsx was edited directly (descriptions shortened,
-- em-dashes removed from pricing). This brings the DB in sync.
-- ============================================================

update services
set
  description   = 'In-home visits for your furry friends while you''re away. Includes feeding, walking, playtime, and medication if needed.',
  pricing_notes = '$40: 1-2 dogs or cats
$45: 2+ dogs & cats together
+$15: medication administration'
where name = 'Pet Sitting Visit';

update services
set
  description   = 'I stay overnight in your home so your pets never feel alone. Includes everything in a pet sitting visit plus overnight companionship.',
  pricing_notes = '$110/night: 1-2 dogs
$130/night: 2+ dogs
$135/night: 2+ dogs & cats
+$25/night: holidays'
where name = 'Overnight Stay';

update services
set
  description   = 'Standalone dog walking service for when your pup just needs to stretch their legs and get some fresh air.',
  pricing_notes = '$30 per walk
Standalone service only
Included free in visit & overnight gigs'
where name = 'Dog Walking';
