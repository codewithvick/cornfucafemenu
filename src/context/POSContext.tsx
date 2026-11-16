'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CategoryId, CartItem, Order, PaymentMethod, PrinterConfig } from '../types';
import { INITIAL_MENU_ITEMS } from '../data/mockMenu';
import {
  subscribeToProductsCloud,
  saveProductToCloud,
  deleteProductFromCloud,
} from '../services/menuService';

interface POSContextType {
  menuItems: MenuItem[];
  categoriesCount: Record<CategoryId, number>;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredItems: MenuItem[];
  
  // Cart / Active Ticket
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  // Orders
  orders: Order[];
  recentOrder: Order | null;
  completeOrder: (paymentMethod: PaymentMethod, customerName?: string, tableNumber?: string) => Order | null;
  setRecentOrder: (order: Order | null) => void;
  
  // Admin Features (CRUD)
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'sold'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  updateStock: (id: string, amount: number) => void;
  resetDefaultMenu: () => void;

  // Modals & Panels
  selectedItemForDetail: MenuItem | null;
  setSelectedItemForDetail: (item: MenuItem | null) => void;
  isTicketOpen: boolean;
  setIsTicketOpen: (val: boolean) => void;
  isPrinterModalOpen: boolean;
  setIsPrinterModalOpen: (val: boolean) => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (val: boolean) => void;
  isItemModalOpen: boolean;
  setIsItemModalOpen: (val: boolean) => void;
  editingItem: MenuItem | null;
  setEditingItem: (item: MenuItem | null) => void;
  isOrderHistoryOpen: boolean;
  setIsOrderHistoryOpen: (val: boolean) => void;
  isInventoryModalOpen: boolean;
  setIsInventoryModalOpen: (val: boolean) => void;

  // Printer
  printerConfig: PrinterConfig;
  updatePrinterConfig: (cfg: Partial<PrinterConfig>) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'cornfu_cafe_menu_v13';
const LOCAL_STORAGE_ORDERS_KEY = 'cornfu_cafe_orders_v1';
const LOCAL_STORAGE_PRINTER_KEY = 'cornfu_cafe_printer_v1';

const DEFAULT_PRINTER: PrinterConfig = {
  printerName: 'POS-80 Thermal Bar Receipt Printer',
  type: 'bluetooth',
  paperWidth: '80mm',
  autoPrintReceipt: true,
  autoPrintKOT: false,
  status: 'connected',
};

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig>(DEFAULT_PRINTER);

  // Modals UI state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MenuItem | null>(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isPrinterModalOpen, setIsPrinterModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  // Load from LocalStorage on mount + real-time Cloud Sync
  useEffect(() => {
    // 1. Immediate local load so the user sees the menu in 0ms without waiting for network
    try {
      for (let i = 1; i <= 12; i++) {
        localStorage.removeItem(`cornfu_cafe_menu_v${i}`);
      }

      const savedMenu = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedMenu) {
        const parsed: MenuItem[] = JSON.parse(savedMenu);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const reconciled = INITIAL_MENU_ITEMS.map((initialItem) => {
            const savedItem = parsed.find((p) => p.id === initialItem.id);
            if (savedItem) {
              return {
                ...initialItem,
                ...savedItem,
                image: savedItem.image || initialItem.image,
              };
            }
            return initialItem;
          });
          const customItems = parsed.filter(
            (p) => !INITIAL_MENU_ITEMS.some((i) => i.id === p.id)
          );
          setMenuItems([...reconciled, ...customItems]);
        }
      } else {
        setMenuItems(INITIAL_MENU_ITEMS);
      }

      const savedOrders = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      const savedPrinter = localStorage.getItem(LOCAL_STORAGE_PRINTER_KEY);
      if (savedPrinter) {
        setPrinterConfig(JSON.parse(savedPrinter));
      }
    } catch (e) {
      console.error('Failed to load POS local data', e);
    }

    // 2. Real-time Firebase Firestore Subscription
    // Any price change, new dish, or updated photo made on any phone or PC
    // instantly syncs across all customer and staff devices in real-time!
    const unsubscribe = subscribeToProductsCloud((cloudItems) => {
      if (Array.isArray(cloudItems) && cloudItems.length > 0) {
        setMenuItems(cloudItems);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudItems));
        } catch (e) {
          // ignore
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Save changes to LocalStorage
  const saveMenuItems = (newItems: MenuItem[]) => {
    // Immediate local update for instantaneous UI feedback
    setMenuItems(newItems);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error('Error saving menu to local storage', e);
    }
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.error('Error saving orders to local storage', e);
    }
  };

  const updatePrinterConfig = (cfg: Partial<PrinterConfig>) => {
    setPrinterConfig((prev) => {
      const updated = { ...prev, ...cfg };
      localStorage.setItem(LOCAL_STORAGE_PRINTER_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Dynamic Category counts
  const categoriesCount = React.useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: menuItems.length,
      food: menuItems.filter((i) => i.category === 'food').length,
      espresso: menuItems.filter((i) => i.category === 'espresso').length,
      boba: menuItems.filter((i) => i.category === 'boba').length,
      matcha: menuItems.filter((i) => i.category === 'matcha').length,
      smoothies: menuItems.filter((i) => i.category === 'smoothies').length,
      juice: menuItems.filter((i) => i.category === 'juice').length,
    };
    return counts;
  }, [menuItems]);

  // Filtered menu items
  const filteredItems = React.useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Cart Management
  const addToCart = (item: MenuItem) => {
    if (item.available <= 0) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        if (existing.quantity >= item.available) return prev; // Cannot exceed available stock
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.item.id === itemId) {
            const newQty = i.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > i.item.available) return i; // Cap at available stock
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // Complete Order & Deduct Inventory in Real-Time
  const completeOrder = (paymentMethod: PaymentMethod, customerName = 'Walk-in Guest', tableNumber = 'Takeout'): Order | null => {
    if (cart.length === 0) return null;

    const orderNumber = `#CF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      items: [...cart],
      subtotal: cartTotal,
      tax: Math.round(cartTotal * 0.075), // 7.5% VAT (Nigeria standard)
      total: Math.round(cartTotal * 1.075),
      paymentMethod,
      status: 'completed',
      customerName,
      tableNumber,
      createdAt: new Date().toISOString(),
    };

    // Live inventory deduction: deduct "available" & increment "sold"
    const updatedMenu = menuItems.map((menuItem) => {
      const inCart = cart.find((c) => c.item.id === menuItem.id);
      if (inCart) {
        const newAvailable = Math.max(0, menuItem.available - inCart.quantity);
        const newSold = menuItem.sold + inCart.quantity;
        return {
          ...menuItem,
          available: newAvailable,
          sold: newSold,
          isAvailable: newAvailable > 0,
        };
      }
      return menuItem;
    });

    saveMenuItems(updatedMenu);
    saveOrders([newOrder, ...orders]);
    setRecentOrder(newOrder);
    clearCart();

    return newOrder;
  };

  // Admin CRUD operations
  const addMenuItem = (itemData: Omit<MenuItem, 'id' | 'sold'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `prod-${itemData.category}-${Date.now().toString().slice(-4)}`,
      sold: 0,
      createdAt: new Date().toISOString(),
    };
    saveMenuItems([newItem, ...menuItems]);
    saveProductToCloud(newItem).catch((err) =>
      console.error('Failed to sync added item to Cloud:', err)
    );
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    const newItems = menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    saveMenuItems(newItems);
    saveProductToCloud(updatedItem).catch((err) =>
      console.error('Failed to sync updated item to Cloud:', err)
    );
  };

  const deleteMenuItem = (id: string) => {
    const newItems = menuItems.filter((item) => item.id !== id);
    saveMenuItems(newItems);
    deleteProductFromCloud(id).catch((err) =>
      console.error('Failed to delete item from Cloud:', err)
    );
  };

  const toggleItemAvailability = (id: string) => {
    let targetItem: MenuItem | undefined;
    const newItems = menuItems.map((item) => {
      if (item.id === id) {
        targetItem = { ...item, isAvailable: !item.isAvailable };
        return targetItem;
      }
      return item;
    });
    saveMenuItems(newItems);
    if (targetItem) {
      saveProductToCloud(targetItem).catch((err) =>
        console.error('Failed to sync availability to Cloud:', err)
      );
    }
  };

  const updateStock = (id: string, amount: number) => {
    let targetItem: MenuItem | undefined;
    const newItems = menuItems.map((item) => {
      if (item.id === id) {
        const newAvailable = Math.max(0, item.available + amount);
        targetItem = { ...item, available: newAvailable, isAvailable: newAvailable > 0 };
        return targetItem;
      }
      return item;
    });
    saveMenuItems(newItems);
    if (targetItem) {
      saveProductToCloud(targetItem).catch((err) =>
        console.error('Failed to sync stock to Cloud:', err)
      );
    }
  };

  const resetDefaultMenu = () => {
    saveMenuItems(INITIAL_MENU_ITEMS);
  };

  return (
    <POSContext.Provider
      value={{
        menuItems,
        categoriesCount,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filteredItems,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        recentOrder,
        completeOrder,
        setRecentOrder,
        isAdmin,
        setIsAdmin,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        updateStock,
        resetDefaultMenu,
        selectedItemForDetail,
        setSelectedItemForDetail,
        isTicketOpen,
        setIsTicketOpen,
        isPrinterModalOpen,
        setIsPrinterModalOpen,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        isItemModalOpen,
        setIsItemModalOpen,
        editingItem,
        setEditingItem,
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        isInventoryModalOpen,
        setIsInventoryModalOpen,
        printerConfig,
        updatePrinterConfig,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};

