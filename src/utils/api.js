import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Dynamic local dev vs production render API resolution
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return "http://localhost:5000/api";
  }
  return "https://goldsmiths-api.onrender.com/api";
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedInfo = JSON.parse(userInfo);
      if (parsedInfo.token) {
        config.headers.Authorization = `Bearer ${parsedInfo.token}`;
      }
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Return data from our standardized format
    if (response.data && response.data.success !== undefined) {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const getMediaUrl = (url) => {
  if (!url) return '';
  
  // Support passing user avatar object shape { url, public_id }
  let targetUrl = url;
  if (url && typeof url === 'object' && typeof url.url === 'string') {
    targetUrl = url.url;
  }
  
  if (typeof targetUrl !== 'string') return '';
  
  // If it's already a full external URL, return it as-is
  if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('data:')) {
    return targetUrl;
  }
  
  // Normalize backslashes to forward slashes
  const normalizedUrl = targetUrl.replace(/\\/g, '/');
  
  // Check if it's an uploaded asset (contains uploads/ or starts with uploads/)
  if (normalizedUrl.includes('uploads/') || normalizedUrl.startsWith('uploads/')) {
    let baseHost = API_BASE_URL.replace('/api', '');
    if (!baseHost || baseHost.startsWith('/')) {
      // Self-healing port resolution for localhost dev server
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        baseHost = 'http://localhost:5000';
      } else if (typeof window !== 'undefined') {
        baseHost = window.location.origin;
      }
    }
    const sanitizedUrl = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
    return `${baseHost}${sanitizedUrl}`;
  }
  
  return normalizedUrl;
};

export const getProductImage = (product) => {
  if (!product) return '';
  
  // 1. If product is a string itself (e.g. passed directly)
  if (typeof product === 'string' && product.length > 1) {
    return product;
  }
  
  // 2. Check if product.images is a valid non-empty array
  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    if (first && typeof first === 'object' && first.url) {
      return first.url;
    }
    if (first && typeof first === 'string' && first.length > 1) {
      return first;
    }
  }
  
  // 3. Check if product.images is a valid string
  if (typeof product.images === 'string' && product.images.length > 1) {
    return product.images;
  }
  
  // 4. Fallback to featuredImage
  if (product.featuredImage && typeof product.featuredImage === 'string' && product.featuredImage.length > 1) {
    return product.featuredImage;
  }
  
  // 5. Fallback to image
  if (product.image && typeof product.image === 'string' && product.image.length > 1) {
    return product.image;
  }
  
  return '';
};

export default api;

