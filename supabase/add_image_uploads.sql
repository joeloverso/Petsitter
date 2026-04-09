-- ============================================================
-- Add image upload support
-- Run in Supabase SQL Editor after schema.sql
-- ============================================================

-- Table to store the public URLs of uploaded site images
create table if not exists site_images (
  key         text primary key,   -- 'profile' | 'pet_1' | 'pet_2'
  url         text not null default '',
  updated_at  timestamptz not null default now()
);

alter table site_images enable row level security;

create policy "Public can read site images"
  on site_images for select
  to anon
  using (true);

create policy "Authenticated can manage site images"
  on site_images for all
  to authenticated
  using (true)
  with check (true);

-- Seed the three slots so upserts always have a row to update
insert into site_images (key, url) values
  ('profile', ''),
  ('pet_1',   ''),
  ('pet_2',   '')
on conflict (key) do nothing;

-- ============================================================
-- Supabase Storage bucket for site images
-- ============================================================

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

create policy "Public can read site-images bucket"
  on storage.objects for select
  to anon
  using (bucket_id = 'site-images');

create policy "Authenticated can upload to site-images bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images');

create policy "Authenticated can update site-images bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images');

create policy "Authenticated can delete from site-images bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images');
