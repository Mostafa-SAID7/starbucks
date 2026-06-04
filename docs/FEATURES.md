<div align="center">

# ✨ Features & Use Cases

**A comprehensive list of implemented features and common user workflows for the Starbucks Egypt application.**

</div>

---

## 1. Implemented Features

### 🔐 Authentication & Security
- [x] JWT Authentication with Refresh Tokens
- [x] Role-Based Access Control (RBAC)
- [x] Secure Password Hashing (BCrypt)
- [x] Account Lockout & Rate Limiting

### ☕ Menu & Ordering
- [x] Multi-level Menu Categories
- [x] Item Customization (Milk, Syrups, Add-ons)
- [x] Real-time Price Calculation
- [x] Nutritional Information Display
- [x] "Quick Reorder" for favorited items

### 📍 Store Locator
- [x] Interactive Map (Google Maps/Leaflet)
- [x] Geo-location (Find stores near me)
- [x] Store Filters (Drive-thru, Open Now, Mobile Order)
- [x] Detailed Store Hours & Services

### 🌍 Internationalization
- [x] Full Arabic/English Support
- [x] RTL/LTR Layout Direction
- [x] Localized Date/Currency Formatting
- [x] Bilingual Search Engine

### 🛠️ Admin Dashboard
- [x] Inventory Management
- [x] Order Tracking & Status Updates
- [x] User Management & Role Assignment
- [x] System Analytics & Reports

---

## 2. Common Use Cases

### 🚶 User: "Find a morning coffee"
1. User lands on **HomePage** and clicks **Find a Store**.
2. System requests location; displays the nearest Starbucks stores.
3. User filters for **Drive-thru**.
4. User selects their preferred store and browses the local menu.

### 🔁 User: "Reorder my favorite drink"
1. User logs in.
2. Navigates to **Recent Orders** or **Favorites**.
3. Clicks **Order Again** on a previous Latte with extra caramel.
4. Checkout flow starts immediately with pre-filled preferences.

### 👨‍💼 Manager: "Update Menu Item"
1. Manager logs into the **Admin Dashboard**.
2. Navigates to **Menu Management**.
3. Edits the "Cold Brew" price and updates availability status.
4. Changes are reflected instantly across the Frontend.

---

<div align="center">
  <b>Related Documents</b> <br/>
  <a href="ARCHITECTURE.md">ARCHITECTURE.md</a> &nbsp;&bull;&nbsp; <a href="DEVELOPMENT.md">DEVELOPMENT.md</a>
</div>
