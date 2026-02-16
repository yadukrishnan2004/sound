import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

const initialState = {
    products: [],
    product: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Fetch all products
export const getProducts = createAsyncThunk(
    'products/getAll',
    async (_, thunkAPI) => {
        try {
            const response = await api.get(ENDPOINTS.PRODUCTS.LIST);
            // The API returns { status, data: [...] } or just [...]? 
            // Based on ApiContext: res?.data?.data || []
            return response.data?.data || response.data;
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

// Fetch single product
export const getProduct = createAsyncThunk(
    'products/getOne',
    async (id, thunkAPI) => {
        try {
            const response = await api.get(ENDPOINTS.PRODUCTS.DETAIL(id));
            return response.data?.data || response.data;
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

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
        resetProduct: (state) => {
            state.product = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.product = action.payload;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, resetProduct } = productSlice.actions;
export default productSlice.reducer;
