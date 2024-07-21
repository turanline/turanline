//Global
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedLanguage: "RU",
};

const languageSlice = createSlice({
  name: "languageSlice",
  initialState,
  reducers: {
    setSelectedLanguage(state, action) {
      state.selectedLanguage = action.payload;
    },
  },
});

export const { setSelectedLanguage } = languageSlice.actions;

export default languageSlice.reducer;
