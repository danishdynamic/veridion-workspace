import axios, { AxiosError } from "axios";

export class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "APIError";
  }
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Response interceptor for unified FastAPI error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string | { msg: string }[] }>) => {
    let message = "An unexpected error occurred";
    
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      message = typeof detail === "string" 
        ? detail 
        : detail.map((err) => err.msg).join(", ");
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(
      new APIError(message, error.response?.status)
    );
  }
);