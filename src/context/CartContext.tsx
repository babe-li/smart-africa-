import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, PaymentTransaction } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalTzs: number;
  shippingFeeTzs: number;
  totalTzs: number;
  escrowEnabled: boolean;
  setEscrowEnabled: (val: boolean) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('smarttrade_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  const [escrowEnabled, setEscrowEnabled] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('smarttrade_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    // Demo initial order
    return [
      {
        id: 'TZ-ORD-90821',
        items: [
          {
            product: {
              id: 'tz-spices-1',
              name: 'Zanzibar Organic Spice Box Set (Cloves, Cardamom, Nutmeg and Cinnamon)',
              category: 'Agriculture and Coffee',
              priceTzs: 45000,
              rating: 4.9,
              reviewCount: 310,
              image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
              seller: { name: 'Zanzibar Spice Masters', location: 'Zanzibar', verified: true, trustScore: 99 },
              inStock: true,
              smartDelivery: true,
              description: 'Zanzibar organic spices',
              features: [],
              securityVerified: true
            },
            quantity: 2,
            addedTimestamp: Date.now() - 86400000
          }
        ],
        totalTzs: 90000,
        paymentTransaction: {
          id: 'TXN-MPESA-8849',
          orderId: 'TZ-ORD-90821',
          amountTzs: 90000,
          method: 'mpesa',
          phoneOrCard: '0754 *** 190',
          status: 'completed',
          cryptoSignature: 'SHA256-ESCROW-CONFIRMED-TZ88102',
          timestamp: 'Yesterday, 18:20 EAT',
          gatewayResponse: { receipt: 'QWL90821TZ', gateway: 'Vodacom M-Pesa Tanzania' }
        },
        status: 'Delivered',
        shippingAddress: 'Masaki, Peninsula Road, Dar es Salaam',
        orderDate: '2026-07-04',
        escrowProtectionCode: 'ESCROW-TZ-SAFE-90821'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('smarttrade_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('smarttrade_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, addedTimestamp: Date.now() }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalTzs = cart.reduce((sum, item) => sum + (item.product.priceTzs * item.quantity), 0);
  const shippingFeeTzs = subtotalTzs > 500000 ? 0 : (subtotalTzs === 0 ? 0 : 15000); // Free shipping over 500k TSh
  const totalTzs = subtotalTzs + shippingFeeTzs;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotalTzs,
      shippingFeeTzs,
      totalTzs,
      escrowEnabled,
      setEscrowEnabled,
      orders,
      addOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
