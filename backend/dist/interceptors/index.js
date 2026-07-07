"use strict";
// src/interceptors/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const apiClient = axios_1.default.create({
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});
// Request Interceptor
apiClient.interceptors.request.use((config) => {
    const token = process.env.API_TOKEN;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response Interceptor
apiClient.interceptors.response.use((response) => {
    console.log(`[RESPONSE] ${response.status} ${response.config.url}`);
    return response;
}, (error) => {
    console.error("[API ERROR]", error?.response?.data || error.message);
    return Promise.reject(error);
});
exports.default = apiClient;
