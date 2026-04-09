-- Page view tracking table
create table if not exists page_views (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path       text not null,
  referrer   text not null default '',
  user_agent text not null default ''
);

alter table page_views enable row level security;

-- Anyone can insert a page view (public tracking)
create policy "Public can insert page views"
  on page_views for insert
  to anon
  with check (true);

-- Only authenticated can read analytics
create policy "Authenticated can read page views"
  on page_views for select
  to authenticated
  using (true);
