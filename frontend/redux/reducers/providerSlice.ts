//Global
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//Services
import { postProviderRegistration } from "@/services/providersAPI";

//Types
import { IProviderState, IPostRegistrationProvider } from "@/types/types";

const initialState: IProviderState = {
  providerState: null,
  isAuth: false,
  status: "pending",
};

export const registrationProvider = createAsyncThunk<
  undefined,
  IPostRegistrationProvider,
  { rejectValue: string }
>(
  "providerSlice/registrationProvider",
  async (providerInformation, { rejectWithValue }) => {
    try {
      await postProviderRegistration(providerInformation);
    } catch (error) {
      return rejectWithValue(`${error}`);
    }
  }
);

const providerSlice = createSlice({
  name: "providerSlice",
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(registrationProvider.pending, state => {
        state.status = "pending";
      })
      .addCase(registrationProvider.fulfilled, state => {
        state.status = "fulfilled";
      })
      .addCase(registrationProvider.rejected, state => {
        state.status = "fulfilled";
        state.isAuth = false;
      }),
});

export default providerSlice.reducer;
