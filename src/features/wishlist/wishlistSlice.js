import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { getUserProfile } from '../auth/authSlice';

const initialState = {
    wishlistItems: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const addToWishlist = createAsyncThunk(
    'wishlist/add',
    async (product, thunkAPI) => {
        try {
            const response = await api.post(ENDPOINTS.WISHLIST.ADD, product);
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

export const removeFromWishlist = createAsyncThunk(
    'wishlist/remove',
    async (product, thunkAPI) => {
        try {
            // Legacy code: await removeWish(product) -> axios.delete(..., { data: product }) maybe?
            // Or assumes product has an ID and DELETE /wishlist/remove/:id?
            // The endpoint is defined as /wishlist/remove/${id}.
            // We need to know what ID to pass. Product ID?
            const id = product.id || product.ID || product.product_id;
            await api.delete(ENDPOINTS.WISHLIST.REMOVE(id));
            thunkAPI.dispatch(getUserProfile());
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        resetWishlist: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.fulfilled, (state, action) => {
                const user = action.payload.data || action.payload;
                state.wishlistItems = user.wishlist || [];
            })
            .addCase(addToWishlist.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToWishlist.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
