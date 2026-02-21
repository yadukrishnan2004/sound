// src/features/admin/adminSlice.js
// ============================================================
// PROFESSIONAL ADMIN SLICE
// - All admin API calls go through Redux thunks (no raw api.* in components)
// - Uses ENDPOINTS constants throughout (no hardcoded URLs)
// - Proper loading / error / success state per operation
// ============================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

// ─── Helper to extract a clean error message ─────────────────────────────────
const extractError = (error) =>
    error?.response?.data?.message || error.message || error.toString();

// ─── THUNKS ──────────────────────────────────────────────────────────────────

/** Fetch all users */
export const fetchAdminUsers = createAsyncThunk(
    'admin/fetchUsers',
    async (_, thunkAPI) => {
        try {
            const res = await api.get(ENDPOINTS.ADMIN.USERS);
            return res.data?.data || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(extractError(error));
        }
    }
);

/** Fetch single user by id */
export const fetchAdminUser = createAsyncThunk(
    'admin/fetchUser',
    async (id, thunkAPI) => {
        try {
            // Reuse the USERS endpoint + id path (same as DELETE_USER pattern)
            const res = await api.get(ENDPOINTS.ADMIN.DELETE_USER(id)); // GET /admin/users/:id
            return res.data?.data || res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(extractError(error));
        }
    }
);

/** Delete a user */
export const deleteAdminUser = createAsyncThunk(
    'admin/deleteUser',
    async (id, thunkAPI) => {
        try {
            await api.delete(ENDPOINTS.ADMIN.DELETE_USER(id));
            return id; // return id so reducer can remove from state
        } catch (error) {
            return thunkAPI.rejectWithValue(extractError(error));
        }
    }
);

/** Block / Unblock a user — PATCH request (not GET!) */
export const toggleBlockUser = createAsyncThunk(
    'admin/toggleBlockUser',
    async ({ id, blocked }, thunkAPI) => {
        try {
            await api.patch(ENDPOINTS.ADMIN.BLOCK_USER(id), { blocked });
            return { id, blocked }; // return both so reducer can update state
        } catch (error) {
            return thunkAPI.rejectWithValue(extractError(error));
        }
    }
);

/** Fetch all admin orders */
export const fetchAdminOrders = createAsyncThunk(
    'admin/fetchOrders',
    async (_, thunkAPI) => {
        try {
            const res = await api.get(ENDPOINTS.ADMIN.ORDERS);
            return res.data?.data?.Items || res.data?.data || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(extractError(error));
        }
    }
);

/** Fetch dashboard graph data */
export const fetchDashboardGraphs = createAsyncThunk(
    'admin/fetchDashboardGraphs',
    async (_, thunkAPI) => {
        try {
            const res = await api.get(ENDPOINTS.ADMIN.DASHBOARD_GRAPHS);
            return res.data?.data || res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(extractError(error));
        }
    }
);

// ─── INITIAL STATE ────────────────────────────────────────────────────────────

const initialState = {
    users: [],
    selectedUser: null,
    orders: [],
    graphData: null,

    // Per-operation loading flags give components fine-grained control
    loadingUsers: false,
    loadingSelectedUser: false,
    loadingOrders: false,
    loadingGraphs: false,
    loadingBlock: false,   // tracks the in-progress block toggle
    loadingDelete: false,

    error: null,
    successMessage: null,
};

// ─── SLICE ────────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAdminError(state) {
            state.error = null;
        },
        clearAdminSuccess(state) {
            state.successMessage = null;
        },
        clearSelectedUser(state) {
            state.selectedUser = null;
        },
    },
    extraReducers: (builder) => {
        // ── fetchAdminUsers ──────────────────────────────────────────────────
        builder
            .addCase(fetchAdminUsers.pending, (state) => {
                state.loadingUsers = true;
                state.error = null;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action) => {
                state.loadingUsers = false;
                state.users = action.payload;
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
                state.loadingUsers = false;
                state.error = action.payload;
            });

        // ── fetchAdminUser ───────────────────────────────────────────────────
        builder
            .addCase(fetchAdminUser.pending, (state) => {
                state.loadingSelectedUser = true;
                state.error = null;
                state.selectedUser = null;
            })
            .addCase(fetchAdminUser.fulfilled, (state, action) => {
                state.loadingSelectedUser = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchAdminUser.rejected, (state, action) => {
                state.loadingSelectedUser = false;
                state.error = action.payload;
            });

        // ── deleteAdminUser ──────────────────────────────────────────────────
        builder
            .addCase(deleteAdminUser.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteAdminUser.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.users = state.users.filter((u) => u.id !== action.payload);
                state.successMessage = 'User deleted successfully';
            })
            .addCase(deleteAdminUser.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            });

        // ── toggleBlockUser ──────────────────────────────────────────────────
        builder
            .addCase(toggleBlockUser.pending, (state) => {
                state.loadingBlock = true;
                state.error = null;
            })
            .addCase(toggleBlockUser.fulfilled, (state, action) => {
                state.loadingBlock = false;
                const { id, blocked } = action.payload;

                // Update inside the users list
                const idx = state.users.findIndex((u) => u.id === id);
                if (idx !== -1) state.users[idx].blocked = blocked;

                // Update selectedUser if it is the same person
                if (state.selectedUser?.id === id) {
                    state.selectedUser.blocked = blocked;
                }

                state.successMessage = blocked ? 'User blocked' : 'User unblocked';
            })
            .addCase(toggleBlockUser.rejected, (state, action) => {
                state.loadingBlock = false;
                state.error = action.payload;
            });

        // ── fetchAdminOrders ─────────────────────────────────────────────────
        builder
            .addCase(fetchAdminOrders.pending, (state) => {
                state.loadingOrders = true;
                state.error = null;
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.loadingOrders = false;
                state.orders = action.payload;
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.loadingOrders = false;
                state.error = action.payload;
            });

        // ── fetchDashboardGraphs ─────────────────────────────────────────────
        builder
            .addCase(fetchDashboardGraphs.pending, (state) => {
                state.loadingGraphs = true;
                state.error = null;
            })
            .addCase(fetchDashboardGraphs.fulfilled, (state, action) => {
                state.loadingGraphs = false;
                state.graphData = action.payload;
            })
            .addCase(fetchDashboardGraphs.rejected, (state, action) => {
                state.loadingGraphs = false;
                state.error = action.payload;
            });
    },
});

export const { clearAdminError, clearAdminSuccess, clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;