//Global
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//Types
import { IFavoritesState, IProductMainPage } from "@/types/types";

//Services
import { getFavorites, patchUserFavorites } from "@/services/favoritesAPI";
import { postVerifyToken } from "@/services/authAPI";

const initialState: IFavoritesState = {
  favorites: [],
  status: "pending",
};

export const fetchFavorites = createAsyncThunk<
  IFavoritesState["favorites"],
  undefined,
  { rejectValue: string }
>("favoritesSlice/fetchFavorites", async (_, { rejectWithValue }) => {
  try {
    const authToken = localStorage.getItem("AuthTokenMis");

    if (authToken) {
      const { user } = await postVerifyToken(authToken);

      return await getFavorites(user);
    }
  } catch (error) {
    return rejectWithValue(`Failed fetch favorites: ${error}`);
  }
});

export const addToFavorites = createAsyncThunk<
  IProductMainPage,
  IProductMainPage,
  { rejectValue: string }
>("favoritesSlice/addToFavorites", async (product, { rejectWithValue }) => {
  try {
    const authToken = localStorage.getItem("AuthTokenMis");

    if (authToken) {
      const { user } = await postVerifyToken(authToken),
        data: IProductMainPage[] = await getFavorites(user),
        serverData = data.map(item => item.id);

      await patchUserFavorites(user, [...serverData, product.id]);
    }

    return product;
  } catch (error) {
    return rejectWithValue(`Failed add to favorites: ${error}`);
  }
});

export const deleteFromFavorites = createAsyncThunk<
  IProductMainPage,
  IProductMainPage,
  { rejectValue: string }
>(
  "favoritesSlice/deleteFromFavorites",
  async (product, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("AuthTokenMis");

      if (authToken) {
        const { user } = await postVerifyToken(authToken),
          data: IProductMainPage[] = await getFavorites(user),
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
