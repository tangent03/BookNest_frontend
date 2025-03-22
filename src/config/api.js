// API configuration
const isDevelopment = import.meta.env.MODE === 'development';

// Default to the production URL if no environment variable is provided
const API_URL = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.endsWith('/') 
      ? import.meta.env.VITE_API_URL.slice(0, -1) 
      : import.meta.env.VITE_API_URL)
  : isDevelopment 
      ? 'http://localhost:4002' 
      : 'https://booknest-backend-p0j9.onrender.com';

console.log('API URL:', API_URL); // For debugging during development

export default API_URL; 