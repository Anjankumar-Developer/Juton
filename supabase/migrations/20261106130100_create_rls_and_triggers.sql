create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

create or replace function public.prevent_unverified_upi_payment()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if new.payment_method = 'UPI' and new.payment_status = 'verified' and not public.is_admin_user() then
    raise exception 'UPI payments cannot be marked as verified by customers. Admin approval is required.';
  end if;
  return new;
end;
$$;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger trg_product_images_updated_at
before update on public.product_images
for each row execute function public.set_updated_at();

create trigger trg_price_tiers_updated_at
before update on public.price_tiers
for each row execute function public.set_updated_at();

create trigger trg_inventory_updated_at
before update on public.inventory
for each row execute function public.set_updated_at();

create trigger trg_addresses_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

create trigger trg_carts_updated_at
before update on public.carts
for each row execute function public.set_updated_at();

create trigger trg_cart_items_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger trg_order_items_updated_at
before update on public.order_items
for each row execute function public.set_updated_at();

create trigger trg_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create trigger trg_bulk_inquiries_updated_at
before update on public.bulk_inquiries
for each row execute function public.set_updated_at();

create trigger trg_coupons_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

create trigger trg_payments_upi_verification_guard
before insert or update on public.payments
for each row execute function public.prevent_unverified_upi_payment();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.price_tiers enable row level security;
alter table public.inventory enable row level security;
alter table public.addresses enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.bulk_inquiries enable row level security;
alter table public.coupons enable row level security;

create policy "Profiles are viewable by owner or admin"
on public.profiles
for select
using (id = auth.uid() or public.is_admin_user());

create policy "Profiles can be inserted by self only"
on public.profiles
for insert
with check (id = auth.uid() and role = 'customer');

create policy "Profiles can be updated by self or admin"
on public.profiles
for update
using (id = auth.uid() or public.is_admin_user())
with check (
  (id = auth.uid() and role = old.role) or public.is_admin_user()
);

create policy "Profiles can be deleted only by admin"
on public.profiles
for delete
using (public.is_admin_user());

create policy "Categories are viewable by all"
on public.categories
for select
using (true);

create policy "Categories require admin management"
on public.categories
for all
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Products are viewable by all"
on public.products
for select
using (true);

create policy "Products require admin management"
on public.products
for all
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Product images are viewable by all"
on public.product_images
for select
using (true);

create policy "Product images require admin management"
on public.product_images
for all
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Price tiers are viewable by all"
on public.price_tiers
for select
using (true);

create policy "Price tiers require admin management"
on public.price_tiers
for all
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Inventory is viewable by all"
on public.inventory
for select
using (true);

create policy "Inventory requires admin management"
on public.inventory
for all
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Addresses are viewable by owner or admin"
on public.addresses
for select
using (user_id = auth.uid() or public.is_admin_user());

create policy "Addresses can be managed by owner or admin"
on public.addresses
for all
using (user_id = auth.uid() or public.is_admin_user())
with check (user_id = auth.uid() or public.is_admin_user());

create policy "Carts are viewable by owner or admin"
on public.carts
for select
using (user_id = auth.uid() or public.is_admin_user());

create policy "Carts can be managed by owner or admin"
on public.carts
for all
using (user_id = auth.uid() or public.is_admin_user())
with check (user_id = auth.uid() or public.is_admin_user());

create policy "Cart items are viewable by cart owner or admin"
on public.cart_items
for select
using (
  exists (
    select 1
    from public.carts c
    where c.id = cart_items.cart_id
      and (c.user_id = auth.uid() or public.is_admin_user())
  )
);

create policy "Cart items can be managed by cart owner or admin"
on public.cart_items
for all
using (
  exists (
    select 1
    from public.carts c
    where c.id = cart_items.cart_id
      and (c.user_id = auth.uid() or public.is_admin_user())
  )
)
with check (
  exists (
    select 1
    from public.carts c
    where c.id = cart_items.cart_id
      and (c.user_id = auth.uid() or public.is_admin_user())
  )
);

create policy "Orders are viewable by owner or admin"
on public.orders
for select
using (user_id = auth.uid() or public.is_admin_user());

create policy "Orders can be created or updated by owner or admin"
on public.orders
for all
using (user_id = auth.uid() or public.is_admin_user())
with check (user_id = auth.uid() or public.is_admin_user());

create policy "Order items are viewable by owner or admin"
on public.order_items
for select
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and (o.user_id = auth.uid() or public.is_admin_user())
  )
);

create policy "Order items can be managed by owner or admin"
on public.order_items
for all
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and (o.user_id = auth.uid() or public.is_admin_user())
  )
)
with check (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and (o.user_id = auth.uid() or public.is_admin_user())
  )
);

create policy "Payments are viewable by owner or admin"
on public.payments
for select
using (user_id = auth.uid() or public.is_admin_user());

create policy "Payments can be created by owner or admin"
on public.payments
for insert
with check (user_id = auth.uid() or public.is_admin_user());

create policy "Payments can be updated by owner or admin"
on public.payments
for update
using (user_id = auth.uid() or public.is_admin_user())
with check (user_id = auth.uid() or public.is_admin_user());

create policy "Payments can be deleted by admin only"
on public.payments
for delete
using (public.is_admin_user());

create policy "Bulk inquiries are viewable by owner or admin"
on public.bulk_inquiries
for select
using (user_id = auth.uid() or public.is_admin_user() or user_id is null);

create policy "Bulk inquiries can be created by authenticated users"
on public.bulk_inquiries
for insert
with check ((user_id = auth.uid() and auth.uid() is not null) or public.is_admin_user());

create policy "Bulk inquiries can be updated by owner or admin"
on public.bulk_inquiries
for update
using (user_id = auth.uid() or public.is_admin_user())
with check (user_id = auth.uid() or public.is_admin_user());

create policy "Coupons are viewable by all"
on public.coupons
for select
using (true);

create policy "Coupons require admin management"
on public.coupons
for all
using (public.is_admin_user())
with check (public.is_admin_user());
