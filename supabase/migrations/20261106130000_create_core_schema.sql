create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create type public.user_role as enum ('customer', 'admin', 'staff');
create type public.payment_method as enum ('COD', 'UPI');
create type public.payment_status as enum ('pending', 'submitted', 'verified', 'failed', 'refunded');
create type public.order_status as enum ('pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded');
create type public.fulfillment_status as enum ('pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled');
create type public.inquiry_status as enum ('new', 'reviewing', 'quoted', 'approved', 'rejected', 'closed');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  business_name text,
  email text not null unique,
  phone text,
  role public.user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  sku text not null unique,
  short_description text,
  description text,
  material text,
  dimensions text,
  handle_type text,
  weight_grams integer,
  moq integer not null check (moq > 0),
  base_price numeric(12,2) not null check (base_price >= 0),
  currency text not null default 'INR' check (currency = 'INR'),
  is_featured boolean not null default false,
  is_bestseller boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, image_url)
);

create table if not exists public.price_tiers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  tier_label text not null,
  min_quantity integer not null check (min_quantity > 0),
  max_quantity integer,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  currency text not null default 'INR' check (currency = 'INR'),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (max_quantity is null or max_quantity > min_quantity),
  unique (product_id, tier_label),
  unique (product_id, min_quantity)
);

alter table public.price_tiers
add constraint price_tiers_no_overlap
exclude using gist (
  product_id with =,
  int4range(min_quantity, coalesce(max_quantity, 2147483647), '[)') with &&
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products (id) on delete cascade,
  available_quantity integer not null default 0 check (available_quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  low_stock_threshold integer not null default 10 check (low_stock_threshold >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text,
  full_name text not null,
  company_name text,
  phone text not null,
  house_building text not null,
  street text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'checked_out', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  variant_name text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id, variant_name)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  order_number text not null unique,
  address_snapshot jsonb not null,
  item_snapshot jsonb not null,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  shipping_charge numeric(12,2) not null default 0 check (shipping_charge >= 0),
  final_amount numeric(12,2) not null check (final_amount >= 0),
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'pending',
  order_status public.order_status not null default 'pending',
  fulfillment_status public.fulfillment_status not null default 'pending',
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete restrict,
  product_name text not null,
  sku text not null,
  selected_color text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  total_price numeric(12,2) not null check (total_price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete restrict,
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'pending',
  provider_name text,
  transaction_reference text,
  amount numeric(12,2) not null check (amount >= 0),
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bulk_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  product_requirements text not null,
  estimated_quantity integer not null check (estimated_quantity > 0),
  customization_details text,
  delivery_location text not null,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12,2) not null check (discount_value >= 0),
  min_order_value numeric(12,2) not null default 0 check (min_order_value >= 0),
  max_discount numeric(12,2),
  is_active boolean not null default true,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  usage_limit integer,
  used_count integer not null default 0 check (used_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (usage_limit is null or used_count <= usage_limit)
);

create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_active_featured on public.products (is_active, is_featured);
create index if not exists idx_products_slug on public.products (slug);
create index if not exists idx_product_images_product_id on public.product_images (product_id, sort_order);
create index if not exists idx_price_tiers_product_id on public.price_tiers (product_id, min_quantity);
create index if not exists idx_inventory_low_stock on public.inventory (available_quantity, low_stock_threshold);
create index if not exists idx_addresses_user_id on public.addresses (user_id);
create index if not exists idx_carts_user_id on public.carts (user_id);
create index if not exists idx_cart_items_cart_id on public.cart_items (cart_id);
create index if not exists idx_orders_user_id on public.orders (user_id, created_at desc);
create index if not exists idx_orders_payment_status on public.orders (payment_status);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_payments_order_id on public.payments (order_id);
create index if not exists idx_bulk_inquiries_user_id on public.bulk_inquiries (user_id);
create index if not exists idx_coupons_code on public.coupons (code);
