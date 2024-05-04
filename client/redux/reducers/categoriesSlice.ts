//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//Types
import { ICategoriesState } from "@/types/types";

//Services
import { getCategories } from "@/services/categoriesAPI";

const initialState: ICategoriesState = {
  categories: [],
  status: "pending",
};

export const fetchCategories = createAsyncThunk<
  ICategoriesState["categories"],
  undefined,
  { rejectValue: string }
>("categoriesSlice/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const categories = await getCategories();

    return await categories;
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

const categoriesSlice = createSlice({
  name: "categoriesSlice",
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(fetchCategories.pending, state => {
        state.status = "pending";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.categories = action.payload;
      }),
});

export default categoriesSlice.reducer;
