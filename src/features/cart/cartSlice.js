import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { getUserProfile } from '../auth/authSlice';

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
            // Logic from legacy: pass product data? 
            // Usually only ID and quantity needed. 
            // Assuming backend implementation:
            // axios.post(`${BASE_URL}/cart/add`, product)
            const response = await api.post(ENDPOINTS.CART.ADD, product);

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
    async ({ cartId, quantity }, thunkAPI) => {
        try {
            await api.put(ENDPOINTS.CART.UPDATE(cartId), { quantity });
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
            });
        // Add other cases as needed
    },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
