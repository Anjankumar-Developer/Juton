-- DEMO DATA ONLY: This seed file is for local development and demo environments.
-- It must be removed or disabled before production deployment.

insert into public.categories (id, name, slug, description, image_url, is_active)
values
  ('11111111-1111-1111-1111-111111111111', 'Shopping Bags', 'shopping-bags', 'Retail and grocery carriers for bulk distribution.', 'https://images.unsplash.com/photo-1544816155-12df9643f363', true),
  ('22222222-2222-2222-2222-222222222222', 'Tote Bags', 'tote-bags', 'Lifestyle and premium brand carryalls.', 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6', true)
on conflict (slug) do nothing;

with category_row as (
  select id from public.categories where slug = 'shopping-bags'
)
insert into public.products (
  id,
  category_id,
  name,
  slug,
  sku,
  short_description,
  description,
  material,
  dimensions,
  handle_type,
  weight_grams,
  moq,
  base_price,
  currency,
  is_featured,
  is_bestseller,
  is_active
)
select
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  c.id,
  'The Grand Market Shopping Tote',
  'the-grand-market-shopping-tote',
  'JUT-SHOP-001',
  'Heavy-duty jute shopping tote for grocery and retail operations.',
  'Engineered for everyday bulk retail usage with reinforced corners, padded handles and moisture-resistant finish.',
  '100% Raw Golden Bengal Jute',
  '42 cm (W) x 36 cm (H) x 16 cm (D)',
  'Organic Cotton Rope Handle',
  340,
  100,
  145.00,
  'INR',
  true,
  true,
  true
from category_row c
on conflict (sku) do nothing;

with product_row as (
  select id from public.products where sku = 'JUT-SHOP-001'
)
insert into public.inventory (product_id, available_quantity, reserved_quantity, low_stock_threshold)
select pr.id, 2500, 120, 50
from product_row pr
on conflict (product_id) do nothing;

with product_row as (
  select id from public.products where sku = 'JUT-SHOP-001'
)
insert into public.price_tiers (product_id, tier_label, min_quantity, max_quantity, unit_price, currency, is_default)
select pr.id, '50-99', 50, 99, 165.00, 'INR', false from product_row pr
union all
select pr.id, '100-499', 100, 499, 145.00, 'INR', true from product_row pr
union all
select pr.id, '500-999', 500, 999, 135.00, 'INR', false from product_row pr
union all
select pr.id, '1000+', 1000, null, 125.00, 'INR', false from product_row pr
on conflict (product_id, tier_label) do nothing;
