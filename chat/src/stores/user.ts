import { defineStore } from 'pinia';
import { auth } from '../services/api';

interface User {
    _id: string;
    username: string;
    email: string;
    token: string;
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async login(email: string, password: string) {
            try {
                this.loading = true;
                this.error = null;
                const userData = await auth.login(email, password);
                this.user = userData;
                localStorage.setItem('token', userData.token);
            } catch (error: any) {
                this.error = error.response?.data?.message || 'An error occurred';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(username: string, email: string, password: string) {
            try {
                this.loading = true;
                this.error = null;
                const userData = await auth.register(username, email, password);
                this.user = userData;
                localStorage.setItem('token', userData.token);
            } catch (error: any) {
                this.error = error.response?.data?.message || 'An error occurred';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            localStorage.removeItem('token');
        }
    }
});