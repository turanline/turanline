//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//Services
import { getAllProducts } from "@/services/productsAPI";
//Component Types
import { IProductMainPage } from "@/types/componentTypes";
//Redux Types
import { IFavoritesState, IProductsState } from "@/types/reduxTypes";
//State
const initialState: IProductsState = {
  products: [],
  filtered: [],
  category: "Все категории",
  status: "pending",
  searchText: "",
  filters: {
    brand: null,
    color: null,
    hbprice: null,
    lbprice: null,
    size: null,
  },
};



export const fetchProducts = createAsyncThunk<IProductMainPage[],undefined,{ rejectValue: string }>("productsSlice/fetchProducts", async (_, { rejectWithValue }) => {
  const filters: IProductsState["filters"] = {
    brand: null,
    color: null,
    hbprice: null,
    lbprice: null,
    size: null,
  };

  try {
    return await getAllProducts("Все категории", filters);
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const fetchFilteredProducts = createAsyncThunk<IProductMainPage[],undefined,{ rejectValue: string; state: { products: typeof initialState } }>("productsSlice/fetchFilteredProducts",async (_, { rejectWithValue, getState }) => {
    const { category, filters } = getState().products;

    try {
      return await getAllProducts(category, filters);
    } catch (error) {
      return rejectWithValue(`${error}`);
    }
  }
);

const productsSlice = createSlice({
  name: "productsSlice",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setSearchText(state, action) {
      state.searchText = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = "pending";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.products = action.payload;
      })
      .addCase(fetchFilteredProducts.pending, state => {
        state.status = "pending";
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.filtered = action.payload;
      }),
});

export const { setCategory, setFilters, setSearchText } = productsSlice.actions;

export default productsSlice.reducer;
