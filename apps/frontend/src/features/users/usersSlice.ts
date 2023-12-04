import {
  EntityState,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { IgetUsers, IgetUser } from "types";
import { RootState } from "../../app/store";

export interface IUser {
  id: string;
  name: string;
  email: string;
}

const usersAdapter = createEntityAdapter<IUser>({
  sortComparer: (a, b) => b.name.localeCompare(a.name),
});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<IUser>, string>({
      query: () => "/users",
      transformResponse(res: IgetUsers) {
        const loadedUsers: IUser[] = res.users.map((user) => {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
          };
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (res) => {
        return typeof res === "undefined"
          ? [{ type: "User", id: "LIST" }]
          : [
              { type: "User", id: "LIST" },
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
          email: res.user.email,
        };
      },
    }),
  }),
});

export const { useGetUserQuery, useGetUsersQuery } = usersApiSlice;

export const selectUsersResult =
  usersApiSlice.endpoints.getUsers.select("getUsers");

const selectUsersData = createSelector(
  [selectUsersResult],
  (usersResult) => usersResult.data,
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUsersIds,
} = usersAdapter.getSelectors<RootState>(
  (state) => selectUsersData(state) ?? initialState,
);
