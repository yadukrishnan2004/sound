# 🔧 Complete API Endpoint Reference & Migration Guide

## ✅ Correct Backend API Structure

### Authentication (`/api/v1/users`)
```javascript
POST   /signup              - Register & send OTP
POST   /verify              - Verify OTP & auto-login
POST   /login               - Login existing user
POST   /forgot-password     - Request password reset OTP  
POST   /reset-password      - Reset password with OTP
POST   /logout              - Logout (clears cookie)
PUT    /profile             - Update profile
GET    /profile             - Get current user profile
```

### Products (`/api/v1/users`)
```javascript
GET    /allproducts         - Get all products
GET    /search?q=phone      - Search products
GET    /filter?category=... - Filter products
```

### User Orders (`/api/v1/users`)
```javascript
GET    /:id/orders          - Get user's orders
GET    /:id/orders/details  - Get order details  
PUT    /:id/cancel          - Cancel order
```

### Cart (`/api/v1/cart`)
```javascript
GET    /                    - Get cart
POST   /add                 - Add to cart {product_id, quantity}
PUT    /:id                 - Update quantity {quantity}
DELETE /:id                 - Remove item
DELETE /clear               - Clear cart
```

### Wishlist (`/api/v1/wishlist`)
```javascript
GET    /                    - Get wishlist
POST   /:id                 - Add product
DELETE /:id                 - Remove product
DELETE /                    - Clear wishlist
```

### Orders (`/api/v1/orders`)
```javascript
POST   /                    - Place order {address_id, payment_method}
POST   /buy-now             - Buy now {product_id, quantity, address_id}
GET    /                    - Get order history
```

### Address (`/api/v1/addresses`)
```javascript
GET    /                    - Get addresses
POST   /                    - Add address {street, city, zip}
```

### Admin (`/api/v1/admin`)
```javascript
// Users
GET    /users/search?q=...  - Search users
PATCH  /users/:id           - Update user
POST   /users/:id/block     - Block/unblock user
DELETE /users/:id           - Delete user

// Products
POST   /products            - Add product
GET    /products            - Get all products
GET    /products/:id        - Get product
DELETE /products/:id        - Delete product
PATCH  /products/:id/status - Update status
GET    /products/filter     - Filter products

// Orders
GET    /orders              - Get all orders
PUT    /orders/:id          - Update order status
```

## 📋 Files That Need Updating

### ✅ Already Fixed:
- `src/Components/context/Cartcontext.jsx` - Cart operations
- `src/Components/context/wishlist.jsx` - Wishlist operations
- `src/Components/pages/Cartdisply.jsx` - Cart display
- `src/Components/pages/Displaywish.jsx` - Wishlist display
- `src/Components/Parts/ProductCard.jsx` - Product cards
- `src/Components/Parts/Navbar.jsx` - Navigation

### ❌ Need Fixing:
1. `src/Components/Parts/checkout.jsx` - Uses old order API
2. `src/Components/pages/Myorders.jsx` - Needs correct endpoint
3. `src/AuthContext/authcontext.jsx` - Add logout endpoint
4. `src/admin/*` - All admin files
5. Address management - Need to create

## 🚨 Critical Changes Needed

### 1. Checkout Process
**OLD**: Manually updating user with PATCH
**NEW**: Use `POST /api/v1/orders` with address_id

### 2. Order Fetching
**OLD**: `GET /users/:id/orders`
**NEW**: `GET /api/v1/orders` (gets current user's orders)

### 3. Admin Operations
**OLD**: Direct user manipulation
**NEW**: Use `/api/v1/admin/*` endpoints

### 4. Address Management
**MISSING**: Need to implement address CRUD

## 📊 Response Format
All endpoints return:
```javascript
{
  status: "success" | "error",
  message: "...",
  data: {...}
}
```

## 🔐 Authentication
- All protected routes require `withCredentials: true`
- JWT stored in HTTP-only cookie
- User profile fetched via `GET /users/profile`
