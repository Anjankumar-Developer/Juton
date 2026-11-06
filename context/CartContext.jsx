'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  LOCAL_STORAGE_CART_KEY,
  validateQuantity,
  calculateCartTotals,
  serializeCartForSupabase,
} from '@/lib/cart';
import { getProductById } from '@/data/products';

const CartContext = createContext(null);

export function CartProvider({ children, activeCurrency = 'INR' }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(null);

  const showCartFeedback = useCallback((message, type = 'success') => {
    setCartFeedback({ message, type });
    setTimeout(() => {
      setCartFeedback((current) => (current?.message === message ? null : current));
    }, 4000);
  }, []);

  // 1. Initial Cart Hydration & Restoration from LocalStorage (SSR Safe)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem(LOCAL_STORAGE_CART_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Re-validate and sync each item against current catalog (handles price changes & stock sync)
              const synced = parsed.map((item) => {
                const liveProduct = getProductById(item.id || item.productId);
                if (!liveProduct) return item;

                // Enforce latest stock & availability rules
                const stock = typeof liveProduct.stockQuantity === 'number' ? liveProduct.stockQuantity : (liveProduct.inStock ? 5000 : 0);
                const clampedQty = Math.min(item.quantity, stock > 0 ? stock : item.quantity);

                return {
                  ...liveProduct,
                  itemKey: item.itemKey || `${liveProduct.id}-${item.selectedColor || 'Natural'}`,
                  selectedColor: item.selectedColor || (liveProduct.colors?.[0]?.name) || 'Natural Jute',
                  quantity: clampedQty,
                  stockQuantity: stock,
                  inStock: liveProduct.inStock && stock > 0,
                };
              });
              setItems(synced);
            } else {
              setItems([]);
            }
          } else {
            // Default initial seed item for instant B2B wholesale evaluation
            const defaultProduct = getProductById('the-grand-market-tote');
            if (defaultProduct) {
              setItems([
                {
                  ...defaultProduct,
                  itemKey: 'the-grand-market-tote-Natural Jute',
                  selectedColor: 'Natural Jute',
                  quantity: 100,
                }
              ]);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to restore wholesale cart from localStorage:', err);
        setItems([]);
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. Persist to LocalStorage on every cart change
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to persist wholesale cart to localStorage:', err);
    }
  }, [items, isLoaded]);

  // 3. Centralized Financial Calculations (Central source of truth)
  const totals = useMemo(() => {
    return calculateCartTotals(items, activeCurrency);
  }, [items, activeCurrency]);

  // 4. Operations
  const addToCart = useCallback(
    (product, requestedQuantity = null, selectedColor = null) => {
      if (!product) return { success: false, message: 'Invalid product' };

      const color = selectedColor || (product.colors && product.colors[0]?.name) || 'Natural Golden Jute';
      const itemKey = `${product.id}-${color}`;
      const defaultQty = requestedQuantity || product.moq || 100;

      // Check current quantity in cart for this SKU
      const existing = items.find((i) => i.itemKey === itemKey);
      const targetQty = (existing ? existing.quantity : 0) + defaultQty;

      // Validate bounds against MOQ and Stock
      const validation = validateQuantity(product, targetQty);

      if (validation.isUnavailable) {
        showCartFeedback(validation.error || 'This silhouette is currently unavailable.', 'error');
        return { success: false, message: validation.error };
      }

      let finalQty = targetQty;
      let wasClamped = false;

      if (!validation.valid) {
        finalQty = validation.sanitizedQuantity;
        wasClamped = true;
        showCartFeedback(validation.error, 'warning');
      } else {
        showCartFeedback(`Added ${defaultQty} pieces (${color}) to wholesale cart.`, 'success');
      }

      setItems((prev) => {
        const idx = prev.findIndex((i) => i.itemKey === itemKey);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            ...product,
            quantity: finalQty,
          };
          return next;
        }
        return [
          ...prev,
          {
            ...product,
            itemKey,
            selectedColor: color,
            quantity: finalQty,
            addedAt: new Date().toISOString(),
          },
        ];
      });

      return {
        success: true,
        message: wasClamped ? validation.error : 'Added successfully',
        clamped: wasClamped,
      };
    },
    [items, showCartFeedback]
  );

  const removeFromCart = useCallback(
    (itemKey) => {
      setItems((prev) => prev.filter((i) => i.itemKey !== itemKey));
      showCartFeedback('Item removed from wholesale cart.', 'success');
    },
    [showCartFeedback]
  );

  const updateQuantity = useCallback(
    (itemKey, newQuantity) => {
      setItems((prev) => {
        const item = prev.find((i) => i.itemKey === itemKey);
        if (!item) return prev;

        // If newQuantity is 0 or negative, remove the item
        if (newQuantity <= 0) {
          return prev.filter((i) => i.itemKey !== itemKey);
        }

        const validation = validateQuantity(item, newQuantity);
        const finalQty = validation.sanitizedQuantity;

        if (!validation.valid) {
          showCartFeedback(validation.error, 'warning');
        }

        return prev.map((i) => (i.itemKey === itemKey ? { ...i, quantity: finalQty } : i));
      });
    },
    [showCartFeedback]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    }
    showCartFeedback('Wholesale cart has been emptied.', 'success');
  }, [showCartFeedback]);

  // Export helper for future Supabase DB integration
  const getSupabasePayload = useCallback(
    (customerDetails = {}) => {
      return serializeCartForSupabase(items, totals, customerDetails);
    },
    [items, totals]
  );

  return (
    <CartContext.Provider
      value={{
        items: totals.itemsWithFinancials || items,
        rawItems: items,
        isLoaded,
        totals,
        isCartOpen,
        setIsCartOpen,
        checkoutModalOpen,
        setCheckoutModalOpen,
        cartFeedback,
        showCartFeedback,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getSupabasePayload,
        activeCurrency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
