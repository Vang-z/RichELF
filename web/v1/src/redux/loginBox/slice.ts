import {createSlice} from "@reduxjs/toolkit";

export interface LoginBoxState {
  open: boolean,
  type: 'register' | 'login'
}

const initialState: LoginBoxState = {
  open: false,
  type: "login"
}


export const loginBoxSlice = createSlice({
  name: 'loginBox',
  initialState,
  reducers: {
    dispatchOpen: (state, action) => {
      state.open = action.payload.open
      state.type = action.payload.type
    }
  },
})