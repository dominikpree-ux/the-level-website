-- The LƎVE⅃ STAFF DATABASE
-- Run this in Supabase SQL Editor.

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  image text,
  role text not null,
  name text not null,
  discord text not null,
  bio text,
  sort_order integer not null default 99,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;
alter table public.admin_users enable row level security;

-- Public visitors may read the staff directory.
drop policy if exists "public can read staff" on public.staff;
create policy "public can read staff"
on public.staff for select
to anon, authenticated
using (true);

-- Only users listed in admin_users may create/change/delete staff.
drop policy if exists "admins can insert staff" on public.staff;
create policy "admins can insert staff"
on public.staff for insert
to authenticated
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "admins can update staff" on public.staff;
create policy "admins can update staff"
on public.staff for update
to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "admins can delete staff" on public.staff;
create policy "admins can delete staff"
on public.staff for delete
to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

-- Admin status must only be readable for the current authenticated user.
drop policy if exists "admins can read own admin record" on public.admin_users;
create policy "admins can read own admin record"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

-- IMPORTANT:
-- After creating your own Supabase Auth account, run:
-- insert into public.admin_users (user_id) values ('YOUR-AUTH-USER-UUID');
