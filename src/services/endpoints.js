export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/signup',
        VERIFY_OTP: '/users/verify',
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
        DASHBOARD_GRAPHS: '/admin/dashboard-graphs',
        DELETE_USER : (id) => `/admin/users/${id}`,
        BLOCK_USER: (id)=> `/admin/users/${id}/block`,
    }
};
