-- ============================================================
-- Sync FAQ content in DB to match current site copy
-- Run in Supabase SQL Editor: supabase.com/dashboard → SQL Editor
--
-- Two answers were updated in code (em-dashes removed, "below" added)
-- but the DB was never updated. This brings them in sync.
-- ============================================================

-- FAQ 1: add "below" and use semicolon instead of em-dash
update faqs
set answer = 'You can reach Brooke by text or email; links are in the Contact section below. For new clients, a free meet & greet is required before the first booking.'
where question = 'How do I book?';

-- FAQ 7: replace em-dash with comma
update faqs
set answer = 'Yes, a free meet & greet is required for all new clients before the first booking. This lets Brooke get to know your pet and ensures it''s a good fit.'
where question = 'Do you require a meet & greet?';
