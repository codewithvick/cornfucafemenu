# Cornfu Cafe - Digital POS & Menu Management System

A high-performance digital POS (Point-of-Sale) and menu management web application built for **Cornfu Cafe**, inspired by the modern cafe ordering interface with real-time inventory deduction and a password-protected Admin Dashboard.

## 🌟 Key Features

### 1. POS & Client-Facing Digital Menu
- **Left Icon Navigation Sidebar**:
  - Cornfu Cafe cartoon ninja mascot & bold branding.
  - Active orange pill indicator on the edge for the Menu view.
  - Quick action icons: Active Ticket/Orders, Order History, Inventory, Bluetooth status dot, Refresh, Admin Lock, and Manager Avatar.
- **Top Bar Header**:
  - Instant live search across dishes, ingredients, and badges.
  - Real-time date and ticking clock (`Mon, 02/11/26 | 1:38 PM`).
  - **Printer Setup** button for configuring thermal receipt and kitchen order printers (ESC/POS 80mm & 58mm).
  - Quick toggle between **Customer View** and **Admin Mode**.
- **Category Carousel Cards**:
  - Horizontal smooth scrolling cards with live item counts:
    - *All Menu (40 items)*
    - *Food Menu*
    - *Boba Tea (10 items)*
    - *Matcha Drinks (4 items)*
    - *Smoothies (9 items)*
- **Menu Item Cards**:
  - High-res rounded photography previews.
  - Exact stats: `[X] Available • [Y] Sold` (e.g. `50 Available • 34 Sold`).
  - Bold price in Nigerian Naira (₦).
  - Soft orange `+` button to add items to the active order ticket.
- **Interactive POS Active Ticket & Checkout**:
  - Side drawer showing active items, quantity controls (`+` / `-`), subtotal, 7.5% Nigerian VAT, and final total.
  - Payment method selection: **POS Transfer**, **POS Card**, or **Cash**.
  - Real-time inventory deduction upon checkout (automatically deducts from "Available" and increments "Sold").
  - Printable thermal receipt simulation.

### 2. Password-Protected Admin Dashboard (CRUD)
- **Security / PIN Protection**:
  - Protects administrative actions behind a PIN keypad modal.
  - **Default Demo PIN**: `1234` (or password `cornfu`).
- **Add New Item Modal**:
  - Form fields: Name, Category, Price (₦), Stock count, Description, Dietary badges, and Image URL with one-click presets.
- **Inline & Modal Edit**:
  - Adjust pricing, rename dishes, or update stock on the fly.
  - Quick `Active` / `Hidden` toggle to take items off the public menu.
  - Quick `+5` or batch `+20` stock adjustment buttons.
- **Delete / Archive**:
  - Remove items from the menu with confirmation.
- **Live Inventory Manager**:
  - Dedicated audit modal tracking total stock, sold metrics, low stock warnings, and out-of-stock items.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State & Persistence**: React Context API with LocalStorage sync

---

## 🚀 Getting Started

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

