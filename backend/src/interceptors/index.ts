// src/interceptors/index.ts

import axios from "axios";

const apiClient = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = process.env.API_TOKEN;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `[REQUEST] ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `[RESPONSE] ${response.status} ${response.config.url}`
    );

    return response;
  },
  (error) => {
    console.error(
      "[API ERROR]",
      error?.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default apiClient;