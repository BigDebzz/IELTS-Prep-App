-- Run once in Supabase: SQL Editor -> New query -> paste all -> Run

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  day_number int not null check (day_number between 1 and 30),
  skill text not null,
  title text not null,
  done boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists public.mock_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  day_number int not null,
  listening numeric,
  reading numeric,
  writing numeric,
  speaking numeric,
  overall numeric,
  test_source text,
  created_at timestamptz default now()
);

create table if not exists public.vocab (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  word text not null,
  meaning text,
  synonyms text,
  antonyms text,
  example_sentence text,
  created_at timestamptz default now()
);

alter table public.tasks enable row level security;
alter table public.mock_scores enable row level security;
alter table public.vocab enable row level security;

create policy "own tasks" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own mock_scores" on public.mock_scores for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own vocab" on public.vocab for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
