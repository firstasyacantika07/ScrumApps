import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);

        if (user?.tenant_id) {
          config.headers['X-Tenant-ID'] = user.tenant_id;
        }
      }

    } catch (error) {
      console.error("Gagal membaca localStorage:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR (PENTING BANGET)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 🔥 HANDLE TOKEN EXPIRED / UNAUTHORIZED
    if (status === 401) {
      console.warn("Token expired / unauthorized");

      // hapus semua session
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // redirect ke login
      window.location.href = '/login';
    }

    // 🔒 OPTIONAL: handle forbidden
    if (status === 403) {
      alert("Akses ditolak (subscription tidak aktif)");
    }

    return Promise.reject(error);
  }
);

export default api;