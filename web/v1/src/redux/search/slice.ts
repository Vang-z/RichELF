import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Api from "../../utils/api";
import {BUSINESS} from "../../utils/util";
import {AuthState} from "../auth/slice";

export interface SearchState {
  keywords: string,
  loading: boolean,
  tending: any,
  preSearch: any,
  articleContent: any,
  articleState: boolean,
  articleSort: string
  userContent: any,
  userState: boolean,
  userSort: string,
  error: string | null,
}

const initialState: SearchState = {
  keywords: '',
  loading: false,
  tending: null,
  preSearch: null,
  articleContent: null,
  articleState: false,
  articleSort: 'update_at',
  userContent: null,
  userState: false,
  userSort: 'popular',
  error: null,
}

export const getTending = createAsyncThunk(
  'search/getTending',
  async () => {
    const {data} = await Api.http.get(`/search/tending`)
    if (data.code === BUSINESS.OK) {
      return data.data
    }
    return {}
  }
)

export const preSearch = createAsyncThunk(
  'search/preSearch',
  async (keywords: string) => {
    const {data} = await Api.http.get(`/search/pre/${keywords}`)
    if (data.code === BUSINESS.OK) {
      return data.data
    }
    return {}
  }
)

export const searchArticles = createAsyncThunk(
  'search/searchArticles',
  async (params: {
    keywords: string, page: number
  }, thunkAPI) => {
    const state = thunkAPI.getState() as any
    const {data} = await Api.http.get(`/search/article/${params.keywords}?page=${params.page}&sort=${state.search.articleSort}`)
    if (data.code === BUSINESS.OK) {
      const preResults = state.search.articleContent
      let results: any[] = []
      if (preResults && params.page !== 1) results = JSON.parse(JSON.stringify(preResults.results))
      results = results.concat(data.data.results)
      return {...data.data, results: results}
    }
    return
  }
)

export const searchUsers = createAsyncThunk(
  'search/searchUsers',
  async (params: {
    keywords: string, page: number, auth: AuthState
  }, thunkAPI) => {
    const state = thunkAPI.getState() as any
    const {data} = await Api.http.get(`/search/user/${params.keywords}?page=${params.page}&sort=${state.search.userSort}`, {
      headers: {'Authorization': params.auth.accessToken ? `${params.auth.tokenType} ${params.auth.accessToken}` : 'Bearer'}
    })
    if (data.code === BUSINESS.OK) {
      const preResults = state.search.userContent
      let results: any[] = []
      if (preResults && params.page !== 1) results = JSON.parse(JSON.stringify(preResults.results))
      results = results.concat(data.data.results)
      return {...data.data, results: results}
    }
    return
  }
)

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    dispatchKeywords: (state, action) => {
      state.keywords = action.payload
    },
    dispatchArticleSort: (state, action) => {
      state.articleSort = action.payload
    },
    dispatchUserSort: (state, action) => {
      state.userSort = action.payload
    },
    clearSearch: (state) => {
      state.keywords = ''
      state.loading = false
      state.tending = null
      state.preSearch = null
      state.articleContent = null
      state.articleState = false
      state.articleSort = 'update_at'
      state.userContent = null
      state.userState = false
      state.userSort = 'popular'
      state.error = null
    }
  },
  extraReducers: {
    [getTending.pending.type]: (state) => {
      state.loading = true
    },
    [getTending.fulfilled.type]: (state, action) => {
      state.loading = false
      state.tending = action.payload
      state.error = null
    },
    [getTending.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [preSearch.pending.type]: (state) => {
      state.loading = true
    },
    [preSearch.fulfilled.type]: (state, action) => {
      state.loading = false
      state.preSearch = action.payload
      state.error = null
    },
    [preSearch.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [searchArticles.pending.type]: (state) => {
      state.articleState = true
    },
    [searchArticles.fulfilled.type]: (state, action) => {
      state.articleState = false
      state.articleContent = action.payload
      state.error = null
    },
    [searchArticles.rejected.type]: (state, action) => {
      state.articleState = false
      state.error = action.error
    },
    [searchUsers.pending.type]: (state) => {
      state.userState = true
    },
    [searchUsers.fulfilled.type]: (state, action) => {
      state.userState = false
      state.userContent = action.payload
      state.error = null
    },
    [searchUsers.rejected.type]: (state, action) => {
      state.userState = false
      state.error = action.error
    },
  }
})