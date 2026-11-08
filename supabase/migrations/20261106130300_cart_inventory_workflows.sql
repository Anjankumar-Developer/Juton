create or replace function public.ensure_inventory_entry(p_product_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.inventory (product_id, available_quantity, reserved_quantity, low_stock_threshold)
  values (p_product_id, 0, 0, 10)
  on conflict (product_id) do nothing;
end;
$$;

create or replace function public.check_inventory_capacity(p_product_id uuid, p_quantity integer)
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_row public.inventory;
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero.';
  end if;

  perform public.ensure_inventory_entry(p_product_id);

  select *
  into v_row
  from public.inventory
  where product_id = p_product_id
  for update;

  if v_row is null then
    raise exception 'Inventory row not found for this product.';
  end if;

  if v_row.available_quantity < p_quantity then
    raise exception 'Requested quantity exceeds current available stock.';
  end if;

  return v_row.available_quantity;
end;
$$;

create or replace function public.reserve_inventory(p_product_id uuid, p_quantity integer)
returns public.inventory
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_row public.inventory;
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Reservation quantity must be greater than zero.';
  end if;

  perform public.ensure_inventory_entry(p_product_id);

  update public.inventory
  set
    reserved_quantity = reserved_quantity + p_quantity,
    available_quantity = available_quantity - p_quantity,
    updated_at = now()
  where product_id = p_product_id
    and available_quantity >= p_quantity
  returning * into v_row;

  if v_row is null then
    raise exception 'Requested quantity exceeds current available stock.';
  end if;

  return v_row;
end;
$$;

create or replace function public.release_inventory(p_product_id uuid, p_quantity integer)
returns public.inventory
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_row public.inventory;
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Release quantity must be greater than zero.';
  end if;

  perform public.ensure_inventory_entry(p_product_id);

  update public.inventory
  set
    reserved_quantity = greatest(reserved_quantity - p_quantity, 0),
    available_quantity = available_quantity + p_quantity,
    updated_at = now()
  where product_id = p_product_id
  returning * into v_row;

  if v_row is null then
    raise exception 'Inventory row not found for release.';
  end if;

  return v_row;
end;
$$;

create or replace function public.adjust_inventory(p_product_id uuid, p_delta integer, p_reason text default 'manual')
returns public.inventory
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_row public.inventory;
begin
  if p_delta = 0 then
    raise exception 'Inventory delta cannot be zero.';
  end if;

  perform public.ensure_inventory_entry(p_product_id);

  update public.inventory
  set
    available_quantity = greatest(available_quantity + p_delta, 0),
    updated_at = now()
  where product_id = p_product_id
  returning * into v_row;

  if v_row is null then
    raise exception 'Inventory row not found.';
  end if;

  return v_row;
end;
$$;

create or replace function public.calculate_cart_totals(p_cart_items jsonb)
returns jsonb
language plpgsql
immutable
security definer
set search_path = public, auth
as $$
begin
  return jsonb_build_object(
    'subtotal', coalesce((select sum((item ->> 'quantity')::numeric * (item ->> 'unit_price')::numeric) from jsonb_array_elements(p_cart_items) as item), 0),
    'total_items', coalesce(jsonb_array_length(p_cart_items), 0)
  );
end;
$$;
