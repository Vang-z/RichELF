import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage"
import {languageSlice} from "./lang/slice";
import {searchSlice} from "./search/slice";
import {editorSlice} from "./editor/slice";
import {loginBoxSlice} from "./loginBox/slice";
import {authSlice} from "./auth/slice";
import {sidebarSlice} from "./sidebar/slice";
import {momentsSlice} from "./moments/slice";
import {articleSlice} from "./article/slice";
import {profileSlice} from "./profile/slice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['language', 'auth']
}

const rootReducer = combineReducers({
  language: languageSlice.reducer,
  search: searchSlice.reducer,
  editor: editorSlice.reducer,
  loginBox: loginBoxSlice.reducer,
  auth: authSlice.reducer,
  sidebar: sidebarSlice.reducer,
  moments: momentsSlice.reducer,
  article: articleSlice.reducer,
  profile: profileSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware => [
    ...getDefaultMiddleware({serializableCheck: false})
  ]),
  devTools: true
})

export const persistedStore = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export default store;
