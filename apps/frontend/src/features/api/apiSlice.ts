import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const BASE_URL: string = "http://localhost:3000";

import rtkQueryMiddleware from "./middlewares";
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // includes cookies
  // responseHandler: async (res: Response, )
  // onResponse: async (response, { getState, requestId }) => {
  //   // Your logic to intercept and handle the response status
  //   console.log(`Response Status for Request ${requestId}: ${response.status}`);
  //   return response;
  // },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Post", "User", "Auth"],
  // @ts-expect-error dfdf
  endpoints: (builder) => ({}), // eslint-disable-line
  // middleware: (getDefaultMiddleware) => {
  //   getDefaultMiddleware().concat(rtkQueryMiddleware);
  // },
});
