import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://upskill.baltutech.com/wp-json/ldlms/v2', // Default API URL
  timeout: 10000, // Default timeout
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    username: 'ariasorozcojoseluis3@gmail.com',
    password: 'P6Ug C3km Hjyj 3q3c aa10 5zh3',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle common errors here
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// Generic API methods
const ApiService = {
  // GET request
  get: async (endpoint, params = {}) => {
    try {
      return await apiClient.get(endpoint, { params });
    } catch (error) {
      console.error('GET Request Error:', error);
      throw error;
    }
  },

  // POST request
  post: async (endpoint, data = {}) => {
    try {
      return await apiClient.post(endpoint, data);
    } catch (error) {
      console.error('POST Request Error:', error);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, data = {}) => {
    try {
      return await apiClient.put(endpoint, data);
    } catch (error) {
      console.error('PUT Request Error:', error);
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      return await apiClient.delete(endpoint);
    } catch (error) {
      console.error('DELETE Request Error:', error);
      throw error;
    }
  },
};

export default ApiService; 