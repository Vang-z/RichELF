import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../utils/api"

interface ArticleState {
  loading: boolean,
  error: string | null,
  mainContent: any,
  recommendContent: any,
  article: any
}

const initialState: ArticleState = {
  loading: false,
  error: null,
  mainContent: null,
  recommendContent: null,
  article: null,
}

export const getArticles = createAsyncThunk(
  'article/getArticles',
  async (page: number, thunkAPI) => {
    const {data} = await Api.getArticles(page)
    const preArticles = (thunkAPI.getState() as any).article.mainContent
    let datasets: any[] = []
    if (preArticles) datasets = JSON.parse(JSON.stringify(preArticles.data))
    datasets = datasets.concat(data.data)
    return {...data, data: datasets}
  }
)

export const getRecommendArticles = createAsyncThunk(
  'article/getRecommendArticles',
  async () => {
    const {data} = await Api.getRecommendArticles()
    return data
  }
)

export const getArticle = createAsyncThunk(
  'article/getArticle',
  async (aid: string) => {
    const {data} = await Api.getArticle(aid)
    return data
  }
)

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    clearContent: (state) => {
      state.loading = false
      state.mainContent = null
      state.recommendContent = null
      state.error = null
      state.article = null
    }
  },
  extraReducers: {
    [getArticles.pending.type]: (state) => {
      state.loading = true
    },
    [getArticles.fulfilled.type]: (state, action) => {
      state.loading = false
      state.mainContent = action.payload
      state.error = null
    },
    [getArticles.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getRecommendArticles.fulfilled.type]: (state, action) => {
      state.loading = false
      state.recommendContent = action.payload
      state.error = null
    },
    [getRecommendArticles.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getArticle.pending.type]: (state) => {
      state.loading = true
    },
    [getArticle.fulfilled.type]: (state, action) => {
      state.loading = false
      state.article = action.payload
      state.error = null
    },
    [getArticle.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
  }
})