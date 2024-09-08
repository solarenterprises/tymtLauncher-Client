import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";
import { IContactList } from "../../types/chatTypes";
import { createContact, deleteContact, fetchContactList } from "./ContactListApi";

const init: IContactList = {
  contacts: [],
};

const loadContactList: () => IContactList = () => {
  const data = tymtStorage.get(`contactList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`contactList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadContactList(),
  status: "contactList",
  msg: "",
};

export const fetchContactListAsync = createAsyncThunk("contactList/fetchContactListAsync", fetchContactList);
export const createContactAsync = createAsyncThunk("contactList/createContactAsync", createContact);
export const deleteContactAsync = createAsyncThunk("contactList/deleteContactAsync", deleteContact);

export const contactListSlice = createSlice({
  name: "contactList",
  initialState,
  reducers: {
    setContactList: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`contactList`, JSON.stringify(action.payload));
    },
    updateOneInContactList: (state, action) => {
      const index = state.data.contacts.findIndex((element) => element._id === action.payload.id);
      if (index < 0) {
        console.error("Failed to updateOneInContactList: can't find the contact in contactList");
        return;
      }
      state.data.contacts[index] = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchContactListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchContactListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to fetchContactListAsync: ", action.payload);
          return;
        }
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`contactList`, JSON.stringify(state.data));
        state.status = "contactList";
      })
      .addCase(createContactAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createContactAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to createContactAsync: ", action.payload);
          return;
        }
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`contactList`, JSON.stringify(state.data));
        state.status = "contactList";
      })
      .addCase(deleteContactAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteContactAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to deleteContactAsync: ", action.payload);
          return;
        }
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`contactList`, JSON.stringify(state.data));
        state.status = "contactList";
      });
  },
});

export const getContactList = (state: any) => state.contactList.data;
export const { setContactList, updateOneInContactList } = contactListSlice.actions;

export default contactListSlice.reducer;
