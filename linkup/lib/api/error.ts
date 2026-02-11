import { AxiosError } from "axios";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const message =
      error.response?.data?.message || "API request failed";
    const status = error.response?.status || 500;
    throw new ApiError(message, status);
  }

  throw new ApiError("Unexpected error", 500);
}
