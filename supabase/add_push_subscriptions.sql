-- Push subscriptions table for PWA notifications
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

-- Only the service role can read/write subscriptions
alter table push_subscriptions enable row level security;

create policy "Service role only"
  on push_subscriptions
  for all
  to service_role
  using (true)
  with check (true);
