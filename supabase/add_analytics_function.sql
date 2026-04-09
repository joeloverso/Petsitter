-- Run this after add_analytics.sql
create or replace function top_pages(limit_count int default 8)
returns table(path text, count bigint)
language sql
security definer
as $$
  select path, count(*) as count
  from page_views
  group by path
  order by count desc
  limit limit_count;
$$;
