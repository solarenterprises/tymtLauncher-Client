import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import randomavatar1 from "../../assets/account/randomavatar1.png";
import { loginEnum, walletEnum, accountType } from "../../types/accountTypes";
import { updateUser } from "./AccountApi";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

export const updateUserAsync = createAsyncThunk("update/user", updateUser);

const init: accountType = {
  mode: loginEnum.login,
  wallet: walletEnum.noncustodial,
  agreedTerms: false,
  uid: "",
  avatar: randomavatar1,
  accessToken: "",
  isLoggedIn: false,
};

const loadAccount: () => accountType = () => {
  const data = tymtStorage.get(`account`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadAccount(),
  status: "account",
  msg: "",
};

// export const updateLanguageAsync = createAsyncThunk('update/language', updateLanguage);
export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`account`, JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.msg = "We will contat you as soon as possible";
      });
  },
});

export const getAccount = (state: any) => state.account.data;
export const { setAccount } = accountSlice.actions;

export default accountSlice.reducer;
