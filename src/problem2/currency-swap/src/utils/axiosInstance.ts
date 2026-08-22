import axios from 'axios';

// axios instance for using in whole app
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for axios request, every request will get through this instance first
axiosInstance.interceptors.request.use((config) => {
  return config;
});

// Interceptors for axios responses, every responses will get through this instance first
axiosInstance.interceptors.response.use(
  //Case success
  (response) => {
    return response;
  },
  // Case Error
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
