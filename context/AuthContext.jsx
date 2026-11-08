'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_ORDERS_KEY,
  DEMO_USER,
  validateRegistration,
  validateLogin,
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
import {
  buildOrderIdempotencyKey,
  getExistingOrderByIdempotencyKey,
  reserveOrderStock,
} from '@/lib/cart';

const AuthContext = createContext(null);

function normalizeSupabaseUser(authUser, profileRow = null) {
  const fullName = profileRow?.full_name || authUser?.user_metadata?.full_name || authUser?.user_metadata?.fullName || authUser?.email?.split('@')[0] || 'Wholesale Buyer';
  const businessName = profileRow?.business_name || authUser?.user_metadata?.business_name || authUser?.user_metadata?.businessName || 'Independent Wholesale Buyer';
  const mobile = profileRow?.mobile || authUser?.user_metadata?.mobile || '';

  return {
    id: authUser?.id || profileRow?.id || `usr_${Date.now()}`,
    fullName,
    businessName,
    email: profileRow?.email || authUser?.email || '',
    mobile,
    role: profileRow?.role || authUser?.user_metadata?.role || 'customer',
    isDemoAccount: false,
    createdAt: profileRow?.created_at || authUser?.created_at || new Date().toISOString(),
    address: {
      houseBuilding: '',
      street: '',
      city: '',
      state: 'West Bengal',
      pinCode: '',
    },
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [demoOrders, setDemoOrders] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [userSettings, setUserSettings] = useState(DEFAULT_USER_SETTINGS);
  const supabase = supabaseBrowser;

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (typeof window !== 'undefined') {
      if (nextUser) {
        window.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(nextUser));
      } else {
        window.localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
      }
    }
  }, []);

  const hydrateSupabaseUser = useCallback(async (authUser) => {
    if (!supabase || !authUser) {
      return null;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      const nextUser = normalizeSupabaseUser(authUser, error ? null : profile);
      persistUser(nextUser);
      return nextUser;
    } catch (error) {
      console.warn('Supabase profile hydration failed:', error);
      const fallbackUser = normalizeSupabaseUser(authUser);
      persistUser(fallbackUser);
      return fallbackUser;
    }
  }, [persistUser, supabase]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = window.localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          const storedOrders = window.localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
          let ordersToSet = DEMO_ORDERS;
          if (storedOrders) {
            try {
              const parsed = JSON.parse(storedOrders);
              if (Array.isArray(parsed) && parsed.length >= 6) {
                ordersToSet = parsed;
              } else if (Array.isArray(parsed) && parsed.length > 0) {
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

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let isMounted = true;

    const initializeSupabaseSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      if (session?.user) {
        await hydrateSupabaseUser(session.user);
      }
    };

    initializeSupabaseSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) {
        return;
      }

      if (session?.user) {
        await hydrateSupabaseUser(session.user);
      } else {
        persistUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, [hydrateSupabaseUser, persistUser, supabase]);

  const register = useCallback(async (fields) => {
    const validation = validateRegistration(fields);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    if (!supabase) {
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
      persistUser(newUser);
      return { success: true, user: newUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email: fields.email.trim().toLowerCase(),
      password: fields.password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
        data: {
          full_name: fields.fullName.trim(),
          business_name: (fields.businessName || '').trim() || 'Independent Wholesale Buyer',
          mobile: fields.mobile.trim(),
          role: 'customer',
        },
      },
    });

    if (error) {
      return { success: false, errors: { form: error.message } };
    }

    if (data?.user && data.session) {
      const nextUser = await hydrateSupabaseUser(data.user);
      return { success: true, user: nextUser, requiresEmailVerification: false };
    }

    return {
      success: true,
      user: null,
      requiresEmailVerification: true,
      message: 'Registration successful. Please check your inbox to verify your email before logging in.',
    };
  }, [hydrateSupabaseUser, persistUser, supabase]);

  const login = useCallback(async (fields) => {
    const validation = validateLogin(fields);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    if (!supabase) {
      const loggedUser = {
        id: `usr_${Date.now()}`,
        fullName: fields.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Corporate Buyer',
        businessName: 'Registered Trade Partner',
        email: fields.email.trim().toLowerCase(),
        mobile: '9830048821',
        createdAt: new Date().toISOString(),
        isDemoAccount: true,
        role: 'customer',
        address: {
          houseBuilding: 'Unit 12, Commercial Hub',
          street: 'Strand Road',
          city: 'Kolkata',
          state: 'West Bengal',
          pinCode: '700001',
        },
      };
      persistUser(loggedUser);
      return { success: true, user: loggedUser };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: fields.email.trim().toLowerCase(),
      password: fields.password,
    });

    if (error) {
      const errorMessage = error.message.includes('Invalid login') || error.message.includes('Invalid email or password')
        ? 'Invalid email or password.'
        : error.message;
      return { success: false, errors: { form: errorMessage } };
    }

    if (!data?.user) {
      return { success: false, errors: { form: 'Unable to sign in right now. Please try again.' } };
    }

    const nextUser = await hydrateSupabaseUser(data.user);
    return { success: true, user: nextUser };
  }, [hydrateSupabaseUser, persistUser, supabase]);

  const loginWithDemo = useCallback(() => {
    persistUser(DEMO_USER);
    return { success: true, user: DEMO_USER };
  }, [persistUser]);

  const logout = useCallback(async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Supabase sign-out failed:', error);
      }
    }
    persistUser(null);
  }, [persistUser, supabase]);

  const updateProfile = useCallback(async (updates) => {
    const nextUser = { ...user, ...updates };

    if (supabase && user?.id) {
      const profileRow = {
        id: user.id,
        full_name: updates.fullName || user.fullName,
        business_name: updates.businessName || user.businessName,
        mobile: updates.mobile || user.mobile,
        email: updates.email || user.email,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(profileRow, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase profile update failed:', error);
      }

      const { data: authData, error: authError } = await supabase.auth.updateUser({
        email: updates.email || user.email,
        data: {
          full_name: updates.fullName || user.fullName,
          business_name: updates.businessName || user.businessName,
          mobile: updates.mobile || user.mobile,
        },
      });

      if (authError) {
        console.warn('Supabase auth metadata update failed:', authError);
      }

      if (authData?.user) {
        const hydrated = await hydrateSupabaseUser(authData.user);
        if (hydrated) {
          return hydrated;
        }
      }
    }

    persistUser(nextUser);
    return nextUser;
  }, [hydrateSupabaseUser, persistUser, supabase, user]);

  const addDemoOrder = useCallback((orderData) => {
    const normalizedOrder = {
      ...orderData,
      customer: orderData.customer || {
        fullName: '',
        email: '',
        mobile: '',
      },
      items: Array.isArray(orderData.items) ? orderData.items : [],
    };

    const idempotencyKey = buildOrderIdempotencyKey(normalizedOrder);
    const existingOrder = getExistingOrderByIdempotencyKey(idempotencyKey, demoOrders);
    if (existingOrder) {
      return existingOrder;
    }

    const reservation = reserveOrderStock(normalizedOrder.items, idempotencyKey);
    if (!reservation.ok) {
      return {
        success: false,
        error: reservation.error,
        idempotencyKey,
      };
    }

    const orderNumber = generateDemoOrderNumber();
    const newOrder = {
      ...normalizedOrder,
      idempotencyKey,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };

    setDemoOrders((prev) => {
      const alreadyExists = prev.some((order) => order.idempotencyKey === idempotencyKey || order.orderNumber === orderNumber);
      if (alreadyExists) {
        return prev;
      }

      const next = [newOrder, ...prev];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(next));
      }
      return next;
    });

    return newOrder;
  }, [demoOrders]);

  const getOrder = useCallback((orderId) => {
    return getOrderById(demoOrders, orderId);
  }, [demoOrders]);

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

  const updateUserSettings = useCallback((updates) => {
    setUserSettings((prev) => {
      const next = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

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
