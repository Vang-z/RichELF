import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {AuthState} from "../auth/slice";
import {BUSINESS} from "../../utils/util";
import Api from "../../utils/api";

interface ArticleState {
  loading: boolean,
  error: string | null,
  mainContent: any,
  recommendContent: any,
  article: any,
  articleParams: any
}

const initialState: ArticleState = {
  loading: false,
  error: null,
  mainContent: null,
  recommendContent: null,
  article: null,
  articleParams: {
    start: '',
    end: '',
  }
}

export const getArticles = createAsyncThunk(
  'article/getArticles',
  async (page: number, thunkAPI) => {
    const state = thunkAPI.getState() as any
    let {data} = await Api.http.get(`/article?page=${page}&start=${state.article.articleParams.start}&end=${state.article.articleParams.end}`)
    if (data.code === BUSINESS.OK) {
      data = data.data
      const preArticles = state.article.mainContent
      let articles: any[] = []
      if (preArticles && page !== 1) articles = JSON.parse(JSON.stringify(preArticles.results))
      articles = articles.concat(data.results)
      return {...data, results: articles}
    }
    return {results: []}
  }
)

export const getRecommendArticles = createAsyncThunk(
  'article/getRecommendArticles',
  async () => {
    const {data} = await Api.http.get(`/recommend`)
    if (data.code === BUSINESS.OK) {
      return data.data
    }
    return []
  }
)

export const getArticle = createAsyncThunk(
  'article/getArticle',
  async (params: { aid: string, auth: AuthState }) => {
    const {data} = await Api.http.get(`/article/${params.aid}`, {
      headers: {'Authorization': params.auth.accessToken ? `${params.auth.tokenType} ${params.auth.accessToken}` : 'Bearer'}
    })
    if (data.code === BUSINESS.OK) {
      return data.data
    }
    return null
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
      state.articleParams = {
        start: '',
        end: '',
      }
    },
    dispatchArticleParams: (state, action) => {
      state.articleParams = action.payload
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