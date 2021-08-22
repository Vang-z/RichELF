import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Api from "../../utils/api";

export interface SearchState {
  keywords: string,
  loading: boolean,
  tendingKeywords: any,
  tendingUser: any,
  preSearchArticles: any,
  preSearchUsers: any,
  articleContent: any,
  datasetContent: any,
  userContent: any,
  error: string | null,
}

const initialState: SearchState = {
  keywords: '',
  loading: false,
  tendingKeywords: null,
  tendingUser: null,
  preSearchArticles: null,
  preSearchUsers: null,
  articleContent: null,
  datasetContent: null,
  userContent: null,
  error: null,
}

export const getTendingKeywords = createAsyncThunk(
  'search/getTendingKeywords',
  async () => {
    const {data} = await Api.getTendingKeywords()
    return data
  }
)

export const getTendingUser = createAsyncThunk(
  'search/getTendingUser',
  async () => {
    const {data} = await Api.getTendingUser()
    return data
  }
)

export const preSearchArticles = createAsyncThunk(
  'search/preSearchArticles',
  async () => {
    const {data} = await Api.preSearchArticles()
    return data
  }
)

export const preSearchUsers = createAsyncThunk(
  'search/preSearchUsers',
  async () => {
    const {data} = await Api.preSearchUsers()
    return data
  }
)

export const searchArticles = createAsyncThunk(
  'search/searchArticles',
  async (params: {
    keywords: string, page: number,
  }, thunkAPI) => {
    const {data} = await Api.searchArticles(params.keywords, params.page)
    const preDatasets = (thunkAPI.getState() as any).search.articleContent
    let datasets: any[] = []
    if (preDatasets) datasets = JSON.parse(JSON.stringify(preDatasets.data))
    datasets = datasets.concat(data.data)
    return {...data, data: datasets}
  }
)

export const searchDatasets = createAsyncThunk(
  'search/searchDatasets',
  async (params: {
    keywords: string, page: number,
  }, thunkAPI) => {
    const {data} = await Api.searchDatasets(params.keywords, params.page)
    const preDatasets = (thunkAPI.getState() as any).search.datasetContent
    let datasets: any[] = []
    if (preDatasets) datasets = JSON.parse(JSON.stringify(preDatasets.data))
    datasets = datasets.concat(data.data)
    return {...data, data: datasets}
  }
)

export const searchUsers = createAsyncThunk(
  'search/searchUsers',
  async (params: {
    keywords: string, page: number,
  }, thunkAPI) => {
    const {data} = await Api.searchUsers(params.keywords, params.page)
    const preDatasets = (thunkAPI.getState() as any).search.userContent
    let datasets: any[] = []
    if (preDatasets) datasets = JSON.parse(JSON.stringify(preDatasets.data))
    datasets = datasets.concat(data.data)
    return {...data, data: datasets}
  }
)

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    dispatchKeywords: (state, action) => {
      state.keywords = action.payload
    },
    clearSearch: (state) => {
      state.keywords = ''
      state.loading = false
      state.tendingKeywords = null
      state.tendingUser = null
      state.preSearchArticles = null
      state.preSearchUsers = null
      state.articleContent = null
      state.datasetContent = null
      state.userContent = null
      state.error = null
    }
  },
  extraReducers: {
    [getTendingKeywords.pending.type]: (state) => {
      state.loading = true
    },
    [getTendingKeywords.fulfilled.type]: (state, action) => {
      state.loading = false
      state.tendingKeywords = action.payload
      state.error = null
    },
    [getTendingKeywords.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getTendingUser.pending.type]: (state) => {
      state.loading = true
    },
    [getTendingUser.fulfilled.type]: (state, action) => {
      state.loading = false
      state.tendingUser = action.payload
      state.error = null
    },
    [getTendingUser.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [preSearchArticles.pending.type]: (state) => {
      state.loading = true
    },
    [preSearchArticles.fulfilled.type]: (state, action) => {
      state.loading = false
      state.preSearchArticles = action.payload
      state.error = null
    },
    [preSearchArticles.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [preSearchUsers.pending.type]: (state) => {
      state.loading = true
    },
    [preSearchUsers.fulfilled.type]: (state, action) => {
      state.loading = false
      state.preSearchUsers = action.payload
      state.error = null
    },
    [preSearchUsers.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [searchArticles.pending.type]: (state) => {
      state.loading = true
    },
    [searchArticles.fulfilled.type]: (state, action) => {
      state.loading = false
      state.articleContent = action.payload
      state.error = null
    },
    [searchArticles.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [searchDatasets.pending.type]: (state) => {
      state.loading = true
    },
    [searchDatasets.fulfilled.type]: (state, action) => {
      state.loading = false
      state.datasetContent = action.payload
      state.error = null
    },
    [searchDatasets.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [searchUsers.pending.type]: (state) => {
      state.loading = true
    },
    [searchUsers.fulfilled.type]: (state, action) => {
      state.loading = false
      state.userContent = action.payload
      state.error = null
    },
    [searchUsers.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
  }
})