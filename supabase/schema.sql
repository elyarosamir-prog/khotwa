-- شغّل الملف ده كله في Supabase > SQL Editor
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  nickname text unique not null check (char_length(nickname) between 2 and 24),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
create table checkins (
  user_id uuid not null references profiles on delete cascade,
  day date not null,
  practice text not null check (practice in ('prayer','bible','meeting')),
  primary key (user_id, day, practice)
);
alter table profiles enable row level security;
alter table checkins enable row level security;

-- كل واحد يشوف ويعدّل بياناته هو فقط
create policy "own profile select" on profiles for select using (auth.uid() = id);
create policy "own profile insert" on profiles for insert with check (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);
create policy "own checkins select" on checkins for select using (auth.uid() = user_id);
create policy "own checkins insert" on checkins for insert with check (auth.uid() = user_id);
create policy "own checkins delete" on checkins for delete using (auth.uid() = user_id);

-- منع أي حد من ترقية نفسه لأدمن: العضو يكتب الاسم المستعار فقط
revoke insert, update on profiles from authenticated, anon;
grant insert (id, nickname) on profiles to authenticated;
grant update (nickname) on profiles to authenticated;
