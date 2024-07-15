//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearTokens } from "@/services";

//Types
import { IChangeUserData, IInputsLogin } from "@/types/types";

//Redux Types
import { IUserInformationApi, IUserState } from "@/types/reduxTypes";

//Cookie
import { deleteCookie, getCookie } from "cookies-next";

//Services
import {
  postVerifyToken,
  postTokenRefresh,
  postLogIn,
  postLogOut,
} from "@/services/authAPI";
import {
  getUserData,
  postRegistration,
  changeUserData,
  getUserOrders,
  getUserReviews,
} from "@/services/usersAPI";

const initialState: IUserState = {
  userState: null,
  userOrders: [],
  userReviews: [],
  isAuth: false,
  status: "pending",
};

export const getUser = createAsyncThunk<
  any,
  undefined,
  { rejectValue: string }
>("userSlice/getUser", async (_, { rejectWithValue }) => {
  try {
    const token = getCookie("AuthTokenMis");

    if (!token) throw new Error("AuthToken not found");

    const { user } = await postVerifyToken(token);

    return await getUserData(user);
  } catch (error) {
    try {
      const refreshToken = getCookie("AuthTokenMisRef");

      if (!refreshToken) {
        clearTokens();
        throw new Error("RefreshToken not found");
      }

      const newToken = await postTokenRefresh(),
        { user } = await postVerifyToken(newToken);

      return await getUserData(user);
    } catch (refreshError: any) {
      clearTokens();
      return rejectWithValue(
        `Failed to refresh token: ${
          refreshError.response?.data || refreshError.message
        }`
      );
    }
  }
});

export const registrationUser = createAsyncThunk<
  undefined,
  Omit<IUserInformationApi, "address" | "company">,
  { rejectValue: string }
>("userSlice/registrationUser", async (information, { rejectWithValue }) => {
  try {
    await postRegistration(information);
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const logInUser = createAsyncThunk<
  any,
  IInputsLogin,
  { rejectValue: string }
>("userSlice/logInUser", async (information, { rejectWithValue }) => {
  try {
    await postLogIn(information);
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const logOutUser = createAsyncThunk<
  undefined,
  undefined,
  { rejectValue: string }
>("userSlice/logOutUser", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = getCookie("AuthTokenMisRef");

    if (refreshToken) await postLogOut(refreshToken);

    deleteCookie("AuthTokenMis");
    deleteCookie("AuthTokenMisRef");
  } catch (error) {
    return rejectWithValue(`Failed log out user: ${error}`);
  }
});

export const changeUserDataProfile = createAsyncThunk<
  IChangeUserData,
  IChangeUserData,
  { rejectValue: string }
>("userSlice/changeUserDataProfile", async (userData, { rejectWithValue }) => {
  try {
    const authToken = getCookie("AuthTokenMis");

    if (authToken) {
      const { user } = await postVerifyToken(authToken);

      await changeUserData(user, userData);
    }

    return userData;
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const getOrders = createAsyncThunk<
  IUserState["userOrders"],
  undefined,
  { rejectValue: string }
>("userSlice/getUserOrders", async (_, { rejectWithValue }) => {
  try {
    return await getUserOrders();
  } catch (error) {
    return rejectWithValue(`Failed fetch user orders: ${error}`);
  }
});

export const getReviews = createAsyncThunk<
  IUserState["userReviews"],
  undefined,
  { rejectValue: string }
>("userSlice/getUserReviews", async (_, { rejectWithValue }) => {
  try {
    return await getUserReviews();
  } catch (error) {
    return rejectWithValue(`Failed fetch user orders: ${error}`);
  }
});

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(getUser.pending, state => {
        state.status = "pending";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = "fulfilled";

        state.userState = action.payload;
        state.isAuth = true;
      })
      .addCase(getUser.rejected, state => {
        state.status = "fulfilled";
        state.isAuth = false;
        state.userState = null;

        clearTokens();
      })
      .addCase(logOutUser.pending, state => {
        state.status = "pending";
      })
      .addCase(logOutUser.fulfilled, state => {
        state.status = "fulfilled";

        state.userState = null;
        state.isAuth = false;
        state.userReviews = [];
        state.userOrders = [];
      })
      .addCase(registrationUser.pending, state => {
        state.status = "pending";
      })
      .addCase(registrationUser.fulfilled, state => {
        state.status = "fulfilled";
      })
      .addCase(registrationUser.rejected, state => {
        state.status = "fulfilled";
        state.isAuth = false;
      })
      .addCase(logInUser.pending, state => {
        state.status = "pending";
      })
      .addCase(logInUser.fulfilled, state => {
        state.status = "fulfilled";
        state.isAuth = true;
      })
      .addCase(logInUser.rejected, state => {
        state.status = "fulfilled";
        state.isAuth = false;
      })
      .addCase(changeUserDataProfile.pending, state => {
        state.status = "pending";
      })
      .addCase(changeUserDataProfile.fulfilled, (state, action) => {
        state.status = "fulfilled";

        const { address, company, user, phone_number } = action.payload;

        if (state.userState) {
          state.userState = {
            user: {
              first_name: user.first_name,
              last_name: user.last_name,
              email: state.userState.user.email,
              password: state.userState.user.password,
              username: state.userState.user.username,
              is_provider: false,
            },
            address,
            company,
            phone_number,
          };
        }
      })
      .addCase(getOrders.pending, state => {
        state.status = "pending";
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.userOrders = action.payload;
      })
      .addCase(getReviews.pending, state => {
        state.status = "pending";
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.userReviews = action.payload;
      }),
});

export default userSlice.reducer;
