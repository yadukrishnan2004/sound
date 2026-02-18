import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { getUserProfile, logout } from '../auth/authSlice';

const initialState = {
    cartItems: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Add to Cart
export const addToCart = createAsyncThunk(
    'cart/add',
    async (product, thunkAPI) => {
        try {
            const response = await api.post(ENDPOINTS.CART.ADD, {
                "product_id": product.id,
                "quantity": 1
            });
            // Refresh user profile to update cart state
            thunkAPI.dispatch(getUserProfile());

            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update Quantity
export const updateCartQuantity = createAsyncThunk(
    'cart/update',
    async ({ cartId, productId, quantity }, thunkAPI) => {
        try {


            await api.put(ENDPOINTS.CART.UPDATE(productId), { quantity });
            thunkAPI.dispatch(getUserProfile());
            return { cartId, quantity };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

// Remove from Cart
export const removeFromCart = createAsyncThunk(
    'cart/remove',
    async (cartId, thunkAPI) => {
        try {
            await api.delete(ENDPOINTS.CART.REMOVE(cartId));
            thunkAPI.dispatch(getUserProfile());
            return cartId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

// Clear Cart
export const clearCart = createAsyncThunk(
    'cart/clear',
    async (_, thunkAPI) => {
        try {
            await api.delete(ENDPOINTS.CART.CLEAR);
            thunkAPI.dispatch(getUserProfile());
            return;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCart: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Sync with Auth Profile
            .addCase(getUserProfile.fulfilled, (state, action) => {
                // Adjust based on your backend response structure
                // Assuming action.payload.data.cart contains the array
                const user = action.payload.data || action.payload;
                state.cartItems = user.cart || [];
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                const { cartId, quantity } = action.payload;

                const item = state.cartItems.find(
                    (i) => i.CartID === cartId
                );

                if (item) {
                    item.Quantity = quantity;
                }
            })

            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Add other cases as needed
            .addCase(logout.fulfilled, (state) => {
                state.cartItems = [];
                state.isError = false;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = '';
            });
    },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
