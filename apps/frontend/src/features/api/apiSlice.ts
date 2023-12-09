import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const BASE_URL: string = "http://localhost:3000";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Post", "User", "Auth", "Notification"],
  // @ts-expect-error dfdf
  endpoints: (builder) => ({}), // eslint-disable-line
});
