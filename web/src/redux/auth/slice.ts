import {createSlice} from "@reduxjs/toolkit";


export interface AuthState {
  accessToken: string | null,
  tokenType: string | null
}

export const initialAuthState: AuthState = {
  accessToken: null,
  tokenType: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.tokenType = action.payload.tokenType
    },
    clearToken: state => {
      state.accessToken = null
      state.tokenType = null
    }
  },
})
