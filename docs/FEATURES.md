<div align="center">

# ✨ Features & Use Cases

**A comprehensive list of implemented features and common user workflows for the Starbucks Egypt application.**

</div>

---

## 1. Implemented Features

### 🔐 Authentication & Security
- [x] JWT Authentication with Refresh Tokens
- [x] Google OAuth 2.0 Integration (Frontend, Dashboard, Backend)
- [x] Role-Based Access Control (RBAC)
- [x] Secure Password Hashing (BCrypt)
- [x] Account Lockout & Rate Limiting
- [x] Multi-layer OAuth credential management

### ☕ Menu & Ordering
- [x] Multi-level Menu Categories
- [x] Item Customization (Milk, Syrups, Add-ons)
- [x] Real-time Price Calculation
- [x] Nutritional Information Display
- [x] "Quick Reorder" for favorited items
- [x] Centralized image management via Backend API

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

### 🎛️ Admin Dashboard
- [x] Angular-based dashboard application
- [x] Google OAuth authentication
- [x] Inventory Management (Ready for images)
- [x] Order Tracking & Status Updates
- [x] User Management & Role Assignment
- [x] System Analytics & Reports
- [x] Environment configuration for OAuth and images

### 🖼️ Image Management
- [x] Centralized image storage in Backend
- [x] Static file serving via `/api/v1/images/` endpoints
- [x] Multi-category organization (menu, home, sustainability, etc.)
- [x] SEO-optimized image meta tags (OG, Twitter)
- [x] WebP format support for performance
- [x] Dashboard image configuration ready for implementation

---

## 2. Common Use Cases

### 🚶 User: "Find a morning coffee"
1. User lands on **HomePage** and clicks **Find a Store**.
2. System requests location; displays the nearest Starbucks stores with images served from `/api/v1/images/`.
3. User filters for **Drive-thru**.
4. User selects their preferred store and browses the local menu with product images.

### 🔐 User: "Sign in with Google"
1. User clicks **Sign in with Google** button on Frontend or Dashboard
2. System redirects to Google OAuth login
3. After authentication, user receives JWT token
4. User is logged into the application

### 🔁 User: "Reorder my favorite drink"
1. User logs in (with email or Google OAuth).
2. Navigates to **Recent Orders** or **Favorites**.
3. Clicks **Order Again** on a previous Latte with extra caramel.
4. Checkout flow starts immediately with pre-filled preferences.

### 👨‍💼 Manager: "Update Menu Item"
1. Manager logs into the **Admin Dashboard** using Google OAuth.
2. Navigates to **Menu Management**.
3. Edits the "Cold Brew" price and updates availability status.
4. Uploads/updates product image (feature ready for implementation).
5. Changes are reflected instantly across the Frontend.

### 📊 Admin: "Access Dashboard Reports"
1. Admin logs into the **Dashboard** at `http://localhost:4200`
2. Authenticates with Google OAuth
3. Navigates to inventory, orders, and user management sections
4. Views analytics and system reports

---

<div align="center">
  <b>Related Documents</b> <br/>
  <a href="ARCHITECTURE.md">ARCHITECTURE.md</a> &nbsp;&bull;&nbsp; <a href="DEVELOPMENT.md">DEVELOPMENT.md</a>
</div>
