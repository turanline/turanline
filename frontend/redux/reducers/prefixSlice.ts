//Global
import { createSlice } from "@reduxjs/toolkit";

//Component Types
import { IPrefixConfig } from "@/types/componentTypes";

const initialState: IPrefixConfig = {
  code: "+7",
  name: "Russia",
  flag: "https://flagcdn.com/ru.svg",
  phone_mask: "(999) 999-99-99",
};

const prefixSlice = createSlice({
  name: "prefixSlice",
  initialState,
  reducers: {
    setPrefixConfig(state, action) {
      state.code = action.payload.code;
      state.name = action.payload.name;
      state.flag = action.payload.flag;
      state.phone_mask = action.payload.phone_mask;
    },
  },
});

export default prefixSlice.reducer;

export const { setPrefixConfig } = prefixSlice.actions;
