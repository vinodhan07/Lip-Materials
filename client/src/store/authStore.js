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

    // Fetch fresh profile data from server
    fetchProfile: async () => {
        try {
            const response = await authAPI.getProfile();
            const user = response.data.user;

            localStorage.setItem('user', JSON.stringify(user));
            set({ user });

            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to fetch profile';
            return { success: false, error: message };
        }
    },

    // Update profile data
    updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authAPI.updateProfile(data);
            const user = response.data.user;

            // Update local storage and state
            const currentUser = get().user;
            const updatedUser = { ...currentUser, ...user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser, isLoading: false });

            return { success: true, user: updatedUser };
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to update profile';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    // Upload profile photo
    uploadPhoto: async (file) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('photo', file);

            const response = await authAPI.uploadProfilePhoto(formData);
            const { photo_url } = response.data;

            // Update local storage and state
            const currentUser = get().user;
            const updatedUser = { ...currentUser, photo_url };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser, isLoading: false });

            return { success: true, photo_url };
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to upload photo';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    // Update user photo in state (for real-time sync)
    setUserPhoto: (photo_url) => {
        const currentUser = get().user;
        if (currentUser) {
            const updatedUser = { ...currentUser, photo_url };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
        }
    },

    clearError: () => set({ error: null }),

    isAdmin: () => get().user?.role === 'admin',
}));

export default useAuthStore;
