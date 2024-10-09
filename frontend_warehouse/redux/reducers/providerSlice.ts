//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//Services
import {getAllCountries, getAllNotificationsByUserID,getProviderTimeLeft,getProviderNews, getProviderReviews } from "@/services/providerAPI";
import { getProviderBalance } from "@/services/usersAPI";
//Types
import {Color,IProvidersGoods,IProvidersNotifications,IProvidersOrders, IProviderNewsObj} from "@/types/additionalTypes";

//State`s Types

type balance = {
  uid: string;
  balance: string;
  created_datetime: string;
  provider: number;
};

interface IUserState {
  providerNews: IProviderNewsObj[];
  providerReviews: [];
  providerStatus: "pending" | "fulfilled";
  providersGoods: IProvidersGoods[];
  providersNotifications: IProvidersNotifications;
  time_left: number;
  providersOrders: IProvidersOrders[];
  colors: Color[];
  countries:{
    id: number;
    name: string;
    slug: string;
  }[];
  balance:balance;
}
//State
const initialState: IUserState = {
  providerNews: [],
  providerReviews: [],
  providersGoods: [],
  time_left: 0,
  providerStatus: "pending",
  providersNotifications: {
    count: null,
    next: null,
    previous: null,
    results: [],
  },
  providersOrders: [],
  colors:[],
  countries:[],
  balance: {
    uid: '',
    balance: '',
    created_datetime: '',
    provider: 0,
  }
};



//Provider Data Functions
export const getNews = createAsyncThunk<IProviderNewsObj[],undefined,{ rejectValue: string}>("providerSlice/getProviderNews", async (_, { rejectWithValue }) => {
  try {
    return await getProviderNews();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const getCountries = createAsyncThunk<any,string,{ rejectValue: string}>("providerSlice/getCountries", async (language, { rejectWithValue }) => {
  try {
    return await getAllCountries(language);
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

export const getProviderTime = createAsyncThunk<number,undefined,{ rejectValue: string }>("userSlice/getProviderTime", async (_, { rejectWithValue }) => {
  try {
    return await getProviderTimeLeft();
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});


export const getProviderAccountBalance = createAsyncThunk<balance,undefined,{ rejectValue: string }>("userSlice/getProviderBalance", async (_, { rejectWithValue }) => {
  try {
    return await getProviderBalance();
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




const providerSlice = createSlice({
  name: "providerSlice",
  initialState,
  reducers: {
    setTimer(state, action) {
      state.time_left = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      //Get News
      .addCase(getNews.pending, state => {
        state.providerStatus = "pending";
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.providerStatus = "fulfilled";
        state.providerNews = action.payload;
      })
      //Get countries
      .addCase(getCountries.pending, state => {
        state.providerStatus = "pending";
      })
      .addCase(getCountries.fulfilled, (state, action) => {
        state.providerStatus = "fulfilled";
        state.countries = action.payload;
      })
      //Get Balance
      .addCase(getProviderAccountBalance.pending, state => {
        state.providerStatus = "pending";
      })
      .addCase(getProviderAccountBalance.fulfilled, (state, action) => {
        state.providerStatus = "fulfilled";
        state.balance = action.payload;
      })
      //Provider Get Reviews
      .addCase(getReviewsProvider.pending, state => {
        state.providerStatus = "pending";
      })
      .addCase(getReviewsProvider.fulfilled, (state, action) => {
        state.providerStatus = "fulfilled";
        state.providerReviews = action.payload;
      })
      //Provider Get Notifications
      .addCase(getAllProvidersNotifications.pending, state => {
        state.providerStatus = "pending";
      })
      .addCase(getAllProvidersNotifications.fulfilled, (state, action) => {
        state.providerStatus = "fulfilled";
        state.providersNotifications = action.payload;
      })
      //timer
      .addCase(getProviderTime.fulfilled, (state, action) => {
        // state.status = "fulfilled";
        state.time_left = action.payload; 
      })
});

export const { setTimer } = providerSlice.actions;

export default providerSlice.reducer;
