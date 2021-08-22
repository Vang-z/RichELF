import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../utils/api"

interface DatasetState {
  loading: boolean,
  error: string | null,
  mainContent: any,
  recommendContent: any,
  dataset: any
}

const initialState: DatasetState = {
  loading: false,
  error: null,
  mainContent: null,
  recommendContent: null,
  dataset: null,
}

export const getDatasets = createAsyncThunk(
  'dataset/getDatasets',
  async (page: number, thunkAPI) => {
    const {data} = await Api.getDatasets(page)
    const preDatasets = (thunkAPI.getState() as any).dataset.mainContent
    let datasets: any[] = []
    if (preDatasets) datasets = JSON.parse(JSON.stringify(preDatasets.data))
    datasets = datasets.concat(data.data)
    return {...data, data: datasets}
  }
)

export const getRecommendDatasets = createAsyncThunk(
  'dataset/getRecommendDatasets',
  async () => {
    const {data} = await Api.getRecommendDatasets()
    return data
  }
)

export const getDataset = createAsyncThunk(
  'dataset/getDataset',
  async (did: string) => {
    const {data} = await Api.getDataset(did)
    return data
  }
)

export const datasetSlice = createSlice({
  name: 'dataset',
  initialState,
  reducers: {
    clearContent: (state) => {
      state.loading = false
      state.mainContent = null
      state.recommendContent = null
      state.error = null
      state.dataset = null
    }
  },
  extraReducers: {
    [getDatasets.pending.type]: (state) => {
      state.loading = true
    },
    [getDatasets.fulfilled.type]: (state, action) => {
      state.loading = false
      state.mainContent = action.payload
      state.error = null
    },
    [getDatasets.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getRecommendDatasets.fulfilled.type]: (state, action) => {
      state.loading = false
      state.recommendContent = action.payload
      state.error = null
    },
    [getRecommendDatasets.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getDataset.pending.type]: (state) => {
      state.loading = true
    },
    [getDataset.fulfilled.type]: (state, action) => {
      state.loading = false
      state.dataset = action.payload
      state.error = null
    },
    [getDataset.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
  }
})