import {createSlice} from "@reduxjs/toolkit";

export interface UserProps {
  avatar: string,
  username: string,
  desc: string,
  link: string | null
}

export interface AuthState {
  token: string | null,
  user: UserProps | null
}

const initialState: AuthState = {
  token: null,
  user: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    clearToken: state => {
      state.token = null
      state.user = null
    }
  },
})
