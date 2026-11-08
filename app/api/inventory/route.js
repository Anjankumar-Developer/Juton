import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function requireAdminSupabase() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { supabase: null, user: null, profile: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { supabase, user: null, profile: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle();

  return { supabase, user, profile: profileError ? null : profile };
}

export async function GET() {
  const { supabase, user, profile } = await requireAdminSupabase();
  if (!supabase || !user || !profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('inventory')
    .select(`
      id,
      product_id,
      available_quantity,
      reserved_quantity,
      low_stock_threshold,
      products (id, name, slug, sku, is_active)
    `)
    .order('product_id', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Unable to fetch inventory.' }, { status: 500 });
  }

  return NextResponse.json({ items: data || [] });
}

export async function POST(request) {
  const { supabase, user, profile } = await requireAdminSupabase();
  if (!supabase || !user || !profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { productId, quantity, action = 'reserve' } = body;
    const requestedQuantity = Number(quantity || 0);

    if (!productId) {
      return NextResponse.json({ error: 'A productId is required.' }, { status: 400 });
    }

    if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
      return NextResponse.json({ error: 'Quantity must be a positive integer.' }, { status: 400 });
    }

    let rpcName = 'reserve_inventory';
    let params = { p_product_id: productId, p_quantity: requestedQuantity };

    if (action === 'release') {
      rpcName = 'release_inventory';
    } else if (action === 'adjust') {
      rpcName = 'adjust_inventory';
      params = { p_product_id: productId, p_delta: requestedQuantity, p_reason: 'admin_adjustment' };
    }

    const { data, error } = await supabase.rpc(rpcName, params);
    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, inventory: data });
  } catch (error) {
    console.warn('Inventory update failed:', error);
    return NextResponse.json({ error: error.message || 'Inventory update rejected.' }, { status: 500 });
  }
}
