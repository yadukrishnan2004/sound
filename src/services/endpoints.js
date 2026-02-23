export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/signup',
        VERIFY_OTP: '/users/verify',
        PROFILE: '/users/profile',
        LOGOUT: '/users/logout'
    },
    PRODUCTS: {
        LIST: '/users/allproducts',
        DETAIL: (id) => `/users/products/${id}`,
        FILTER: '/users/filter'
    },
    CART: {
        GET: '/cart',
        ADD: '/cart/add',
        REMOVE: (id) => `/cart/${id}`,
        UPDATE: (id) => `/cart/${id}`,
        CLEAR: '/cart/clear',
    },
    WISHLIST: {
        GET: '/wishlist',
        ADD: (id) => `/wishlist/${id}`,
        REMOVE: (id) => `/wishlist/${id}`,
        CLEAR: '/wishlist/clear',
    },
    ORDERS: {
        CREATE: '/orders',
        LIST: '/orders',
        DETAIL: (id) => `/orders/${id}`,
        BUY: '/orders/buy-now'
    },
    ADDRESS: {
        CREATE: '/addresses',
        GET: '/addresses',
    },
    SEARCH: {
        SEARCH: '/users/search'
    },
    ADMIN: {
        USERS: '/admin/users',
        ORDERS: '/admin/orders',
        ORDER_DETAIL: (id) => `/admin/orders/${id}`,
        UPDATE_ORDER: (id) => `/admin/orders/${id}`,
        UPDATE_ORDER_STATUS: (id) => `/admin/orders/status/${id}`,
        DASHBOARD_GRAPHS: '/admin/dashboard-graphs',
        DELETE_USER: (id) => `/admin/users/${id}`,
        BLOCK_USER: (id) => `/admin/users/${id}/block`,
        GET_USER: (id) => `/admin/users/${id}`,
        GET_USER_CART: (id) => `/admin/users/${id}/cart`,
        GET_USER_WISHLIST: (id) => `/admin/users/${id}/wishlist`,
        GET_USER_ADDRESSES: (id) => `/admin/users/${id}/addresses`,
        UPDATE_USER: (id) => `/admin/users/${id}`,
        PRODUCTS: {
            LIST: '/admin/products',
            ADD: '/admin/products',
            UPDATE: (id) => `/admin/products/${id}`,
            DELETE: (id) => `/admin/products/${id}`,
        }
    }
};
