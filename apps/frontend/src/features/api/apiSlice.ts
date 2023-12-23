import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const BASE_URL: string = "http://localhost:3000";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Post", "User", "Auth", "Notification", "SavedPost"],
  // @ts-expect-error dfdf
  endpoints: (builder) => ({}), // eslint-disable-line
});
export interface ApiErrorResponse {
  status: number;
  data: { message: string; error: string };
}

export function isApiResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === "object" &&
    error != null &&
    "status" in error &&
    typeof (error as any).status === "number"
  );
}
