export type CategoryId =
  | 'all'
  | 'food'
  | 'espresso'
  | 'boba'
  | 'matcha'
  | 'smoothies'
  | 'juice';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'transfer' | 'card';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number; // default price in Naira (₦)
  price700ml?: number; // for Boba tea 700ml option
  available: number; // in-stock count
  sold: number; // count sold
  image: string;
  description: string;
  ingredients?: string; // specific recipe/ingredients from the menu
  tags?: string[];
  isAvailable?: boolean;
  createdAt?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedSize?: '500ml' | '700ml';
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  customerName?: string;
  tableNumber?: string;
  createdAt: string;
}

export interface PrinterConfig {
  printerName: string;
  type: 'bluetooth' | 'usb' | 'network';
  paperWidth: '58mm' | '80mm';
  autoPrintReceipt: boolean;
  autoPrintKOT: boolean;
  status: 'connected' | 'disconnected' | 'connecting';
  ipAddress?: string;
}
