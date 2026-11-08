-- DEMO DATA ONLY: These sample records are intended for local development and review.
-- Do not use these values in production.

begin;

insert into public.categories (id, name, slug, description, image_url, is_active)
values
  ('11111111-1111-1111-1111-111111111111', 'Shopping Bags', 'shopping-bags', 'Retail and grocery carriers for bulk distribution.', 'https://images.unsplash.com/photo-1544816155-12df9643f363', true),
  ('22222222-2222-2222-2222-222222222222', 'Tote Bags', 'tote-bags', 'Lifestyle and premium brand carryalls.', 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6', true),
  ('33333333-3333-3333-3333-333333333333', 'Gift Bags', 'gift-bags', 'Festive and premium gifting formats.', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7', true),
  ('44444444-4444-4444-4444-444444444444', 'Promotional Bags', 'promotional-bags', 'Campaign and giveaway carriers for brands.', 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a', true),
  ('55555555-5555-5555-5555-555555555555', 'Custom Printed Bags', 'custom-printed-bags', 'Branding-first printed bags for corporate programs.', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d', true),
  ('66666666-6666-6666-6666-666666666666', 'Corporate Bags', 'corporate-bags', 'Executive and conference folios for businesses.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', true)
on conflict (slug) do nothing;

with category_map as (
  select id, slug from public.categories
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
from public.categories c
where c.slug = 'shopping-bags'
on conflict (sku) do nothing;

with product_row as (
  select id from public.products where sku = 'JUT-SHOP-001'
)
insert into public.product_images (product_id, image_url, alt_text, is_primary, sort_order)
select
  pr.id,
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  'Grand Market Tote front view',
  true,
  0
from product_row pr
on conflict (product_id, image_url) do nothing;

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

with product_row as (
  select id from public.products where sku = 'JUT-SHOP-001'
)
insert into public.inventory (product_id, available_quantity, reserved_quantity, low_stock_threshold)
select pr.id, 2500, 120, 50
from product_row pr
on conflict (product_id) do nothing;

commit;
