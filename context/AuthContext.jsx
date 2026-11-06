'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_ORDERS_KEY,
  DEMO_USER,
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  generateDemoOrderNumber,
} from '@/lib/auth';
import {
  DEMO_ORDERS,
  DEMO_SAVED_ADDRESSES,
  DEFAULT_USER_SETTINGS,
  LOCAL_STORAGE_SAVED_ADDRESSES_KEY,
  LOCAL_STORAGE_SETTINGS_KEY,
  getOrderById,
} from '@/lib/dashboard';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [demoOrders, setDemoOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [userSettings, setUserSettings] = useState(DEFAULT_USER_SETTINGS);

  // 1. Initial hydration from LocalStorage (SSR Safe)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = window.localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Hydrate demo orders ensuring all 6 statuses are present
          const storedOrders = window.localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
          let ordersToSet = DEMO_ORDERS;
          if (storedOrders) {
            try {
              const parsed = JSON.parse(storedOrders);
              if (Array.isArray(parsed) && parsed.length >= 6) {
                ordersToSet = parsed;
              } else if (Array.isArray(parsed) && parsed.length > 0) {
                // Merge demonstration orders that aren't already present
                const existingNumbers = new Set(parsed.map((o) => o.orderNumber));
                const missingDemo = DEMO_ORDERS.filter((o) => !existingNumbers.has(o.orderNumber));
                ordersToSet = [...parsed, ...missingDemo];
                window.localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(ordersToSet));
              }
            } catch (err) {
              console.warn('Failed to parse stored orders:', err);
            }
          } else {
            window.localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(DEMO_ORDERS));
          }
          setDemoOrders(ordersToSet);

          // Hydrate saved addresses
          const storedAddresses = window.localStorage.getItem(LOCAL_STORAGE_SAVED_ADDRESSES_KEY);
          if (storedAddresses) {
            try {
              const parsedAddr = JSON.parse(storedAddresses);
              if (Array.isArray(parsedAddr) && parsedAddr.length > 0) {
                setSavedAddresses(parsedAddr);
              } else {
                setSavedAddresses(DEMO_SAVED_ADDRESSES);
                window.localStorage.setItem(LOCAL_STORAGE_SAVED_ADDRESSES_KEY, JSON.stringify(DEMO_SAVED_ADDRESSES));
              }
            } catch {
              setSavedAddresses(DEMO_SAVED_ADDRESSES);
            }
          } else {
            setSavedAddresses(DEMO_SAVED_ADDRESSES);
            window.localStorage.setItem(LOCAL_STORAGE_SAVED_ADDRESSES_KEY, JSON.stringify(DEMO_SAVED_ADDRESSES));
          }

          // Hydrate settings
          const storedSettings = window.localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
          if (storedSettings) {
            try {
              setUserSettings(JSON.parse(storedSettings));
            } catch {
              setUserSettings(DEFAULT_USER_SETTINGS);
            }
          } else {
            window.localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_USER_SETTINGS));
          }
        }
      } catch (err) {
        console.warn('Failed to restore auth/orders from localStorage:', err);
      } finally {
        setIsAuthLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. Persist user updates to LocalStorage
  const saveUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (typeof window !== 'undefined') {
      if (nextUser) {
        window.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(nextUser));
      } else {
        window.localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
      }
    }
  }, []);

  // Register function
  const register = useCallback((fields) => {
    const validation = validateRegistration(fields);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      fullName: fields.fullName.trim(),
      businessName: (fields.businessName || '').trim() || 'Independent Wholesale Buyer',
      email: fields.email.trim().toLowerCase(),
      mobile: fields.mobile.trim(),
      createdAt: new Date().toISOString(),
      isDemoAccount: true,
      address: {
        houseBuilding: '',
        street: '',
        city: '',
        state: 'West Bengal',
        pinCode: '',
      },
    };

    saveUser(newUser);
    return { success: true, user: newUser };
  }, [saveUser]);

  // Login function
  const login = useCallback((fields) => {
    const validation = validateLogin(fields);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const loggedUser = {
      id: `usr_${Date.now()}`,
      fullName: fields.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Corporate Buyer',
      businessName: 'Registered Trade Partner',
      email: fields.email.trim().toLowerCase(),
      mobile: '9830048821',
      createdAt: new Date().toISOString(),
      isDemoAccount: true,
      address: {
        houseBuilding: 'Unit 12, Commercial Hub',
        street: 'Strand Road',
        city: 'Kolkata',
        state: 'West Bengal',
        pinCode: '700001',
      },
    };

    saveUser(loggedUser);
    return { success: true, user: loggedUser };
  }, [saveUser]);

  // Instant 1-click Demo Account Login for evaluators
  const loginWithDemo = useCallback(() => {
    saveUser(DEMO_USER);
    return { success: true, user: DEMO_USER };
  }, [saveUser]);

  // Logout function
  const logout = useCallback(() => {
    saveUser(null);
  }, [saveUser]);

  // Profile update
  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Save new demo order from checkout
  const addDemoOrder = useCallback((orderData) => {
    const orderNumber = generateDemoOrderNumber();
    const newOrder = {
      ...orderData,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };

    setDemoOrders((prev) => {
      const next = [newOrder, ...prev];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(next));
      }
      return next;
    });

    return newOrder;
  }, []);

  // Get order by ID/number
  const getOrder = useCallback((orderId) => {
    return getOrderById(demoOrders, orderId);
  }, [demoOrders]);

  // Address Management
  const addSavedAddress = useCallback((addressData) => {
    const newAddress = {
      ...addressData,
      id: `addr_${Date.now()}`,
    };

    setSavedAddresses((prev) => {
      let next = [...prev];
      if (newAddress.isDefault) {
        next = next.map((a) => ({ ...a, isDefault: false }));
      }
      next = [newAddress, ...next];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_SAVED_ADDRESSES_KEY, JSON.stringify(next));
      }
      return next;
    });

    return newAddress;
  }, []);

  const updateSavedAddress = useCallback((id, updates) => {
    setSavedAddresses((prev) => {
      let next = prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updates };
        }
        if (updates.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_SAVED_ADDRESSES_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const deleteSavedAddress = useCallback((id) => {
    setSavedAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_SAVED_ADDRESSES_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const setDefaultSavedAddress = useCallback((id) => {
    setSavedAddresses((prev) => {
      const next = prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_SAVED_ADDRESSES_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // Settings update
  const updateUserSettings = useCallback((updates) => {
    setUserSettings((prev) => {
      const next = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // Reset demo state (for evaluators)
  const resetDemoData = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(DEMO_ORDERS));
      window.localStorage.setItem(LOCAL_STORAGE_SAVED_ADDRESSES_KEY, JSON.stringify(DEMO_SAVED_ADDRESSES));
      window.localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_USER_SETTINGS));
      setDemoOrders(DEMO_ORDERS);
      setSavedAddresses(DEMO_SAVED_ADDRESSES);
      setUserSettings(DEFAULT_USER_SETTINGS);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAuthLoaded,
        register,
        login,
        loginWithDemo,
        logout,
        updateProfile,
        demoOrders,
        addDemoOrder,
        getOrder,
        savedAddresses,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultSavedAddress,
        userSettings,
        updateUserSettings,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
