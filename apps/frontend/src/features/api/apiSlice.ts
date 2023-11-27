import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL: string = "http://localhost:3000";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["Post", "User"],
  // @ts-expect-error dfdf
  endpoints: (builder) => ({}), // eslint-disable-line
});
