import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for token management
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        console.error('[API Error]:', message, error.response?.status);

        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., logout)
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject({
            message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
);

const apiService = {
    get: (url, config = {}) => api.get(url, config),
    post: (url, data, config = {}) => api.post(url, data, config),
    put: (url, data, config = {}) => api.put(url, data, config),
    patch: (url, data, config = {}) => api.patch(url, data, config),
    delete: (url, config = {}) => api.delete(url, config),
    getUsers: () => api.get('/admin_users'),
    updateAdminUser: (id, data) => api.patch(`/admin_users/${id}`, data),
};

export default apiService;
