import {createSlice} from "@reduxjs/toolkit";

export interface EditorState {
  title: string,
  lang: string,
  desc: string,
  content: string,
  attachment: string,
}

const initialState: EditorState = {
  title: '标题',
  lang: 'python',
  desc: '简介',
  content: `<p style="text-align: center;">正文</p><p style="text-align: center;">正文</p><p style="text-align: center;">正文</p><p style="text-align: center;">正文</p>`,
  attachment: '',
}


export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    dispatchTitle: (state, action) => {
      state.title = action.payload
    },
    dispatchLang: (state, action) => {
      state.lang = action.payload
    },
    dispatchDesc: (state, action) => {
      state.desc = action.payload
    },
    dispatchContent: (state, action) => {
      state.content = action.payload
    },
    dispatchAttachment: (state, action) => {
      state.attachment = action.payload
    },
  },
})