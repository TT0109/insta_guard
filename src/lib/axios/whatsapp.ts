// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.WHATSAPP_API_URL}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-rapidapi-host': `${process.env.WHATSAPP_API_HEADER_HOST}`,
    'x-rapidapi-key': `${process.env.WHATSAPP_RAPIDAPI_KEY}` || '86bf04e7f5mshadf0cf3d655fe22p18860fjsn0b5d6c8644d0',
  },
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    return Promise.reject(error);
  }
);

export default api;
