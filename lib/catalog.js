import { products as staticProducts, CATEGORIES as staticCategories } from '@/data/products';
import { supabaseBrowser } from '@/lib/supabase/client';

const defaultColors = [
  { name: 'Natural Jute', hex: '#E8DDCA', border: '#A88B66' },
  { name: 'Ivory', hex: '#F7F5EF', border: '#E8DDCA' },
  { name: 'Olive Green', hex: '#68745A', border: '#3D4935' },
  { name: 'Charcoal', hex: '#252720', border: '#3D4935' },
];

function asNumber(value, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parsePriceTiers(rawTiers = []) {
  return rawTiers.map((tier) => {
    const min = asNumber(tier.min_quantity ?? tier.min ?? 1);
    const max = tier.max_quantity ?? tier.max ?? null;
    const unitPrice = asNumber(tier.unit_price ?? tier.price ?? 0);

    return {
      min,
      max,
      label: tier.tier_label || `Tier ${min}${max ? `–${max}` : '+'} units`,
      price: unitPrice,
      isBase: tier.is_default || min <= 99,
    };
  });
}

function normalizeProductRecord(row) {
  const productImages = Array.isArray(row.product_images) ? row.product_images : [];
  const primaryImage = productImages.find((img) => img.is_primary) || productImages[0];
  const gallery = productImages
    .map((img) => img.image_url)
    .filter(Boolean);

  const basePrice = asNumber(row.base_price ?? row.starting_price ?? 0, 0);
  const inventoryQty = asNumber(row.inventory?.available_quantity ?? row.stock_quantity ?? 0, 0);
  const categoryName = row.categories?.name || 'Custom Printed Bags';
  const categorySlug = row.categories?.slug || 'custom-printed-bags';
  const createdAt = row.created_at || new Date().toISOString();

  return {
    id: row.slug || row.id,
    slug: row.slug || row.id,
    name: row.name || 'JUTON Product',
    category: categoryName,
    collectionId: categorySlug,
    badge: row.is_bestseller ? 'Best Seller' : row.is_featured ? 'Featured' : '',
    isBestSeller: Boolean(row.is_bestseller),
    isNew: Boolean(row.is_featured) || new Date(createdAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    inStock: inventoryQty > 0,
    stockQuantity: inventoryQty,
    dateAdded: createdAt,
    moq: asNumber(row.moq ?? 100, 100),
    startingPrice: basePrice,
    priceINR: basePrice,
    priceUSD: Number((basePrice / 82.0).toFixed(2)),
    fabricWeight: row.weight_grams ? `${asNumber(row.weight_grams, 300)} GSM` : '300 GSM',
    material: row.material || '100% Natural Jute',
    dimensions: row.dimensions || 'Made to specification',
    handleType: row.handle_type || 'Organic cotton webbing',
    description: row.description || row.short_description || 'Wholesale jute packaging crafted with natural fibers and sustainable finishing.',
    image: primaryImage?.image_url || gallery[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    gallery: gallery.length > 0 ? gallery : [primaryImage?.image_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
    colors: defaultColors,
    pricingTiersINR: parsePriceTiers(row.price_tiers || []),
    pricingTiersUSD: parsePriceTiers(row.price_tiers || []).map((tier) => ({
      ...tier,
      price: Number((tier.price / 82.0).toFixed(2)),
      label: tier.label,
    })),
    sku: row.sku || '',
    shortDescription: row.short_description || row.description || '',
    inventory: row.inventory || { available_quantity: inventoryQty },
  };
}

export const fallbackCategories = staticCategories;
export const fallbackCatalogProducts = staticProducts;

export async function fetchCatalogCategories() {
  const supabase = supabaseBrowser;

  if (!supabase) {
    return fallbackCategories;
  }

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    if (!categories || categories.length === 0) {
      return fallbackCategories;
    }

    const { data: countsData, error: countsError } = await supabase
      .from('products')
      .select('category_id')
      .eq('is_active', true);

    if (countsError) {
      return categories.map((category) => category.name);
    }

    const counts = new Map();
    (countsData || []).forEach((product) => {
      counts.set(product.category_id, (counts.get(product.category_id) || 0) + 1);
    });

    return categories.map((category) => ({
      ...category,
      count: counts.get(category.id) || 0,
      label: category.name,
    }));
  } catch (error) {
    console.warn('Failed to fetch catalog categories:', error);
    return fallbackCategories;
  }
}

export async function fetchCatalogProducts({
  category = null,
  search = '',
  sortBy = 'featured',
  availability = 'all',
} = {}) {
  const supabase = supabaseBrowser;

  if (!supabase) {
    return {
      products: staticProducts,
      categories: staticCategories,
    };
  }

  try {
    let query = supabase
      .from('products')
      .select(`
        id,
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
        is_featured,
        is_bestseller,
        is_active,
        created_at,
        category_id,
        categories(name, slug),
        inventory(available_quantity, low_stock_threshold),
        product_images(image_url, is_primary, sort_order),
        price_tiers(min_quantity, max_quantity, unit_price, tier_label, is_default)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category && category !== 'All Categories') {
      const normalized = category.toLowerCase().trim();
      const categoryMatch = normalized.replace(/\s+/g, '-');
      const { data: categoryRows, error: categoryError } = await supabase
        .from('categories')
        .select('id, slug')
        .or(`slug.eq.${categoryMatch},name.ilike.%${normalized}%`)
        .limit(1);

      if (categoryError) {
        throw categoryError;
      }

      if (categoryRows && categoryRows.length > 0) {
        query = query.eq('category_id', categoryRows[0].id);
      }
    }

    const trimmedSearch = (search || '').trim();
    if (trimmedSearch) {
      const escaped = trimmedSearch.replace(/[%_]/g, '');
      query = query.or(
        `name.ilike.%${escaped}%,sku.ilike.%${escaped}%,description.ilike.%${escaped}%,short_description.ilike.%${escaped}%`
      );
    }

    if (availability === 'in-stock') {
      query = query.gte('inventory.available_quantity', 1);
    }

    if (availability === 'made-to-order') {
      query = query.eq('inventory.available_quantity', 0);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    const mapped = (data || []).map((row) => normalizeProductRecord(row));

    if (sortBy === 'price-asc') {
      mapped.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'price-desc') {
      mapped.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === 'newest') {
      mapped.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (sortBy === 'bestsellers') {
      mapped.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    } else if (sortBy === 'moq-asc') {
      mapped.sort((a, b) => a.moq - b.moq);
    } else {
      mapped.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || new Date(b.dateAdded) - new Date(a.dateAdded));
    }

    return {
      products: mapped,
      categories: await fetchCatalogCategories(),
    };
  } catch (error) {
    console.warn('Failed to fetch product catalog from Supabase:', error);
    return {
      products: staticProducts,
      categories: staticCategories,
    };
  }
}

export async function fetchProductBySlugOrId(productIdentifier) {
  const supabase = supabaseBrowser;

  if (!supabase) {
    const fallback = staticProducts.find((product) => product.id === productIdentifier || product.slug === productIdentifier);
    return fallback || null;
  }

  try {
    const trimmedIdentifier = (productIdentifier || '').trim();
    if (!trimmedIdentifier) {
      return null;
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
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
        is_featured,
        is_bestseller,
        is_active,
        created_at,
        category_id,
        categories(name, slug),
        inventory(available_quantity, low_stock_threshold),
        product_images(image_url, is_primary, sort_order),
        price_tiers(min_quantity, max_quantity, unit_price, tier_label, is_default)
      `)
      .eq('is_active', true)
      .or(`slug.eq.${trimmedIdentifier},id.eq.${trimmedIdentifier}`)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return staticProducts.find((product) => product.id === trimmedIdentifier || product.slug === trimmedIdentifier) || null;
    }

    return normalizeProductRecord(data);
  } catch (error) {
    console.warn('Failed to fetch product details from Supabase:', error);
    return staticProducts.find((product) => product.id === productIdentifier || product.slug === productIdentifier) || null;
  }
}
