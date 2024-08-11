//Global
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//Component Types
import { IProductMainPage } from "@/types/componentTypes";
//Redux Types
import { IFavoritesState } from "@/types/reduxTypes";
//Services
import { getFavorites, patchUserFavorites } from "@/services/favoritesAPI";
import { postVerifyToken } from "@/services/authAPI";
import { getCookie } from "cookies-next";
//State
const initialState: IFavoritesState = {
  favorites: [],
  status: "pending",
};



export const fetchFavorites = createAsyncThunk<IFavoritesState["favorites"],undefined,{ rejectValue: string }>("favoritesSlice/fetchFavorites", async (_, { rejectWithValue }) => {
  try {
    return await getFavorites();
  } catch (error) {
    return rejectWithValue(`Failed fetch favorites: ${error}`);
  }
});

export const addToFavorites = createAsyncThunk<IProductMainPage,IProductMainPage,{ rejectValue: string }>("favoritesSlice/addToFavorites", async (product, { rejectWithValue }) => {
  try {
    const authToken = getCookie("AuthTokenMis");

    if (authToken) {
      const { user } = await postVerifyToken(authToken),
        data: IProductMainPage[] = await getFavorites(),
        serverData = data.map(item => item.id);

      await patchUserFavorites(user, [...serverData, product.id]);
    }

    return product;
  } catch (error) {
    return rejectWithValue(`Failed add to favorites: ${error}`);
  }
});

export const deleteFromFavorites = createAsyncThunk<IProductMainPage,IProductMainPage,{ rejectValue: string }>("favoritesSlice/deleteFromFavorites",async (product, { rejectWithValue }) => {
    try {
      const authToken = getCookie("AuthTokenMis");

      if (authToken) {
        const { user } = await postVerifyToken(authToken),
          data: IProductMainPage[] = await getFavorites(),
          serverData = data
            .map(item => item.id)
            .filter(item => item !== product.id);

        await patchUserFavorites(user, serverData);
      }

      return product;
    } catch (error) {
      return rejectWithValue(`Failed delete from favorites: ${error}`);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favoritesSlice",
  initialState,
  reducers: {
    resetFavorites(state) {
      state.favorites = [];
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchFavorites.pending, state => {
        state.status = "pending";
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.favorites = action.payload;
      })
      .addCase(addToFavorites.pending, state => {
        state.status = "pending";
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.favorites.push(action.payload);
      })
      .addCase(deleteFromFavorites.pending, state => {
        state.status = "pending";
      })
      .addCase(deleteFromFavorites.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.favorites = state.favorites.filter(
          item => item.id !== action.payload.id
        );
      }),
});

export const { resetFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
