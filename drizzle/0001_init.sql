-- Motora initial schema (Postgres / Supabase).
-- Run with: psql "$DATABASE_URL" -f drizzle/0001_init.sql
-- Covers spec section 57 core tables + indexes (section 59).
-- Supabase: enable RLS policies per table after review; service-role
-- key must stay server-only (never NEXT_PUBLIC_).

create table if not exists users (
  id text primary key,
  email text, phone text, password_hash text,
  name text not null, avatar_url text,
  roles jsonb not null default '[]',
  phone_verified boolean not null default false,
  email_verified boolean not null default false,
  id_verified boolean not null default false,
  city text, state text,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id text primary key, slug text not null unique,
  name text not null, icon text not null default '', sort int not null default 0
);

create table if not exists manufacturers (
  id text primary key, slug text not null unique, name text not null,
  category_slugs jsonb not null default '[]', country text not null default '',
  status text not null default 'ACTIVE'
);

create table if not exists vehicle_models (
  id text primary key, slug text not null, manufacturer_id text not null,
  name text not null, category_slug text not null,
  body_types jsonb not null default '[]', status text not null default 'ACTIVE'
);

create table if not exists vehicle_variants (
  id text primary key, slug text not null, model_id text not null,
  name text not null, year int not null, fuel text, transmission text,
  engine_cc int, power_ps int, price_ex_showroom int
);

create table if not exists listings (
  id text primary key, slug text not null unique, title text not null,
  category_slug text not null, subcategory_slug text,
  manufacturer_id text, manufacturer_name text not null,
  model_id text, model_name text not null,
  variant_id text, variant_name text,
  year int not null, price int not null,
  condition text not null, seller_type text not null,
  seller_id text not null, seller_name text not null, dealer_id text,
  city text not null, state text not null, locality text,
  kms int, fuel text, transmission text, engine_cc int, color text,
  description text not null default '',
  media jsonb not null default '[]', specs jsonb not null default '{}',
  featured boolean not null default false,
  verified_seller boolean not null default false,
  status text not null default 'DRAFT',
  views int not null default 0, saves int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists dealers (
  id text primary key, slug text not null unique,
  business_name text not null, contact_person text not null default '',
  phone text not null default '', email text not null default '',
  city text not null default '', state text not null default '',
  address text not null default '', lat real, lng real,
  description text not null default '', website text, whatsapp text,
  verified boolean not null default false, status text not null default 'PENDING',
  rating real not null default 0, review_count int not null default 0,
  opening_hours text not null default ''
);

create table if not exists conversations (
  id text primary key, listing_id text,
  participant_ids jsonb not null default '[]',
  last_message text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id text primary key, conversation_id text not null, listing_id text,
  from_user_id text not null, to_user_id text not null, body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id text primary key, user_id text not null, amount int not null,
  currency text not null default 'INR', purpose text not null,
  status text not null default 'CREATED', provider text not null default 'RAZORPAY',
  provider_order_id text, created_at timestamptz not null default now()
);

create table if not exists notifications (
  id text primary key, user_id text not null, kind text not null,
  title text not null, body text not null default '', link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists device_subscriptions (
  id text primary key, user_id text not null, platform text not null,
  push_provider text not null, token text not null,
  created_at timestamptz not null default now()
);

create table if not exists saved_searches (
  id text primary key, user_id text not null, name text not null,
  filters jsonb not null default '{}', notify text not null default 'DAILY',
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  user_id text not null, listing_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table if not exists audit_logs (
  id text primary key, actor_id text, action text not null,
  entity text not null default '', entity_id text not null default '',
  created_at timestamptz not null default now()
);

-- Indexes (spec 59): single + composite for common search combos.
create index if not exists idx_listings_category on listings (category_slug);
create index if not exists idx_listings_manufacturer on listings (manufacturer_id);
create index if not exists idx_listings_model on listings (model_id);
create index if not exists idx_listings_variant on listings (variant_id);
create index if not exists idx_listings_price on listings (price);
create index if not exists idx_listings_year on listings (year);
create index if not exists idx_listings_city on listings (city);
create index if not exists idx_listings_seller on listings (seller_type);
create index if not exists idx_listings_status on listings (status);
create index if not exists idx_listings_created on listings (created_at desc);
create index if not exists idx_listings_search_combo on listings (status, category_slug, price, year);
create index if not exists idx_messages_convo on messages (conversation_id);
create index if not exists idx_notif_user on notifications (user_id);
