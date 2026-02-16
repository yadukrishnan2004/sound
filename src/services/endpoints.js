export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/signup',
        VERIFY_OTP: '/users/verify',
    },
    PRODUCTS: {
        LIST: '/users/allproducts',
        DETAIL: (id) => `/users/products/${id}`,
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
        ADD: '/wishlist/add',
        REMOVE: (id) => `/wishlist/remove/${id}`,
    },
    ORDERS: {
        CREATE: '/orders',
        LIST: '/orders',
        DETAIL: (id) => `/orders/${id}`,
    },
};
