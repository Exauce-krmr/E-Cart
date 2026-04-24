import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);
export const API_URL = "http://localhost:3000/api";

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ecart_user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('ecart_token') || null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('ecart_cart')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('ecart_wishlist')) || []);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('ecart_orders')) || []);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('ecart_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('ecart_token', token);
    else localStorage.removeItem('ecart_token');
  }, [token]);

  useEffect(() => {
    localStorage.setItem('ecart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ecart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ecart_orders', JSON.stringify(orders));
  }, [orders]);

  // Fetch true orders and wishlist on mount or user login
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !token) {
        setOrders([]);
        setWishlist([]);
        return;
      }

      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch Orders
        const resOrders = await fetch(`${API_URL}/orders/${user.id}`, { headers });
        if (resOrders.status === 401) return logout(); // Token expired

        if (resOrders.ok) {
          const data = await resOrders.json();
          const formattedOrders = data.map(o => ({
            id: '#' + (o._id || o.id || '').toString().slice(-6),
            date: o.orderDate,
            items: o.items,
            total: o.totalAmount,
            shipping: o.shipping || { name: o.customerName || user.name, address: 'Stored externally', city: 'Stored externally', pin: '000000', phone: '0000000000' },
            payment: o.payment || 'UPI',
            status: o.status
          }));
          setOrders(formattedOrders.reverse());
        }

        // Fetch Wishlist
        const resWishlist = await fetch(`${API_URL}/wishlist/${user.id}`, { headers });
        if (resWishlist.ok) {
          const wishlistData = await resWishlist.json();
          setWishlist(wishlistData);
        }
      } catch (e) {
        console.error("Failed to fetch user data hook:", e);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]); // logout omitted to prevent cycles

  const showToast = useCallback((msg, icon = '✅') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const login = useCallback((userData, jwtToken) => {
    setUser(userData);
    if (jwtToken) setToken(jwtToken);
    showToast(`Welcome, ${userData.name}! 👋`);
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    showToast('Logged out successfully.', '👋');
  }, [showToast]);

  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    showToast(`${product.name.slice(0, 28)}… added to cart 🛒`);
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    showToast('Item removed from cart.', '🗑️');
  }, [showToast]);

  const updateCartQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback(async (items, total, shipping, payment) => {
    if (!user || !token) {
      showToast('You must be logged in to place an order.', '⚠️');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          items: items,
          totalAmount: total,
        }),
      });

      if (response.status === 401) { logout(); return; }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const orderData = await response.json();

      const newOrder = {
        id: '#' + (orderData.order._id || orderData.order.id || '').toString().slice(-6),
        date: orderData.order.orderDate,
        items,
        total,
        shipping,
        payment,
        status: orderData.order.status
      };

      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      showToast('Order placed successfully! 🎉', '🎊');

    } catch (error) {
      console.error("Order error:", error);
      showToast(error.message || 'Failed to connect to backend', '❌');
    }
  }, [clearCart, showToast, user, token, logout]);

  const toggleWishlist = useCallback(async (product) => {
    if (!user || !token) {
      showToast('You must be logged in to use the wishlist.', '⚠️');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/wishlist/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          product: product
        })
      });

      if (response.status === 401) { logout(); return; }

      if (response.ok) {
        setWishlist(prev => {
          const exists = prev.find(i => i.id === product.id);
          if (exists) {
            showToast('Removed from wishlist', '💔');
            return prev.filter(i => i.id !== product.id);
          }
          showToast('Added to wishlist ❤️');
          return [...prev, product];
        });
      }
    } catch (e) {
      console.error("Failed to toggle wishlist", e);
      showToast('Error modifying wishlist', '❌');
    }
  }, [showToast, user, token, logout]);

  const isWishlisted = useCallback((id) => wishlist.some(i => i.id === id), [wishlist]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AppContext.Provider value={{
      user, token, login, logout,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      wishlist, toggleWishlist, isWishlisted,
      orders, placeOrder,
      cartCount, cartTotal,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);