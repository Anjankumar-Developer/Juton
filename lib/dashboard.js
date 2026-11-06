/**
 * JUTON Customer Dashboard Business Rules & Demonstration State Module
 * Provides pure business logic for luxury editorial B2B customer accounts:
 * - 6 Demonstration Order Statuses (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled)
 * - Multi-stage visual order progress timeline calculations
 * - Saved delivery addresses management (Pan-India)
 * - Account settings & notification preferences
 * - Order filtering, searching, and financial rollups
 */

import { INDIAN_PIN_REGEX, INDIAN_MOBILE_REGEX, EMAIL_REGEX } from './auth.js';

export const LOCAL_STORAGE_SAVED_ADDRESSES_KEY = 'juton_saved_addresses_v1';
export const LOCAL_STORAGE_SETTINGS_KEY = 'juton_account_settings_v1';

/**
 * 6 Official Demonstration Order Statuses
 */
export const ORDER_STATUSES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

/**
 * Visual Progress Steps for Standard Non-Cancelled Order Lifecycle
 */
export const ORDER_PROGRESS_STEPS = [
  {
    step: 1,
    key: 'Pending',
    label: 'Order Placed',
    sublabel: 'Awaiting Mill Review',
    description: 'Commercial order logged into Bengal production queue.',
  },
  {
    step: 2,
    key: 'Confirmed',
    label: 'Mill Confirmed',
    sublabel: 'Artwork & Loom Slotted',
    description: 'Technical specs & GST verification approved by atelier manager.',
  },
  {
    step: 3,
    key: 'Processing',
    label: 'In Production',
    sublabel: 'Weaving & AZO-Free Print',
    description: 'Heavyweight golden jute weft serging, screen print & 4-point stitching.',
  },
  {
    step: 4,
    key: 'Shipped',
    label: 'In Cargo Transit',
    sublabel: 'Insured Freight',
    description: 'Dispatched from Kolkata mill hub with pan-India consignment note.',
  },
  {
    step: 5,
    key: 'Delivered',
    label: 'Delivered',
    sublabel: 'Procurement Complete',
    description: 'Signed for at client distribution center with final tax invoice.',
  },
];

/**
 * Comprehensive Metadata for Every Status
 */
export const STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    currentStep: 1,
    badgeBg: 'bg-[#F7F5EF]',
    badgeText: 'text-[#A88B66]',
    badgeBorder: 'border-[#A88B66]/60',
    dotColor: 'bg-[#A88B66]',
    headline: 'Order Pending Review',
    summaryText: 'Your wholesale order has been received and is awaiting mill floor slotting.',
  },
  Confirmed: {
    label: 'Confirmed',
    currentStep: 2,
    badgeBg: 'bg-[#E8DDCA]/60',
    badgeText: 'text-[#3D4935]',
    badgeBorder: 'border-[#3D4935]/40',
    dotColor: 'bg-[#68745A]',
    headline: 'Order Confirmed by Mill',
    summaryText: 'Loom capacity and yarn lots allocated. Pre-production proofs verified.',
  },
  Processing: {
    label: 'Processing',
    currentStep: 3,
    badgeBg: 'bg-[#68745A]/15',
    badgeText: 'text-[#3D4935]',
    badgeBorder: 'border-[#68745A]',
    dotColor: 'bg-[#3D4935]',
    headline: 'In Active Production',
    summaryText: 'Bags are currently in cutting, printing, and load-test serging in West Bengal.',
  },
  Shipped: {
    label: 'Shipped',
    currentStep: 4,
    badgeBg: 'bg-[#E8DDCA]',
    badgeText: 'text-[#252720]',
    badgeBorder: 'border-[#A88B66]',
    dotColor: 'bg-[#252720]',
    headline: 'Dispatched via Insured Cargo',
    summaryText: 'En route with pan-India commercial freight carrier. Air waybill generated.',
  },
  Delivered: {
    label: 'Delivered',
    currentStep: 5,
    badgeBg: 'bg-[#3D4935]',
    badgeText: 'text-[#F7F5EF]',
    badgeBorder: 'border-[#3D4935]',
    dotColor: 'bg-[#68745A]',
    headline: 'Delivered to Receiving Dock',
    summaryText: 'Consignment successfully accepted and signed for at destination facility.',
  },
  Cancelled: {
    label: 'Cancelled',
    currentStep: 0,
    badgeBg: 'bg-stone-200',
    badgeText: 'text-stone-700',
    badgeBorder: 'border-stone-400',
    dotColor: 'bg-stone-500',
    headline: 'Order Cancelled',
    summaryText: 'Production run voided before yarn allocation. Zero liability charged.',
  },
};

/**
 * Returns UI configuration for any status string safely
 */
export function getOrderStatusInfo(status) {
  if (!status) return STATUS_CONFIG.Pending;
  // Match key by substring if custom demo string is passed
  for (const key of Object.keys(STATUS_CONFIG)) {
    if (status.toLowerCase().includes(key.toLowerCase())) {
      return STATUS_CONFIG[key];
    }
  }
  return STATUS_CONFIG.Pending;
}

/**
 * Seed demonstration orders covering all 6 statuses
 */
export const DEMO_ORDERS = [
  {
    orderNumber: 'JTN-DEMO-2026-8842',
    createdAt: '2026-03-01T09:30:00Z',
    status: 'Processing',
    paymentMethod: 'UPI (B2B Corporate VPA)',
    paymentReference: 'UPI/B2B/20260301/984401',
    paymentStatus: 'Verified & Credited',
    trackingNumber: 'PENDING-DISPATCH',
    carrier: 'TCI Express B2B Freight',
    estimatedDelivery: '2026-03-09',
    shippingAddress: {
      label: 'Central Distribution Warehouse',
      recipientName: 'Vikramaditya Roy (Procurement Lead)',
      mobile: '9830048821',
      houseBuilding: 'Godown 14B, Logistics Bay',
      street: 'Strand Bank Road, Posta Market',
      city: 'Kolkata',
      state: 'West Bengal',
      pinCode: '700001',
    },
    items: [
      {
        id: 'the-grand-market-tote',
        name: 'The Grand Market Shopping Tote',
        category: 'Shopping Bags',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
        color: 'Natural Jute',
        quantity: 200,
        unitPrice: 128,
        lineTotal: 25600,
        specs: '38 x 42 x 15 cm • 350 GSM Golden Jute • Cane Ring Padded Handles',
      },
      {
        id: 'the-heritage-everyday-tote',
        name: 'The Heritage Everyday Jute Tote',
        category: 'Tote Bags',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
        color: 'Forest Olive Accent',
        quantity: 100,
        unitPrice: 160,
        lineTotal: 16000,
        specs: '34 x 36 x 10 cm • 320 GSM Unbleached Jute • Internal Key Pocket',
      },
    ],
    summary: {
      subtotal: 41600,
      wholesaleDiscount: 4992,
      gstAmount: 1830,
      shippingFee: 0,
      totalAmount: 38438,
    },
    notes: 'Silk-screen client logo on front panel in Olive Pantone 575C.',
  },
  {
    orderNumber: 'JTN-DEMO-2026-7219',
    createdAt: '2026-02-24T14:15:00Z',
    status: 'Shipped',
    paymentMethod: 'Cash on Delivery (Advance Freight)',
    paymentReference: 'COD-APPROVED-REGIONAL',
    paymentStatus: 'COD Pre-Verified',
    trackingNumber: 'BD-EXP-7749219',
    carrier: 'BlueDart Apex Freight Cargo',
    estimatedDelivery: '2026-03-07',
    shippingAddress: {
      label: 'Corporate Flagship Office',
      recipientName: 'Bengal Organic Grocers Admin',
      mobile: '9830048821',
      houseBuilding: 'Tower C, 5th Floor, Executive Suite 502',
      street: 'Senapati Bapat Marg, Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400013',
    },
    items: [
      {
        id: 'botanical-print-shopping-shopper',
        name: 'Artisan Botanical Print Shopping Bag',
        category: 'Shopping Bags',
        image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=800',
        color: 'Natural Jute',
        quantity: 150,
        unitPrice: 155,
        lineTotal: 23250,
        specs: '36 x 40 x 12 cm • AZO-free botanical leaf motif screen print',
      },
    ],
    summary: {
      subtotal: 23250,
      wholesaleDiscount: 2790,
      gstAmount: 1023,
      shippingFee: 0,
      totalAmount: 21483,
    },
    notes: 'Fragile handling marked on master export carton crates.',
  },
  {
    orderNumber: 'JTN-DEMO-2026-6104',
    createdAt: '2026-02-10T11:00:00Z',
    status: 'Delivered',
    paymentMethod: 'UPI (B2B Corporate VPA)',
    paymentReference: 'UPI/B2B/20260210/118832',
    paymentStatus: 'Fully Reconciled',
    trackingNumber: 'DELHIVERY-B2B-893021',
    carrier: 'Delhivery Surface Enterprise',
    estimatedDelivery: '2026-02-16',
    deliveredDate: '2026-02-16T15:45:00Z',
    shippingAddress: {
      label: 'South India Retail Fulfillment Hub',
      recipientName: 'Receiving Dock Manager',
      mobile: '9830048821',
      houseBuilding: 'Warehouse Plot 88, Peenya 2nd Stage',
      street: 'Tumkur Road Industrial Area',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560058',
    },
    items: [
      {
        id: 'executive-conference-jute-folio',
        name: 'The Executive Conference Jute Folio',
        category: 'Corporate Bags',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
        color: 'Deep Olive',
        quantity: 300,
        unitPrice: 245,
        lineTotal: 73500,
        specs: '32 x 40 x 6 cm • 420 GSM Export Grade • Debossed Vegan Leather Patch',
      },
      {
        id: 'the-artisan-gift-pouch-set',
        name: 'Artisan Jute Gift Pouch Bundle',
        category: 'Gift Bags',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
        color: 'Natural Ivory',
        quantity: 200,
        unitPrice: 75,
        lineTotal: 15000,
        specs: '18 x 24 cm • Organic Cotton Drawstring • Satin Ribbon Accent',
      },
    ],
    summary: {
      subtotal: 88500,
      wholesaleDiscount: 10620,
      gstAmount: 3894,
      shippingFee: 0,
      totalAmount: 81774,
    },
    notes: 'Annual corporate leadership summit dispatch. Complete with GST tax invoice #INV-2026-018.',
  },
  {
    orderNumber: 'JTN-DEMO-2026-5590',
    createdAt: '2026-02-04T16:20:00Z',
    status: 'Confirmed',
    paymentMethod: 'UPI (B2B Corporate VPA)',
    paymentReference: 'UPI/B2B/20260204/552194',
    paymentStatus: 'Verified',
    trackingNumber: 'SLOT-BENGAL-044',
    carrier: 'Dedicated Cooperative Mill Logistics',
    estimatedDelivery: '2026-03-12',
    shippingAddress: {
      label: 'Central Distribution Warehouse',
      recipientName: 'Vikramaditya Roy',
      mobile: '9830048821',
      houseBuilding: 'Godown 14B, Logistics Bay',
      street: 'Strand Bank Road, Posta Market',
      city: 'Kolkata',
      state: 'West Bengal',
      pinCode: '700001',
    },
    items: [
      {
        id: 'luxury-wine-hamper-carrier',
        name: 'The Luxury Wine & Bottle Carrier',
        category: 'Gift Bags',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
        color: 'Natural Jute',
        quantity: 120,
        unitPrice: 285,
        lineTotal: 34200,
        specs: '22 x 36 x 12 cm • Double Bottle Padded Dividers • Brass Hardware',
      },
    ],
    summary: {
      subtotal: 34200,
      wholesaleDiscount: 4104,
      gstAmount: 1505,
      shippingFee: 0,
      totalAmount: 31601,
    },
    notes: 'Gold foil brand monogram stamping requested on bottle flap.',
  },
  {
    orderNumber: 'JTN-DEMO-2026-4412',
    createdAt: '2026-03-03T18:45:00Z',
    status: 'Pending',
    paymentMethod: 'Cash on Delivery (Advance Freight)',
    paymentReference: 'COD-VERIFY-PENDING',
    paymentStatus: 'Awaiting Telephonic Mill Call',
    trackingNumber: 'AWAITING-CONFIRMATION',
    carrier: 'TBD upon Loom Allocation',
    estimatedDelivery: '2026-03-15',
    shippingAddress: {
      label: 'Corporate Flagship Office',
      recipientName: 'Bengal Organic Grocers Admin',
      mobile: '9830048821',
      houseBuilding: 'Tower C, 5th Floor, Executive Suite 502',
      street: 'Senapati Bapat Marg, Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400013',
    },
    items: [
      {
        id: 'screen-printed-exhibition-tote',
        name: 'Screen-Printed Exhibition Tote',
        category: 'Custom Printed Bags',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
        color: 'Warm Ivory Gusset',
        quantity: 100,
        unitPrice: 165,
        lineTotal: 16500,
        specs: '38 x 42 x 10 cm • Dual-Tone Contrast Weave • Long 65cm Shoulder Straps',
      },
    ],
    summary: {
      subtotal: 16500,
      wholesaleDiscount: 1980,
      gstAmount: 726,
      shippingFee: 0,
      totalAmount: 15246,
    },
    notes: 'Exhibition promo giveaway. Vector artwork uploaded for proofing.',
  },
  {
    orderNumber: 'JTN-DEMO-2026-3198',
    createdAt: '2026-01-15T10:10:00Z',
    status: 'Cancelled',
    paymentMethod: 'UPI (B2B Corporate VPA)',
    paymentReference: 'UPI/REFUND/20260116/00192',
    paymentStatus: 'Reversed & Refunded in Full',
    trackingNumber: 'CANCELLED-VOID',
    carrier: 'N/A',
    estimatedDelivery: 'N/A',
    cancellationReason: 'Client exhibition venue shifted to Q3; requested production hold and zero penalty refund before loom warping.',
    shippingAddress: {
      label: 'Central Distribution Warehouse',
      recipientName: 'Vikramaditya Roy',
      mobile: '9830048821',
      houseBuilding: 'Godown 14B, Logistics Bay',
      street: 'Strand Bank Road, Posta Market',
      city: 'Kolkata',
      state: 'West Bengal',
      pinCode: '700001',
    },
    items: [
      {
        id: 'the-grand-market-tote',
        name: 'The Grand Market Shopping Tote',
        category: 'Shopping Bags',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
        color: 'Natural Jute',
        quantity: 75,
        unitPrice: 145,
        lineTotal: 10875,
        specs: 'Standard Plain Jute',
      },
    ],
    summary: {
      subtotal: 10875,
      wholesaleDiscount: 0,
      gstAmount: 544,
      shippingFee: 0,
      totalAmount: 11419,
    },
    notes: 'Cancelled before yarn cutting. Full refund initiated.',
  },
];

/**
 * Default demonstration saved delivery addresses for Indian commercial hubs
 */
export const DEMO_SAVED_ADDRESSES = [
  {
    id: 'addr_kolkata_central',
    label: 'Central Distribution Warehouse',
    recipientName: 'Vikramaditya Roy (Procurement Lead)',
    businessName: 'Bengal Organic Grocers Private Limited',
    mobile: '9830048821',
    houseBuilding: 'Godown 14B, Logistics Bay',
    street: 'Strand Bank Road, Posta Market',
    city: 'Kolkata',
    state: 'West Bengal',
    pinCode: '700001',
    isDefault: true,
  },
  {
    id: 'addr_mumbai_hq',
    label: 'Corporate Headquarters',
    recipientName: 'Supply Chain Operations',
    businessName: 'Bengal Organic Grocers Private Limited',
    mobile: '9830048821',
    houseBuilding: 'Tower C, 5th Floor, Executive Suite 502',
    street: 'Senapati Bapat Marg, Lower Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400013',
    isDefault: false,
  },
  {
    id: 'addr_blr_retail',
    label: 'South India Retail Fulfillment Hub',
    recipientName: 'Receiving Dock Manager',
    businessName: 'Bengal Organic Grocers Private Limited',
    mobile: '9830048821',
    houseBuilding: 'Warehouse Plot 88, Peenya 2nd Stage',
    street: 'Tumkur Road Industrial Area',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560058',
    isDefault: false,
  },
];

/**
 * Default user settings
 */
export const DEFAULT_USER_SETTINGS = {
  notificationPreferences: {
    whatsappDispatch: true,
    emailInvoices: true,
    productionMilestones: true,
    annualLookbook: false,
  },
  taxPreferences: {
    gstin: '19AAACB1234F1Z8',
    requiresInputTaxCredit: true,
    preferredCurrency: 'INR',
  },
};

/**
 * Computes high-level commercial dashboard summary statistics
 */
export function calculateDashboardStats(orders = []) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  
  let totalUnits = 0;
  let totalSpent = 0;
  let activeCount = 0;
  let deliveredCount = 0;
  let pendingCount = 0;
  let cancelledCount = 0;

  for (const order of safeOrders) {
    const status = order.status || 'Pending';
    const isCancelled = status.toLowerCase().includes('cancelled');
    
    // Sum item quantities
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        totalUnits += Number(item.quantity || 0);
      }
    }

    if (!isCancelled) {
      totalSpent += Number(order.summary?.totalAmount || order.totalAmount || 0);
    }

    if (status.toLowerCase().includes('delivered')) {
      deliveredCount++;
    } else if (isCancelled) {
      cancelledCount++;
    } else if (status.toLowerCase().includes('pending')) {
      pendingCount++;
      activeCount++;
    } else {
      // Confirmed, Processing, Shipped
      activeCount++;
    }
  }

  return {
    totalOrders: safeOrders.length,
    activeCount,
    deliveredCount,
    pendingCount,
    cancelledCount,
    totalUnits,
    totalSpent,
  };
}

/**
 * Filter and search order lists
 */
export function filterOrders(orders = [], { status = 'all', searchQuery = '', sortBy = 'newest' } = {}) {
  let result = [...orders];

  if (status && status !== 'all') {
    result = result.filter((order) => {
      const orderStatus = order.status || '';
      return orderStatus.toLowerCase().includes(status.toLowerCase());
    });
  }

  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    result = result.filter((order) => {
      const numMatch = (order.orderNumber || '').toLowerCase().includes(query);
      const itemsMatch = Array.isArray(order.items) && order.items.some(
        (item) => (item.name || '').toLowerCase().includes(query) || (item.category || '').toLowerCase().includes(query)
      );
      const carrierMatch = (order.carrier || '').toLowerCase().includes(query) || (order.trackingNumber || '').toLowerCase().includes(query);
      return numMatch || itemsMatch || carrierMatch;
    });
  }

  if (sortBy === 'newest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === 'highest-total') {
    result.sort((a, b) => {
      const totalA = a.summary?.totalAmount || a.totalAmount || 0;
      const totalB = b.summary?.totalAmount || b.totalAmount || 0;
      return totalB - totalA;
    });
  }

  return result;
}

/**
 * Lookup order by ID/Number
 */
export function getOrderById(orders = [], orderId = '') {
  if (!orderId) return null;
  const normalizedId = String(orderId).trim().toLowerCase();
  return orders.find(
    (order) => (order.orderNumber || '').toLowerCase() === normalizedId || (order.id || '').toLowerCase() === normalizedId
  ) || null;
}

/**
 * Validates saved address form
 */
export function validateAddress(fields = {}) {
  const errors = {};

  if (!fields.label || !fields.label.trim()) {
    errors.label = 'Address label is required (e.g. Central Warehouse, Flagship Store).';
  }

  if (!fields.recipientName || !fields.recipientName.trim()) {
    errors.recipientName = 'Recipient / Receiving lead name is required.';
  }

  const rawPhone = (fields.mobile || '').replace(/\s+/g, '');
  if (!rawPhone) {
    errors.mobile = 'Mobile number is required for freight delivery notifications.';
  } else if (!INDIAN_MOBILE_REGEX.test(rawPhone)) {
    errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
  }

  if (!fields.houseBuilding || !fields.houseBuilding.trim()) {
    errors.houseBuilding = 'Building / Floor / Warehouse Bay number is required.';
  }

  if (!fields.street || !fields.street.trim()) {
    errors.street = 'Street or industrial area name is required.';
  }

  if (!fields.city || !fields.city.trim()) {
    errors.city = 'City is required.';
  }

  if (!fields.state || !fields.state.trim()) {
    errors.state = 'State is required.';
  }

  const cleanPin = (fields.pinCode || '').trim();
  if (!cleanPin) {
    errors.pinCode = '6-digit Indian PIN code is required.';
  } else if (!INDIAN_PIN_REGEX.test(cleanPin)) {
    errors.pinCode = 'Enter a valid 6-digit Indian postal PIN code.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates password modification
 */
export function validatePasswordChange({ currentPassword = '', newPassword = '', confirmPassword = '' } = {}) {
  const errors = {};

  if (!currentPassword) {
    errors.currentPassword = 'Enter your current password.';
  }

  if (!newPassword) {
    errors.newPassword = 'Enter a new password.';
  } else if (newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters long.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm your new password.';
  } else if (newPassword && newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates profile information edits
 */
export function validateProfileUpdate(fields = {}) {
  const errors = {};

  if (!fields.fullName || fields.fullName.trim().length < 2) {
    errors.fullName = 'Full legal or corporate officer name is required.';
  }

  if (!fields.email || !EMAIL_REGEX.test(fields.email.trim())) {
    errors.email = 'Valid corporate email address is required.';
  }

  const rawPhone = (fields.mobile || '').replace(/\s+/g, '');
  if (!rawPhone || !INDIAN_MOBILE_REGEX.test(rawPhone)) {
    errors.mobile = 'Valid 10-digit Indian mobile number is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Prepares dashboard account data for future API / Supabase integration
 */
export function serializeDashboardDataForApi(user, orders, addresses, settings) {
  return {
    exportVersion: 'juton_b2b_v1',
    exportedAt: new Date().toISOString(),
    account: {
      userId: user?.id,
      fullName: user?.fullName,
      businessName: user?.businessName,
      email: user?.email,
      mobile: user?.mobile,
      tier: 'Verified Direct-Mill Wholesale Partner',
    },
    orders: orders.map((o) => ({
      orderNumber: o.orderNumber,
      createdAt: o.createdAt,
      status: o.status,
      paymentMethod: o.paymentMethod,
      totalAmount: o.summary?.totalAmount || o.totalAmount,
      totalUnits: Array.isArray(o.items) ? o.items.reduce((acc, i) => acc + (i.quantity || 0), 0) : 0,
      destinationCity: o.shippingAddress?.city,
    })),
    savedAddresses: addresses,
    settings,
  };
}
