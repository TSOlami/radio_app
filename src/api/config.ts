import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { ApiResponse } from "@/types";

// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://freeman-assets.onrender.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Create axios instance
const api: AxiosInstance = axios.create(API_CONFIG);

// Token management utilities
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1] || null;
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    document.cookie = `access_token=${token}; path=/; max-age=86400; secure; samesite=strict`;
  },

  removeToken: (): void => {
    if (typeof window === "undefined") return;
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },

  getRole: (): string | null => {
    if (typeof window === "undefined") return null;
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_role="))
      ?.split("=")[1] || null;
  },

  setRole: (role: string): void => {
    if (typeof window === "undefined") return;
    document.cookie = `user_role=${role}; path=/; max-age=86400; secure; samesite=strict`;
  },
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = tokenManager.getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers["X-Request-ID"] = generateRequestId();

    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log("[API REQUEST]", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    console.error("[API REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log responses in development
    if (process.env.NODE_ENV === "development") {
      console.log("[API RESPONSE]", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    const { response, request, config } = error;

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error("[API RESPONSE ERROR]", {
        url: config?.url,
        status: response?.status,
        data: response?.data,
        message: error.message,
      });
    }

    // Handle different error scenarios
    if (response) {
      // Server responded with error status
      const { status, data } = response;

      switch (status) {
        case 401:
          // Unauthorized - clear tokens and redirect
          tokenManager.removeToken();
          if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          break;

        case 403:
          // Forbidden - redirect to appropriate dashboard
          if (typeof window !== "undefined") {
            const role = tokenManager.getRole();
            const dashboardUrl = getDashboardUrl(role);
            window.location.href = dashboardUrl;
          }
          break;

        case 404:
          // Not found
          break;

        case 422:
          // Validation errors
          break;

        case 429:
          // Rate limiting
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          break;

        default:
          break;
      }

      // Return formatted error response
      return Promise.reject({
        status,
        message: data?.message || data?.error || "An error occurred",
        errors: data?.errors || null,
        data: data?.data || null,
      });
    } else if (request) {
      // Network error
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your connection.",
        errors: null,
        data: null,
      });
    } else {
      // Request setup error
      return Promise.reject({
        status: 0,
        message: error.message || "Request failed",
        errors: null,
        data: null,
      });
    }
  }
);

// Helper functions
function generateRequestId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getDashboardUrl(role: string | null): string {
  switch (role) {
    case "superadmin":
      return "/superadmin";
    case "admin":
    case "manager":
      return "/admin";
    case "user":
      return "/user";
    default:
      return "/login";
  }
}

// API wrapper functions
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.get(url, config).then((response) => response.data),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    api.post(url, data, config).then((response) => response.data),

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    api.put(url, data, config).then((response) => response.data),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> =>
    api.patch(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.delete(url, config).then((response) => response.data),
};

// Export the configured axios instance
export default api;