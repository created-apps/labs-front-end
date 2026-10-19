-- Brochure lead capture: the only database object the app touches.
-- Run in the Supabase SQL editor.

create table if not exists public.brochure_leads (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null,
  email      text        not null,
  phone      text,
  school     text,
  created_at timestamptz not null default now()
);

-- For tables created before the school field existed.
alter table public.brochure_leads add column if not exists school text;

-- Enforce "insert only, this table only" at the database, so it holds even if
-- application code changes. Requires the app to use SUPABASE_ANON_KEY.
alter table public.brochure_leads enable row level security;

-- The anon role may add a lead, and nothing else: no select, update or delete.
-- Without a USING policy, rows are never readable through the anon key --
-- read submissions in the Supabase dashboard or with the service_role key.
drop policy if exists "anon can submit a brochure lead" on public.brochure_leads;
create policy "anon can submit a brochure lead"
  on public.brochure_leads
  for insert
  to anon
  with check (true);

revoke all on public.brochure_leads from anon;
grant insert on public.brochure_leads to anon;
