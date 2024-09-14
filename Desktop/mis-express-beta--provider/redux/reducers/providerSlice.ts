//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//Services
import {deleteProductBySlug,getAllProvidersGoods,getAllNotificationsByUserID,getProviderTimeLeft,getProvidersOrders,patchProductBySlug, getColorsAPI} from "@/services/providerAPI";
import {postVerifyToken,postTokenRefresh,postLogIn} from "@/services/authAPI";
import { getUserData, postRegistration, postLogOut } from "@/services/usersAPI";
import { getProviderNews, getProviderReviews } from "@/services/providerAPI";
import { clearTokens } from "@/services";
//Types
import {Color,ILogin,IPostRegistrationProvider,IProviderNewsObj,IProvidersGoods,IProvidersNotifications,IProvidersOrders} from "@/types/additionalTypes";
//Cookies
import { getCookie } from 'cookies-next';
//State`s Types
interface IUserState {
  providerState: IPostRegistrationProvider | null;
  providerNews: IProviderNewsObj[];
  providerReviews: [];
  isProviderAuth: boolean;
  status: "pending" | "fulfilled";
  providersGoods: IProvidersGoods[];
  providersNotifications: IProvidersNotifications;
  time_left: number;
  providersOrders: IProvidersOrders[];
  colors: Color[];
  registrationPageNumber: number;
  forgetPasswordState: boolean;
}

//State
const initialState: IUserState = {
  providerState: null,
  providerNews: [],
  providerReviews: [],
  providersGoods: [],
  time_left: 0,
  isProviderAuth: false,
  status: "pending",
  registrationPageNumber: 1,
  providersNotifications: {
    count: null,
    next: null,
    previous: null,
    results: [],
  },
  providersOrders: [],
  colors:[],
  forgetPasswordState: false,
};


//checkTokens
const verifyAndRefreshToken = async () => {
  // Get all tokens
  const token = getCookie("AuthTokenMis");
  const refreshToken = getCookie("AuthTokenMisRef");

  // Check if the token exists
  if (!token) {
    clearTokens();
    throw new Error("Токен не найден");
  }

  try {
    const {user} = await postVerifyToken(token);
    return user;

  } catch (error) {
    if (refreshToken) {
      try {
        const newToken = await postTokenRefresh();
        const { user } = await postVerifyToken(newToken);


        return user;
      } catch (refreshError) {
        clearTokens();
        throw new Error("Не удалось обновить токен");
      }
    } else {
      clearTokens();
      throw new Error("Токен обновления не найден");
    }
  }
};

//AuthFunctions
export const getUser = createAsyncThunk<any, undefined, { rejectValue: string }>("userSlice/getUser", async (_, { rejectWithValue }) => {
  try {
    const user = await verifyAndRefreshToken();
    return await getUserData(user);

  } catch (error: any) {
    return rejectWithValue(`Не удалось обновить токен: ${error.response?.data || error.message}`);
  }
});

export const registrationUser = createAsyncThunk<undefined,IPostRegistrationProvider,{ rejectValue: string }>("userSlice/registrationUser", async (information, { rejectWithValue }) => {
    try {
      await postRegistration(information);
    } catch (error) {
      return rejectWithValue(`${error}`);
    }
  });

export const logInUser = createAsyncThunk<any,ILogin,{ rejectValue: string }>("userSlice/logInUser", async (information, { rejectWithValue }) => {
  try {
    const loginData = await postLogIn(information);

    return loginData;
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const logOutUser = createAsyncThunk<undefined,undefined,{ rejectValue: string }>("userSlice/logOutUser", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = getCookie("AuthTokenMisRef");

    if (refreshToken) await postLogOut(refreshToken);

    clearTokens();
  } catch (error) {
    return rejectWithValue(`Failed log out user: ${error}`);
  }
});

//Provider Data Functions
export const getNews = createAsyncThunk<IProviderNewsObj[],undefined,{ rejectValue: string}>("providerSlice/getProviderNews", async (_, { rejectWithValue }) => {
  try {
    return await getProviderNews();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const getReviewsProvider = createAsyncThunk<[],undefined,{ rejectValue: string }>("providerSlice/getReviewsProvider", async (_, { rejectWithValue }) => {
  try {
    return await getProviderReviews();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const getAllProvidersGood = createAsyncThunk<IProvidersGoods[],undefined,{ rejectValue: string }>("providerSlice/getAllProvidersGoods", async (_, { rejectWithValue }) => {
  try {
    return await getAllProvidersGoods();
  
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const deleteProviderProduct = createAsyncThunk<string, string, { rejectValue: string }>("userSlice/deleteProviderProduct", async (slug, { rejectWithValue }) => {
  try {
    await deleteProductBySlug(slug);
    return slug;

  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const getProviderTime = createAsyncThunk<number,undefined,{ rejectValue: string }>("userSlice/getProviderTime", async (_, { rejectWithValue }) => {
  try {
    return await getProviderTimeLeft();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const getAllProvidersNotifications = createAsyncThunk<IProvidersNotifications,undefined,{ rejectValue: string }>("providerSlice/getAllProviderNotifications",async (_, { rejectWithValue }) => {
    try {
      return await getAllNotificationsByUserID();
    } catch (error) {
      return rejectWithValue(`${error}`);
    }
  }
);

export const getProviderOrders = createAsyncThunk< IProvidersOrders[],undefined,{ rejectValue: string }>("providerSlice/getProviderOrders", async (_, { rejectWithValue }) => {
  try {
    return await getProvidersOrders();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const changeProviderProduct = createAsyncThunk<undefined,string,{ rejectValue: string }>("providerSlice/changeProviderProduct", async (slug, { rejectWithValue }) => {
  try {
    await patchProductBySlug(slug, { status: "UC" });
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const getColors = createAsyncThunk<Color[],undefined,{ rejectValue: string }>("colorSlice/getColors", async (_, { rejectWithValue }) => {
  try {
    return await getColorsAPI();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});



const providerSlice = createSlice({
  name: "providerSlice",
  initialState,
  reducers: {
    setTimer(state, action) {
      state.time_left = action.payload;
    },
    setRegistrationPageNumber(state,action){
      state.registrationPageNumber = action.payload;
    },
    setForgetPassword(state,action){
      state.forgetPasswordState = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      //Get User
      .addCase(getUser.pending, state => {
        state.status = "pending";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.providerState = action.payload;
        state.isProviderAuth = true;
      })
      .addCase(getUser.rejected, (state,action) => {
        state.status = "fulfilled";
        state.isProviderAuth = false;
        state.providerState = null;
        clearTokens();
      })
      //LogOut
      .addCase(logOutUser.pending, state => {
        state.status = "pending";
      })
      .addCase(logOutUser.fulfilled, state => {
        state.status = "fulfilled";
        state.providerState = null;
        state.isProviderAuth = false;
      })
      //Registration
      .addCase(registrationUser.pending, state => {
        state.status = "pending";
      })
      .addCase(registrationUser.fulfilled, state => {
        state.status = "fulfilled";
      })
      .addCase(registrationUser.rejected, (state,action) => {
        state.status = "fulfilled";
        state.isProviderAuth = false;
      })
      //Login User
      .addCase(logInUser.pending, state => {
        state.status = "pending";
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.isProviderAuth = true;
      })
      .addCase(logInUser.rejected, (state,action) => {
        state.status = "fulfilled";
        state.isProviderAuth = false;
      })
      //Get News
      .addCase(getNews.pending, state => {
        state.status = "pending";
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.providerNews = action.payload;
      })
      //Provider Get Reviews
      .addCase(getReviewsProvider.pending, state => {
        state.status = "pending";
      })
      .addCase(getReviewsProvider.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.providerReviews = action.payload;
      })
      //Provider Get All Goods
      .addCase(getAllProvidersGood.pending, state => {
        state.status = "pending";
      })
      .addCase(getAllProvidersGood.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.providersGoods = action.payload;
      })
      //Provider Delete Product
      .addCase(deleteProviderProduct.pending, state => {
        state.status = "pending";
      })
      .addCase(deleteProviderProduct.fulfilled, state => {
        state.status = "fulfilled";
      })
      //Provider change Product
      .addCase(changeProviderProduct.pending, state => {
        state.status = "pending";
      })
      .addCase(changeProviderProduct.fulfilled, state => {
        state.status = "fulfilled";
      })
      //Provider Get Notifications
      .addCase(getAllProvidersNotifications.pending, state => {
        state.status = "pending";
      })
      .addCase(getAllProvidersNotifications.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.providersNotifications = action.payload;
      })
      //Provider Get Orders
      .addCase(getProviderOrders.pending, state => {
        state.status = "pending";
      })
      .addCase(getProviderOrders.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.providersOrders = action.payload;
      })
      //timer
      .addCase(getProviderTime.fulfilled, (state, action) => {
        // state.status = "fulfilled";
        state.time_left = action.payload; 
      })
      //color
      .addCase(getColors.pending, state => {
        state.status = "pending";
      })
      .addCase(getColors.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.colors = action.payload;
      })

});

export const { setTimer,setRegistrationPageNumber,setForgetPassword } = providerSlice.actions;

export default providerSlice.reducer;
