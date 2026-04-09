-- Add family photo slots to site_images
insert into site_images (key, url)
values
  ('family_1', ''),
  ('family_2', '')
on conflict (key) do nothing;
