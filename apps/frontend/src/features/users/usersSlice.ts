import { EntityState, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { IgetUsers, IgetUser } from "types";

export interface IUser {
  id: string;
  name: string;
}

const usersAdapter = createEntityAdapter<IUser>({
  sortComparer: (a, b) => b.name.localeCompare(a.name),
});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<IUser>, void>({
      query: () => "/users",
      transformResponse(res: IgetUsers) {
        const loadedUsers: IUser[] = res.users.map((user) => {
          return {
            id: user._id,
            name: user.name,
          };
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (res) => {
        return typeof res === "undefined"
          ? [{ type: "User", id: "LIST" }]
          : [
              { type: "User", id: "List" },
              ...res.ids.map((id) => ({ type: "User" as const, id })),
            ];
      },
    }),
    getUser: builder.query<IUser, string>({
      query: (id) => `/users/${id}`,
      transformResponse(res: IgetUser) {
        return {
          id: res.user._id,
          name: res.user.name,
        };
      },
    }),
  }),
});

export const { useGetUserQuery, useGetUsersQuery } = usersApiSlice;

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();
