import { NextResponse } from 'next/server';
import { calculateCartTotals, getApplicableTier, validateCartItem } from '@/lib/cart';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function buildCartItemPayload(row, item) {
  const product = row.products || {};
  const quantity = Number(item.quantity || 0);
  const selectedColor = item.variant_name || item.selectedColor || 'Natural Jute';
  const tier = getApplicableTier(product, quantity, 'INR');

  return {
    id: product.id || row.product_id,
    productId: product.id || row.product_id,
    itemKey: `${product.id || row.product_id}-${selectedColor}`,
    name: product.name || 'JUTON Product',
    category: product.categories?.name || 'Wholesale',
    image: product.product_images?.find((img) => img.is_primary)?.image_url || product.product_images?.[0]?.image_url || '',
    selectedColor,
    quantity,
    unitPrice: tier.unitPrice,
    lineTotal: quantity * tier.unitPrice,
    tierLabel: tier.label,
    moq: Number(product.moq || 50),
    stockQuantity: Number(product.inventory?.available_quantity ?? 0),
    inStock: product.is_active !== false && Number(product.inventory?.available_quantity ?? 0) > 0,
    priceINR: tier.unitPrice,
  };
}

async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { supabase: null, user: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { supabase, user: null };
  }

  return { supabase, user };
}

async function getUserCart(supabase, userId) {
  const { data: cartRow, error: cartError } = await supabase
    .from('carts')
    .select('id, user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (cartError) {
    throw cartError;
  }

  if (!cartRow) {
    const { data: createdCart, error: createError } = await supabase
      .from('carts')
      .insert({ user_id: userId, status: 'active' })
      .select('id, user_id')
      .single();

    if (createError) {
      throw createError;
    }

    return createdCart;
  }

  return cartRow;
}

export async function GET() {
  const { supabase, user } = await getAuthenticatedUser();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  try {
    const cart = await getUserCart(supabase, user.id);
    const { data: rows, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        unit_price,
        variant_name,
        note,
        products (
          id,
          name,
          slug,
          sku,
          moq,
          base_price,
          is_active,
          categories (name, slug),
          inventory (available_quantity, reserved_quantity, low_stock_threshold),
          product_images (image_url, is_primary, sort_order),
          price_tiers (min_quantity, max_quantity, tier_label, unit_price)
        )
      `)
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const mappedItems = (rows || []).map((row) => buildCartItemPayload(row, row));
    const totals = calculateCartTotals(mappedItems, 'INR');

    return NextResponse.json({ items: mappedItems, totals });
  } catch (error) {
    console.warn('Failed to read cart from Supabase:', error);
    return NextResponse.json({ error: 'Unable to read cart.' }, { status: 500 });
  }
}

export async function POST(request) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'sync';
    const cart = await getUserCart(supabase, user.id);

    if (action === 'clear') {
      const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);
      if (error) throw error;
      return NextResponse.json({ success: true, items: [], totals: calculateCartTotals([], 'INR') });
    }

    if (action === 'sync' && Array.isArray(body.items)) {
      const { error: clearError } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);
      if (clearError) throw clearError;

      const upserts = [];
      for (const item of body.items) {
        const productId = item.productId || item.id;
        const quantity = Number(item.quantity || 0);
        if (!productId || !Number.isFinite(quantity) || quantity <= 0) continue;

        const { data: productRow, error: productError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            moq,
            base_price,
            is_active,
            categories (name, slug),
            inventory (available_quantity, reserved_quantity, low_stock_threshold),
            product_images (image_url, is_primary, sort_order),
            price_tiers (min_quantity, max_quantity, tier_label, unit_price)
          `)
          .eq('id', productId)
          .maybeSingle();

        if (productError || !productRow) continue;

        const { error: inventoryError } = await supabase.rpc('check_inventory_capacity', {
          p_product_id: productId,
          p_quantity: quantity,
        });

        if (inventoryError) {
          continue;
        }

        const validation = validateCartItem({
          ...productRow,
          inStock: productRow.is_active !== false && Number(productRow.inventory?.available_quantity ?? 0) > 0,
          stockQuantity: Number(productRow.inventory?.available_quantity ?? 0),
        }, quantity, { currency: 'INR' });

        if (!validation.valid) continue;

        upserts.push({
          cart_id: cart.id,
          product_id: productId,
          variant_name: item.selectedColor || 'Natural Jute',
          quantity: validation.sanitizedQuantity,
          unit_price: validation.unitPrice || Number(productRow.base_price || 0),
          note: '',
        });
      }

      if (upserts.length > 0) {
        const { error: insertError } = await supabase.from('cart_items').insert(upserts);
        if (insertError) throw insertError;
      }

      const { data: savedRows, error: fetchError } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          unit_price,
          variant_name,
          note,
          products (
            id,
            name,
            slug,
            sku,
            moq,
            base_price,
            is_active,
            categories (name, slug),
            inventory (available_quantity, reserved_quantity, low_stock_threshold),
            product_images (image_url, is_primary, sort_order),
            price_tiers (min_quantity, max_quantity, tier_label, unit_price)
          )
        `)
        .eq('cart_id', cart.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const items = (savedRows || []).map((row) => buildCartItemPayload(row, row));
      return NextResponse.json({ success: true, items, totals: calculateCartTotals(items, 'INR') });
    }

    const productId = body.productId || body.id;
    const quantity = Number(body.quantity || 0);
    const variantName = body.selectedColor || body.variantName || 'Natural Jute';

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const { data: productRow, error: productError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        moq,
        base_price,
        is_active,
        categories (name, slug),
        inventory (available_quantity, reserved_quantity, low_stock_threshold),
        product_images (image_url, is_primary, sort_order),
        price_tiers (min_quantity, max_quantity, tier_label, unit_price)
      `)
      .eq('id', productId)
      .maybeSingle();

    if (productError || !productRow) {
      throw productError || new Error('Product not found.');
    }

    const { error: inventoryError } = await supabase.rpc('check_inventory_capacity', {
      p_product_id: productId,
      p_quantity: quantity,
    });

    if (inventoryError) {
      return NextResponse.json({ success: false, error: 'Requested quantity exceeds current available stock.' }, { status: 400 });
    }

    const validation = validateCartItem({
      ...productRow,
      inStock: productRow.is_active !== false && Number(productRow.inventory?.available_quantity ?? 0) > 0,
      stockQuantity: Number(productRow.inventory?.available_quantity ?? 0),
    }, quantity, { currency: 'INR' });

    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .eq('variant_name', variantName)
      .maybeSingle();

    if (existingError) throw existingError;

    const nextQuantity = action === 'update' ? validation.sanitizedQuantity : (existing ? existing.quantity + validation.sanitizedQuantity : validation.sanitizedQuantity);
    const unitPrice = validation.unitPrice || Number(productRow.base_price || 0);

    const upsertObj = {
      cart_id: cart.id,
      product_id: productId,
      variant_name: variantName,
      quantity: nextQuantity,
      unit_price: unitPrice,
      note: body.note || '',
    };

    if (existing) {
      upsertObj.id = existing.id;
    }

    const { data: upserted, error: upsertError } = await supabase
      .from('cart_items')
      .upsert(upsertObj, { onConflict: 'cart_id,product_id,variant_name' })
      .select('id, product_id, quantity, unit_price, variant_name, note')
      .maybeSingle();

    if (upsertError) throw upsertError;

    const { data: savedRows, error: fetchError } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        unit_price,
        variant_name,
        note,
        products (
          id,
          name,
          slug,
          sku,
          moq,
          base_price,
          is_active,
          categories (name, slug),
          inventory (available_quantity, reserved_quantity, low_stock_threshold),
          product_images (image_url, is_primary, sort_order),
          price_tiers (min_quantity, max_quantity, tier_label, unit_price)
        )
      `)
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    const items = (savedRows || []).map((row) => buildCartItemPayload(row, row));
    return NextResponse.json({ success: true, item: upserted, items, totals: calculateCartTotals(items, 'INR') });
  } catch (error) {
    console.warn('Failed to update cart in Supabase:', error);
    return NextResponse.json({ error: error.message || 'Unable to update cart.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const cart = await getUserCart(supabase, user.id);

    if (!productId) {
      const { error } = await supabase.from('cart_items').delete().eq('cart_id', cart.id);
      if (error) throw error;
      return NextResponse.json({ success: true, items: [], totals: calculateCartTotals([], 'INR') });
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)
      .eq('product_id', productId);

    if (error) throw error;

    const { data: rows } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        variant_name,
        products (
          id,
          name,
          moq,
          is_active,
          categories (name, slug),
          inventory (available_quantity),
          product_images (image_url, is_primary, sort_order),
          price_tiers (min_quantity, max_quantity, tier_label, unit_price)
        )
      `)
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: false });

    const items = (rows || []).map((row) => buildCartItemPayload(row, row));
    return NextResponse.json({ success: true, items, totals: calculateCartTotals(items, 'INR') });
  } catch (error) {
    console.warn('Failed to delete cart item:', error);
    return NextResponse.json({ error: error.message || 'Unable to remove cart item.' }, { status: 500 });
  }
}
