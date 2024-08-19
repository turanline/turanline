//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//GLobal Types
import { IPostCartApi, IPutCart } from "@/types/types";
//Redux Types
import { ICartState } from "@/types/reduxTypes";
//Services
import { getCart,postToCart,deleteFromCartById,patchCartItem } from "@/services/cartAPI";
import { getCookie } from "cookies-next";
import { postVerifyToken } from "@/services/authAPI";
//State
const initialState: ICartState = {
  cart: {
    address: "",
    created_date: "",
    customer: null,
    id: null,
    order_products: [],
    payment_method: "BC",
    status: "CR",
    total_sum: null,
  },
  status: "pending",
};

export const fetchCart = createAsyncThunk<ICartState["cart"],undefined,{ rejectValue: string }>("cartSlice/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const token = getCookie("AuthTokenMis");

    if (token) {
      const { user } = await postVerifyToken(token);

      return await getCart(user);
    }
  } catch (error) {
    return rejectWithValue(`Failed to load user cart: ${error}`);
  }
});

export const addToCart = createAsyncThunk<any,IPostCartApi,{ rejectValue: string }>("cartSlice/addToCart", async (cartItem, { rejectWithValue }) => {
  try {
    await postToCart(cartItem);
  } catch (error) {
    return rejectWithValue(`Failed add to cart: ${error}`);
  }
});

export const changeItemCounter = createAsyncThunk<{ options: IPutCart; id: number },{ options: IPutCart; id: number },{ rejectValue: string }>("cartSlice/changeItemCounter", async (obj, { rejectWithValue }) => {
  try {
    await patchCartItem(obj.options, obj.id);

    return obj;
  } catch (error) {
    return rejectWithValue(`Failed change counter: ${error}`);
  }
});

export const deleteFromCart = createAsyncThunk<undefined,number,{ rejectValue: string }>("cartSlice/deleteFromCart", async (id, { rejectWithValue }) => {
  try {
    await deleteFromCartById(id);
  } catch (error) {
    return rejectWithValue(`Failed delete from cart: ${error}`);
  }
});

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    resetCart(state) {
      state.cart.order_products = [];
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
      .addCase(addToCart.fulfilled, state => {
        state.status = "fulfilled";
      })
      .addCase(deleteFromCart.pending, state => {
        state.status = "pending";
      })
      .addCase(deleteFromCart.fulfilled, state => {
        state.status = "fulfilled";
      })
      .addCase(changeItemCounter.fulfilled, (state, action) => {
        state.status = "fulfilled";

        state.cart = {
          ...state.cart,
          order_products: state.cart.order_products.map(product => {
            if (product.id === action.payload.id) {
              return {
                ...product,
                amount: action.payload.options.amount,
              };
            }

            return product;
          }),
        };
      }),
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
