import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

const register = async (userData) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
};

const verifyOtp = async (data) => {
    const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, data);
    return response.data;
};

const login = async (userData) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, userData);
    return response.data;
};

const logout = async () => {
    await api.post('/users/logout');
};

const getProfile = async () => {
    const response = await api.get('/users/profile');
    return response.data;
}

const authService = {
    register,
    verifyOtp,
    login,
    logout,
    getProfile
};

export default authService;
