import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface IFilter {
  name: string | undefined;
  title: string | undefined;
}
const initialState: IFilter = {
  name: undefined,
  title: undefined,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    clearFilters: (state) => {
      state.title = undefined;
      state.name = undefined;
    },
    clearFilter: (
      state,
      action: PayloadAction<{
        fitlerBy: "name" | "title";
      }>,
    ) => {
      state[action.payload.fitlerBy] = undefined;
    },
    applyFilter: (
      state,
      action: PayloadAction<{
        fitlerBy: "name" | "title";
        value: string;
      }>,
    ) => {
      state[action.payload.fitlerBy] = action.payload.value;
    },
  },
});

export const { clearFilters, applyFilter, clearFilter } = filterSlice.actions;
export default filterSlice.reducer;
