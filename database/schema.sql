-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the recipes table
create table recipes (
  id text primary key default ('recipe_' || extract(epoch from now()) || '_' || substr(md5(random()::text), 1, 8)),
  title text not null,
  description text,
  prep_time text not null,
  cook_time text not null,
  servings integer not null default 4,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  ingredients text[] not null,
  instructions text[] not null,
  image_url text,
  cuisine_tags text[] default '{}',
  tips text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade
);

-- Create the cookbooks table
create table cookbooks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  is_public boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade
);

-- Create the cookbook_recipes junction table
create table cookbook_recipes (
  id uuid primary key default uuid_generate_v4(),
  cookbook_id uuid references cookbooks(id) on delete cascade,
  recipe_id text references recipes(id) on delete cascade,
  added_at timestamp with time zone default now(),
  unique(cookbook_id, recipe_id)
);

-- Create indexes for better performance
create index idx_recipes_created_at on recipes(created_at desc);
create index idx_recipes_user_id on recipes(user_id);
create index idx_recipes_cuisine_tags on recipes using gin(cuisine_tags);
create index idx_recipes_title_search on recipes using gin(to_tsvector('english', title));
create index idx_recipes_description_search on recipes using gin(to_tsvector('english', description));

create index idx_cookbooks_created_at on cookbooks(created_at desc);
create index idx_cookbooks_user_id on cookbooks(user_id);
create index idx_cookbooks_title_search on cookbooks using gin(to_tsvector('english', title));

create index idx_cookbook_recipes_cookbook_id on cookbook_recipes(cookbook_id);
create index idx_cookbook_recipes_recipe_id on cookbook_recipes(recipe_id);

-- Enable Row Level Security (RLS)
alter table recipes enable row level security;
alter table cookbooks enable row level security;
alter table cookbook_recipes enable row level security;

-- Create RLS policies for recipes
create policy "public can read recipes"
on recipes
for select to anon, authenticated
using (true);

create policy "users can insert recipes"
on recipes
for insert to authenticated
with check (true);

create policy "users can update own recipes"
on recipes
for update to authenticated
using (auth.uid() = user_id or user_id is null);

create policy "users can delete own recipes"
on recipes
for delete to authenticated
using (auth.uid() = user_id or user_id is null);

-- Create RLS policies for cookbooks
create policy "public can read public cookbooks"
on cookbooks
for select to anon, authenticated
using (is_public = true or auth.uid() = user_id or user_id is null);

create policy "users can insert cookbooks"
on cookbooks
for insert to authenticated
with check (auth.uid() = user_id or user_id is null);

create policy "users can update own cookbooks"
on cookbooks
for update to authenticated
using (auth.uid() = user_id or user_id is null);

create policy "users can delete own cookbooks"
on cookbooks
for delete to authenticated
using (auth.uid() = user_id or user_id is null);

-- Create RLS policies for cookbook_recipes
create policy "users can read cookbook recipes"
on cookbook_recipes
for select to anon, authenticated
using (
  exists (
    select 1 from cookbooks 
    where id = cookbook_id 
    and (is_public = true or user_id = auth.uid() or user_id is null)
  )
);

create policy "users can manage cookbook recipes"
on cookbook_recipes
for all to authenticated
using (
  exists (
    select 1 from cookbooks 
    where id = cookbook_id 
    and (user_id = auth.uid() or user_id is null)
  )
);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers to automatically update updated_at
create trigger update_recipes_updated_at 
  before update on recipes
  for each row execute function update_updated_at_column();

create trigger update_cookbooks_updated_at 
  before update on cookbooks
  for each row execute function update_updated_at_column();