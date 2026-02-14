# Frontend-Backend Integration Guide

## Backend API Endpoints Required

Based on your React frontend, your Go backend needs to provide these endpoints:

### Authentication Endpoints
- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/verify` - OTP verification
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/profile` - Get current user profile (requires auth cookie)

### Product Endpoints
- `GET /api/v1/users/allproducts` - Get all products
  - Expected response: `{ status: "success", data: [...products] }`

### Cart Endpoints
- `POST /api/v1/users/cart` - Add product to cart
  - Body: `{ product_id: number, quantity: number }`
- `PUT /api/v1/users/cart/:productId` - Update cart item quantity
  - Body: `{ quantity: number }`
- `DELETE /api/v1/users/cart/:productId` - Remove item from cart
- `DELETE /api/v1/users/cart` - Clear entire cart

### Wishlist Endpoints
- `POST /api/v1/users/wishlist` - Add product to wishlist
  - Body: `{ product_id: number }`
- `DELETE /api/v1/users/wishlist/:productId` - Remove from wishlist

## Frontend Configuration

### Environment Variables (.env)
```
VITE_BASE_URL=http://localhost:8080/api/v1
```

### Important Notes

1. **Cookie-based Authentication**: All protected endpoints require `withCredentials: true` in axios calls
2. **Response Format**: Backend should return:
   ```json
   {
     "status": "success",
     "message": "...",
     "data": { ... }
   }
   ```
3. **User Object**: The user profile should include:
   - `id`
   - `name`
   - `email`
   - `role` (for admin routes)
   - `cart` (optional, if preloaded)
   - `wishlist` (optional, if preloaded)

## Files Updated

✅ Created `.env` file with backend URL
✅ Updated `Cartcontext.jsx` to use Go backend
✅ Updated `wishlist.jsx` to use Go backend
✅ Both contexts now use `AuthContext` for user data
✅ All API calls use `BASE_URL` configuration
✅ All API calls include `withCredentials: true` for cookie authentication

## Files Still Using json-server (localhost:5001)

These admin files still reference localhost:5001 and need to be updated:
- `contact.jsx`
- `Myorders.jsx`
- `manageproduct.jsx`
- `manageorders.jsx`
- `edituser.jsx`
- `mangeuser.jsx`

Would you like me to update these as well?
