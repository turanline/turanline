// //Global
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// //Services
// import { postVerifyToken } from "@/services/authAPI";
// import { getFavorites } from "@/services/favoritesAPI";

// //Types
// import { IFavoritesState, IProductMainPage } from "@/types/types";

// const initialState: IFavoritesState = {
//   favorites: [],
//   status: "pending",
// };

// export const fetchFavorites = createAsyncThunk<
//   IProductMainPage[],
//   undefined,
//   { rejectValue: string }
// >("favoritesSlice/fetchFavorites", async (_, { rejectWithValue }) => {
//   try {
//     const token = localStorage.getItem("AuthTokenMis");

//     if (token) {
//       const { user } = await postVerifyToken(token),
//         allFavorites = await getFavorites(user);

//       return allFavorites;
//     }
//   } catch (error) {
//     return rejectWithValue(`${error}`);
//   }
// });

// const favoritesSlice = createSlice({
//   name: "favoritesSlice",
//   initialState,
//   reducers: {},
//   extraReducers: builder =>
//     builder
//       .addCase(fetchFavorites.pending, state => {
//         state.status = "pending";
//       })
//       .addCase(fetchFavorites.fulfilled, (state, action) => {
//         state.status = "fulfilled";
//         state.favorites = action.payload;
//       }),
// });

// export default favoritesSlice.reducer;
