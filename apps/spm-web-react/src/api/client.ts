/**
 * API Client
 * Axios instance with base configuration and interceptors
 */

import axios from 'axios';
import { userService } from './services/userService';

// In development, requests go through webpack-dev-server's proxy (see webpack.config.ts)
const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.API_BASE_URL : '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add tenant header and auth tokens
apiClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = userService.getAuthHeader();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
    async response => {
        const { config, status } = response;

        if (status === 202) {
            config._202RetryCount = config._202RetryCount || 0;
            if (config._202RetryCount < 100) {
                config._202RetryCount += 1;

                return new Promise((resolve) => {
                    setTimeout(() => {
                        apiClient.get(response.headers.location).then(resolve);
                    }, 500);
                });
            }
            throw new Error('Max 202 retry attempts reached');
        }

        // If not a 202 response, then return as normal
        return response;
    },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // TODO: Handle unauthorized - redirect to login
          userService.clearSelecteduser();
          console.error('Unauthorized - please log in');
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error - please try again later');
          break;
        default:
          console.error(`API Error: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
