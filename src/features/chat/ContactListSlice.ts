import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
import { IContactList } from "../../types/chatTypes";
import {
  createContact,
  deleteContact,
  fetchContactList,
} from "./ContactListApi";

const init: IContactList = {
  contacts: [],
};

const loadContactList: () => IContactList = () => {
  const data = tymtStorage.get(`contactList`);
  if (!data) {
    tymtStorage.set(`contactList`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`contactList`, JSON.stringify(init));
      return init;
    }
  }
};

const initialState = {
  data: loadContactList(),
  status: "contactList",
  msg: "",
};

export const fetchContactListAsync = createAsyncThunk(
  "alertList/fetchContactListAsync",
  fetchContactList
);
export const createContactAsync = createAsyncThunk(
  "alertList/createContact",
  createContact
);
export const deleteContactAsync = createAsyncThunk(
  "alertList/deleteContact",
  deleteContact
);

export const contactListSlice = createSlice({
  name: "contactList",
  initialState,
  reducers: {
    setContactList: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`contactList`, JSON.stringify(action.payload));
    },
    updateOneInContactList: (state, action) => {
      const index = state.data.contacts.findIndex(
        (element) => element._id === action.payload.id
      );
      if (index < 0) {
        console.error(
          "Failed to updateOneInContactList: not found the contact in contactList"
        );
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
      .addCase(
        fetchContactListAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.data = { ...state.data, ...action.payload };
          tymtStorage.set(`contactList`, JSON.stringify(state.data));
          state.status = "contactList";
        }
      )
      .addCase(createContactAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        createContactAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.data = { ...state.data, ...action.payload };
          if (action.payload) {
            state.data = { ...state.data, ...action.payload };
          }
          tymtStorage.set(`contactList`, JSON.stringify(state.data));
          state.status = "contactList";
        }
      )
      .addCase(deleteContactAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        deleteContactAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.data = { ...state.data, ...action.payload };
          tymtStorage.set(`contactList`, JSON.stringify(state.data));
          state.status = "contactList";
        }
      );
  },
});

export const getContactList = (state: any) => state.contactList.data;
export const { setContactList, updateOneInContactList } =
  contactListSlice.actions;

export default contactListSlice.reducer;
