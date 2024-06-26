//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearTokens } from "@/services";

//Types
import {
  IChangeUserData,
  IInputsLogin,
  IPostRegistrationProvider,
  IProviderNewsObj,
  IUserInformationApi,
  IUserState,
} from "@/types/types";

//Services
import {
  postVerifyToken,
  postTokenRefresh,
  postLogIn,
} from "@/services/authAPI";
import {
  getUserData,
  postRegistration,
  changeUserData,
  getUserOrders,
  getUserReviews,
  postLogOut,
  getProviderNews,
  getProviderReviews,
} from "@/services/usersAPI";

const initialState: IUserState = {
  userState: null,
  providerState: null,
  userOrders: [],
  userReviews: [],
  providerNews: [],
  providerReviews: [],
  isAuth: false,
  isProviderAuth: false,
  status: "pending",
};

export const getUser = createAsyncThunk<
  any,
  undefined,
  { rejectValue: string }
>("userSlice/getUser", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("AuthTokenMis");

    if (!token) throw new Error("AuthToken not found");

    const { user } = await postVerifyToken(token);

    return await getUserData(user, token);
  } catch (error) {
    try {
      const refreshToken = localStorage.getItem("AuthTokenMisRef");

      if (!refreshToken) {
        clearTokens();
        throw new Error("RefreshToken not found");
      }

      const newToken = await postTokenRefresh(refreshToken),
        { user } = await postVerifyToken(newToken);

      return await getUserData(user, newToken);
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
  {
    information: IUserInformationApi | IPostRegistrationProvider;
    requestString: "customer" | "provider";
  },
  { rejectValue: string }
>("userSlice/registrationUser", async (params, { rejectWithValue }) => {
  const { information, requestString } = params;

  try {
    await postRegistration(requestString, information);
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
    let info;

    await postLogIn(information).then(data => (info = data));

    return info;
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
    const refreshToken = localStorage.getItem("AuthTokenMisRef");

    if (refreshToken) await postLogOut(refreshToken);

    localStorage.removeItem("AuthTokenMis");
    localStorage.removeItem("AuthTokenMisRef");
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
    const authToken = localStorage.getItem("AuthTokenMis");

    if (authToken) {
      const { user } = await postVerifyToken(authToken);

      await changeUserData(user, userData, authToken);
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
    const token = localStorage.getItem("AuthTokenMis");

    if (token) {
      const { user } = await postVerifyToken(token);
      return await getUserOrders(user, token);
    }
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
    const token = localStorage.getItem("AuthTokenMis");

    if (token) {
      const { user } = await postVerifyToken(token);
      return await getUserReviews(user, token);
    }
  } catch (error) {
    return rejectWithValue(`Failed fetch user orders: ${error}`);
  }
});

export const getNews = createAsyncThunk<
  IProviderNewsObj[],
  undefined,
  { rejectValue: string }
>("userSlice/getProviderNews", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("AuthTokenMis");

    if (token) return await getProviderNews(token);
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const getReviewsProvider = createAsyncThunk<
  [],
  undefined,
  { rejectValue: string }
>("userSlice/getReviewsProvider", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("AuthTokenMis");

    if (token) {
      const { user } = await postVerifyToken(token);

      return await getProviderReviews(user, token);
    }
  } catch (error) {
    return rejectWithValue(`${error}`);
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

        if (!action.payload?.user.is_provider) {
          state.userState = action.payload;
          state.isAuth = true;
        } else {
          state.providerState = action.payload;
          state.isProviderAuth = true;
        }
      })
      .addCase(getUser.rejected, state => {
        state.status = "fulfilled";
        state.isAuth = false;
        state.isProviderAuth = false;
        state.userState = null;
        state.providerState = null;

        clearTokens();
      })
      .addCase(logOutUser.pending, state => {
        state.status = "pending";
      })
      .addCase(logOutUser.fulfilled, state => {
        state.status = "fulfilled";

        state.userState = null;
        state.providerState = null;
        state.isProviderAuth = false;
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
      .addCase(logInUser.fulfilled, (state, action) => {
        const { is_provider } = action.payload;

        state.status = "fulfilled";

        if (is_provider) state.isProviderAuth = true;
        else state.isAuth = true;
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
      })
      .addCase(getNews.pending, state => {
        state.status = "pending";
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.providerNews = action.payload;
      })
      .addCase(getReviewsProvider.pending, state => {
        state.status = "pending";
      })
      .addCase(getReviewsProvider.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.providerReviews = action.payload;
      }),
});

export default userSlice.reducer;
