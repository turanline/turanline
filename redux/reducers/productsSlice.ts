//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//Services
import { getAllProducts,getColorsAPI } from "@/services/productsAPI";
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
    price_max: null,
    price_min: null,
    category: null,
    mold: null,
    material: null,
    season: null,
  },
  colors:[],
};

export const fetchProducts = createAsyncThunk<IProductMainPage[],undefined,{ rejectValue: string }>("productsSlice/fetchProducts", async (_, { rejectWithValue }) => {
  const filters: IProductsState["filters"] = {
    brand: null,
    color: null,
    price_max: null,
    price_min: null,
    category: null,
    mold: null,
    material: null,
    season: null,
  };

  try {
    return await getAllProducts("Все категории", filters);
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});


export const getColors = createAsyncThunk<any[],undefined,{ rejectValue: string }>("productSlice/getColors", async (_, { rejectWithValue }) => {
  try {
    return await getColorsAPI();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

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
    setSearchProducts(state, action) {
      state.filtered = action.payload;
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
      .addCase(getColors.pending, state => {
        state.status = "pending";
      })
      .addCase(getColors.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.colors = action.payload;
      }),
      
});

export const { setCategory, setFilters, setSearchText,setSearchProducts } = productsSlice.actions;

export default productsSlice.reducer;
