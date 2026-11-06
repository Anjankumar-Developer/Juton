'use client';

import { createContext, useContext, useState } from 'react';
import { CartProvider, useCart } from './CartContext';
import { AuthProvider } from './AuthContext';

const BrandContext = createContext(null);

function BrandInnerProvider({ children, activeCurrency, setActiveCurrency }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [selectedProductForSample, setSelectedProductForSample] = useState(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [productDetailModalOpen, setProductDetailModalOpen] = useState(false);
  const [activeProductDetail, setActiveProductDetail] = useState(null);
  const [notification, setNotification] = useState(null);

  const cart = useCart();

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((current) => (current === msg ? null : current));
    }, 3500);
  };

  const openSampleRequest = (product = null) => {
    setSelectedProductForSample(product);
    setSampleModalOpen(true);
  };

  const closeSampleRequest = () => {
    setSampleModalOpen(false);
  };

  const openProductDetail = (product) => {
    setActiveProductDetail(product);
    setProductDetailModalOpen(true);
  };

  const closeProductDetail = () => {
    setProductDetailModalOpen(false);
  };

  return (
    <BrandContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        sampleModalOpen,
        openSampleRequest,
        closeSampleRequest,
        selectedProductForSample,
        accountModalOpen,
        setAccountModalOpen,
        productDetailModalOpen,
        openProductDetail,
        closeProductDetail,
        activeProductDetail,
        activeCurrency,
        setActiveCurrency,
        notification,
        showNotification,

        // Proxied Cart states & methods (centralized in CartContext)
        cartOpen: cart.isCartOpen,
        setCartOpen: cart.setIsCartOpen,
        quoteItems: cart.items,
        cartItems: cart.items,
        addToQuote: cart.addToCart,
        addToCart: cart.addToCart,
        updateQuoteQuantity: cart.updateQuantity,
        updateQuantity: cart.updateQuantity,
        removeFromQuote: cart.removeFromCart,
        removeFromCart: cart.removeFromCart,
        clearQuote: cart.clearCart,
        clearCart: cart.clearCart,
        totals: cart.totals,
        totalQuoteUnits: cart.totals.totalUnits,
        totalQuotePrice: cart.totals.netTotal,
        checkoutModalOpen: cart.checkoutModalOpen,
        setCheckoutModalOpen: cart.setCheckoutModalOpen,
        cartFeedback: cart.cartFeedback,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function BrandProvider({ children }) {
  const [activeCurrency, setActiveCurrency] = useState('INR');

  return (
    <AuthProvider>
      <CartProvider activeCurrency={activeCurrency}>
        <BrandInnerProvider activeCurrency={activeCurrency} setActiveCurrency={setActiveCurrency}>
          {children}
        </BrandInnerProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
