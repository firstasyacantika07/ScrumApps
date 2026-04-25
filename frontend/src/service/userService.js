import api from '../api/axios';

export const getUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);