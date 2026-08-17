// veridion-frontend/lib/axios.ts
import axios, { AxiosError } from "axios";

export class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "APIError";
  }
}

export const api = axios.create({
  
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Response interceptor — handles both Node.js and FastAPI error shapes
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ 
    detail?: string | { msg: string }[]; 
    error?: string;
    message?: string;
  }>) => {
    let message = "An unexpected error occurred";

    if (error.response?.data) {
      const data = error.response.data;
      if (data.detail) {
        message = typeof data.detail === "string"
          ? data.detail
          : data.detail.map((err) => err.msg).join(", ");
      } else if (data.error) {
        message = data.error;
      } else if (data.message) {
        message = data.message;
      }
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new APIError(message, error.response?.status));
  }
);