import {createSlice} from "@reduxjs/toolkit";
import i18n from "i18next";

export interface LanguageState {
  lang: 'en' | 'zh',
  languageList: { name: string, code: string }[]
}

const initialState: LanguageState = {
  lang: "zh",
  languageList: [
    {name: '中文', code: 'zh'},
    {name: 'English', code: 'en'},
  ]
}

export const code2name = (code: LanguageState['lang']) => {
  switch (code) {
    case "zh":
      return "中文"
    case "en":
      return 'English'
    default:
      return "中文"
  }
}

export const  languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.lang = action.payload
      i18n.changeLanguage(action.payload).then()
    }
  },
})
