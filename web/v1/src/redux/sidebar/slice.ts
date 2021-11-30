import {createSlice} from "@reduxjs/toolkit";

export interface SidebarState {
  open: boolean,
}

const initialState: SidebarState = {
  open: false,
}


export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    closeSidebar: state => {state.open = false},
    openSidebar: state => {state.open = true},
  },
})
