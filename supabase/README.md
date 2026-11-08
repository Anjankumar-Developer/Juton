# JUTON Supabase Database Setup

This directory contains the initial PostgreSQL schema and local setup guidance for the JUTON wholesale jute bag storefront.

## Included schema

The migration files define the following tables:

- profiles
- categories
- products
- product_images
- price_tiers
- inventory
- addresses
- carts
- cart_items
- orders
- order_items
- payments
- bulk_inquiries
- coupons

## Local migration workflow

```bash
npx supabase init
npx supabase start
npx supabase db reset
```

Then apply the migration files in `supabase/migrations/`.

## Required environment values

Add these to `.env.local` in the app root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

Never expose service-role or secret keys to frontend code.

## Security notes

- All private data is protected with Row Level Security.
- Customers can manage only their own records.
- Admin-only management is enforced by the `public.is_admin_user()` helper.
- UPI verification is blocked for non-admin users via database trigger enforcement.

## Demo data

Demo seed records are stored in `supabase/migrations/20261106130200_seed_demo_data.sql` and are clearly marked as demo-only.

This is intentionally schema-first setup only. Frontend database wiring and payment processing are not implemented in this step.
