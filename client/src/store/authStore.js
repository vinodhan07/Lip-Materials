import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authAPI.login(email, password);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false
            });

            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    register: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authAPI.register(data);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false
            });

            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.error || 'Registration failed';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null
        });
    },

    clearError: () => set({ error: null }),

    isAdmin: () => get().user?.role === 'admin',
}));

export default useAuthStore;
