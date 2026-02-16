import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
};

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        createOrder: (state, action) => {
            // Placeholder
        }
    },
});

export const { createOrder } = orderSlice.actions;
export default orderSlice.reducer;
