import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const userApi = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    updateUserStatus: async (userId: string, status: string) => {
        const response = await api.patch(`/users/${userId}/status`, { status });
        return response.data;
    }
};

export const messageApi = {
    getMessages: async (senderId: string, receiverId: string) => {
        const response = await api.get('/messages', {
            params: { senderId, receiverId }
        });
        return response.data;
    },

    sendMessage: async (messageData: {
        id: string;
        content: string;
        senderId: string;
        receiverId: string;
        timestamp: number;
    }) => {
        const response = await api.post('/messages', messageData);
        return response.data;
    }
};

export const adminApi = {
    createUser: async (userData: {
        id: string;
        name: string;
        role: string;
        avatar: string;
    }) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },

    createProject: async (projectData: {
        id: string;
        name: string;
        description: string;
        status: string;
    }) => {
        const response = await api.post('/admin/projects', projectData);
        return response.data;
    }
};

export default api;