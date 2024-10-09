//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//Services
import {deleteProductBySlug,getAllProvidersGoods,getProvidersOrders, getColorsAPI} from "@/services/providerAPI";
//Types
import {Color,IProvidersGoods,IProvidersOrders} from "@/types/additionalTypes";
//State`s Types
interface IProductState {
  statusProduct: "pending" | "fulfilled";
  providersGoods: IProvidersGoods[];
  providersOrders: IProvidersOrders[];
  colors: Color[];
}

//State
const initialState: IProductState = {
  providersGoods: [],
  statusProduct: "pending",
  providersOrders: [],
  colors:[],
};




export const getAllProvidersGood = createAsyncThunk<IProvidersGoods[],undefined,{ rejectValue: string }>("productSlice/getAllProvidersGoods", async (_, { rejectWithValue }) => {
  try {
    return await getAllProvidersGoods();
  
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const getProviderOrders = createAsyncThunk< IProvidersOrders[],undefined,{ rejectValue: string }>("productSlice/getProviderOrders", async (_, { rejectWithValue }) => {
  try {
    return await getProvidersOrders();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});


export const getColors = createAsyncThunk<Color[],undefined,{ rejectValue: string }>("productSlice/getColors", async (_, { rejectWithValue }) => {
  try {
    return await getColorsAPI();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});


const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      //Provider Get All Goods
      .addCase(getAllProvidersGood.pending, state => {
        state.statusProduct = "pending";
      })
      .addCase(getAllProvidersGood.fulfilled, (state, action) => {
        state.statusProduct = "fulfilled";
        state.providersGoods = action.payload;
      })
      //Provider Get Orders
      .addCase(getProviderOrders.pending, state => {
        state.statusProduct = "pending";
      })
      .addCase(getProviderOrders.fulfilled, (state, action) => {
        state.statusProduct = "fulfilled";
        state.providersOrders = action.payload;
      })
      //color
      .addCase(getColors.pending, state => {
        state.statusProduct = "pending";
      })
      .addCase(getColors.fulfilled, (state, action) => {
        state.statusProduct = "fulfilled";
        state.colors = action.payload;
      })

});

export default productSlice.reducer;
