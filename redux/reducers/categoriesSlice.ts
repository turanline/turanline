//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//Services
import { getCategories, getTypes, getSubTypes } from "@/services/categoriesAPI";
//Interfaces
interface Category {
  id: number;
  name: string;
  image: string;
  level: number;
  parent: number;
}
interface ICategoriesState {
  categories: Category[];
  types: Category[];
  subtypes: Category[];
  status: "pending" | "fulfilled";
}
//State
const initialState: ICategoriesState = {
  categories: [],
  types: [],
  subtypes: [],
  status: "pending",
};



export const fetchCategories = createAsyncThunk<ICategoriesState["categories"],undefined,{ rejectValue: string }>("categoriesSlice/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const categories = getCategories();

    return categories;
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const fetchTypes = createAsyncThunk<ICategoriesState["types"],undefined,{ rejectValue: string }>("categoriesSlice/fetchTypes", async (_, { rejectWithValue }) => {
  try {
    return await getTypes();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const fetchSubtypes = createAsyncThunk<ICategoriesState["subtypes"],undefined,{ rejectValue: string }>("categoriesSlice/fetchSubtypes", async (_, { rejectWithValue }) => {
  try {
    return await getSubTypes();
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
      })
      .addCase(fetchTypes.pending, state => {
        state.status = "pending";
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.types = action.payload;
      })
      .addCase(fetchSubtypes.pending, state => {
        state.status = "pending";
      })
      .addCase(fetchSubtypes.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.subtypes = action.payload;
      }),
});

export default categoriesSlice.reducer;
