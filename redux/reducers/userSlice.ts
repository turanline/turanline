//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//Types
import { IChangeUserData, IInputsLoginPost } from "@/types/types";
//Redux Types
import { IUserInformationApi, ICartState } from "@/types/reduxTypes";
import { IOrderProduct } from "@/types/componentTypes";
//Cookies
import { getCookie } from "cookies-next";
//Services
import { postVerifyToken, postTokenRefresh, postLogIn, postLogOut } from "@/services/authAPI";
import { getUserData,postRegistration,changeUserData,getUserOrders,getUserReviews } from "@/services/usersAPI";
import { verifyAndRefreshToken } from "@/services";
import { clearTokens } from "@/services";

//Interfaces
interface IUserReviewState {
  id: number;
  product: IOrderProduct;
  text: string;
  created_datetime: string;
  user: number;
}
interface IUserState {
  userState: IUserInformationApi | null;
  userReviews: IUserReviewState[];
  userOrders: ICartState["cart"][];
  isAuth: boolean;
  status: "pending" | "fulfilled";
  registrationPageNumber: number;
  forgetPasswordState: boolean;
  paymentPageNumber: number;
}
//State
const initialState: IUserState = {
  userState: null,
  userReviews: [],
  userOrders: [],
  isAuth: false,
  status: "pending",
  registrationPageNumber: 1,
  paymentPageNumber: 1,
  forgetPasswordState: false,
};



export const getUser = createAsyncThunk<any,undefined,{ rejectValue: string }>("userSlice/getUser", async (_, { rejectWithValue }) => {
  try {
    const user = await verifyAndRefreshToken();
    
    if (!user) throw new Error("AuthToken not found");

    return await getUserData(user);
  } catch (error) {
    return rejectWithValue(`${error}`);
  } 
});

export const registrationUser = createAsyncThunk<any,IUserInformationApi,{ rejectValue: string }>("userSlice/registrationUser", async (information, { rejectWithValue }) => {
  try {
    const newUser = await postRegistration(information);

    return newUser;
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const logInUser = createAsyncThunk<any,IInputsLoginPost,{ rejectValue: string }>("userSlice/logInUser", async (information, { rejectWithValue }) => {
  try {
    const loginData = await postLogIn(information);
    await verifyAndRefreshToken();


    return loginData;
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const updateUserState = createAsyncThunk('user/updateUserState',async (newUserData: Partial<any>, { rejectWithValue }) => {
    try {
      return newUserData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logOutUser = createAsyncThunk<undefined,undefined,{ rejectValue: string }>("userSlice/logOutUser", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = getCookie("AuthTokenMisRef");

    if (refreshToken) await postLogOut(refreshToken);

    clearTokens();
  } catch (error) {
    return rejectWithValue(`Failed log out user: ${error}`);
  }
});


export const getOrders = createAsyncThunk<IUserState["userOrders"],undefined,{ rejectValue: string }>("userSlice/getUserOrders", async (_, { rejectWithValue }) => {
  try {
    return await getUserOrders();
  } catch (error) {
    return rejectWithValue(`Failed fetch user orders: ${error}`);
  }
});

export const getReviews = createAsyncThunk<IUserState["userReviews"],undefined,{ rejectValue: string }>("userSlice/getUserReviews", async (_, { rejectWithValue }) => {
  try {
    return await getUserReviews();
  } catch (error) {
    return rejectWithValue(`Failed fetch user orders: ${error}`);
  }
});

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setRegistrationPageNumber(state,action){
      state.registrationPageNumber = action.payload;
    },
    setForgetPassword(state,action){
      state.forgetPasswordState = action.payload;
    },
    setPaymenPageNumber(state,action){
      state.paymentPageNumber = action.payload;
    }
  },
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
      .addCase(updateUserState.fulfilled, (state, action) => {
        if (state.userState) {
          state.userState = {
            ...state.userState,
            user: {
              ...state.userState.user,
              ...action.payload.user,
            },
            company: action.payload.company ?? state.userState.company,
            address: action.payload.address ?? state.userState.address,
          };
        }
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
export const { setRegistrationPageNumber ,setForgetPassword,setPaymenPageNumber} = userSlice.actions;

export default userSlice.reducer;
