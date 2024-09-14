//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//Types
import { ICartState, IPostCartApi, IPutCart } from "@/types/types";

//Services
import {
  getCart,
  postToCart,
  deleteFromCartById,
  patchCartItem,
} from "@/services/cartAPI";

const initialState: ICartState = {
  cart: [],
  status: "pending",
};

export const fetchCart = createAsyncThunk<
  ICartState["cart"],
  undefined,
  { rejectValue: string }
>("cartSlice/fetchCart", async (_, { rejectWithValue }) => {
  try {
    return await getCart();
  } catch (error) {
    return rejectWithValue(`Failed to load user cart: ${error}`);
  }
});

export const addToCart = createAsyncThunk<
  ICartState["cart"],
  IPostCartApi,
  { rejectValue: string }
>("cartSlice/addToCart", async (cartItem, { rejectWithValue }) => {
  try {
    await postToCart(cartItem);

    return await getCart();
  } catch (error) {
    return rejectWithValue(`Failed add to cart: ${error}`);
  }
});

export const deleteFromCart = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("cartSlice/deleteFromCart", async (id, { rejectWithValue }) => {
  try {
    await deleteFromCartById(id);

    return id;
  } catch (error) {
    return rejectWithValue(`Failed delete from cart: ${error}`);
  }
});

export const changeItemCounter = createAsyncThunk<
  IPutCart,
  IPutCart,
  { rejectValue: string }
>("cartSlice/changeItemCounter", async (obj, { rejectWithValue }) => {
  try {
    await patchCartItem(obj);
    return obj;
  } catch (error) {
    return rejectWithValue(`Failed change counter: ${error}`);
  }
});

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    resetCart(state) {
      state.cart = [];
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchCart.pending, state => {
        state.status = "pending";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.cart = action.payload;
      })
      .addCase(addToCart.pending, state => {
        state.status = "pending";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.cart = action.payload;
      })
      .addCase(deleteFromCart.pending, state => {
        state.status = "pending";
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.cart = state.cart.filter(item => item.id !== action.payload);
      })
      .addCase(changeItemCounter.fulfilled, (state, action) => {
        const { amount, productId } = action.payload;

        state.cart = state.cart.map(item =>
          item.id === productId ? { ...item, amount } : item
        );
      }),
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
