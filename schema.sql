create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text,
  priority text default 'Normal',
  created_at timestamp with time zone default now()
);
