//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//Services
import { getUserData, postRegistration, postLogOut,postLogIn } from "@/services/usersAPI";
import { clearTokens,verifyAndRefreshToken } from "@/services";
//Types
import {ILogin,IPostRegistrationProvider} from "@/types/additionalTypes";
//Cookies
import { getCookie } from 'cookies-next';
//State`s Types
interface IAuthState {
  providerState: IPostRegistrationProvider | null;
  isProviderAuth: boolean;
  status: "pending" | "fulfilled";
  registrationPageNumber: number;
  forgetPasswordState: boolean;
}

//State
const initialState: IAuthState = {
  providerState: null,
  isProviderAuth: false,
  status: "pending",
  registrationPageNumber: 1,
  forgetPasswordState: false,
};




//AuthFunctions
export const getUser = createAsyncThunk<any, undefined, { rejectValue: string }>("authorizationSlice/getUser", async (_, { rejectWithValue }) => {
  try {
    const user = await verifyAndRefreshToken();
    return await getUserData(user);

  } catch (error: any) {
    return rejectWithValue(`Не удалось обновить токен: ${error.response?.data || error.message}`);
  }
});

export const registrationUser = createAsyncThunk<any,IPostRegistrationProvider,{ rejectValue: string }>("authorizationSlice/registrationUser", async (information, { rejectWithValue }) => {
    try {
      const newUser = await postRegistration(information);

      return newUser;
    } catch (error) {
      return rejectWithValue(`${error}`);
    }
  });

export const logInUser = createAsyncThunk<any,ILogin,{ rejectValue: string }>("authorizationSlice/logInUser", async (information, { rejectWithValue }) => {
  try {
    const loginData = await postLogIn(information);
    await verifyAndRefreshToken();


    return loginData;
  } catch (error) {
    return rejectWithValue(`${error}`);
  }
});

export const logOutUser = createAsyncThunk<undefined,undefined,{ rejectValue: string }>("authorizationSlice/logOutUser", async (_, { rejectWithValue }) => {
  try {
    const refreshToken = getCookie("AuthTokenMisRef");

    if (refreshToken) await postLogOut(refreshToken);

    clearTokens();
  } catch (error) {
    return rejectWithValue(`Failed log out user: ${error}`);
  }
});



const authorizationSlice = createSlice({
  name: "authorizationSlice",
  initialState,
  reducers: {
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
});

export const { setRegistrationPageNumber,setForgetPassword } = authorizationSlice.actions;

export default authorizationSlice.reducer;
