import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Permitir envío de cookies (JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
