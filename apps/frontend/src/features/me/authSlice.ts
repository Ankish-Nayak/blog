import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface IAuth {
  user: string | null;
  id: string | null;
}

const initialState: IAuth = {
  user: null,
  id: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<IAuth>) => {
      const { user, id } = action.payload;
      state.user = user;
      state.id = id;
    },
    logOut: (state) => {
      state.user = null;
      state.id = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
