import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../utils/api"
import {dateFormatHandler} from "../../utils/util";

interface MomentsState {
  loading: boolean,
  error: string | null,
  content: any
}

const initialState: MomentsState = {
  loading: false,
  error: null,
  content: null,
}

export const getMoments = createAsyncThunk(
  'moments/getMoments',
  async (page: number, thunkAPI) => {
    const {data} = await Api.getMoments(page)
    const preMoments = (thunkAPI.getState() as any).moments.content
    let datasets: any[] = []
    if (preMoments) datasets = JSON.parse(JSON.stringify(preMoments.data))
    data.data.forEach((data: any) => {
      const date = new Date(data.date)
      if (preMoments) {
        let matchData = datasets.pop()
        if (matchData.year === date.getFullYear().toString() && matchData.month === (date.getMonth() + 1).toString() && matchData.day === date.getDate().toString()) {
          matchData.body.push({
            id: data.id,
            title: data.title,
            author: data.author,
            date: data.date,
            showDate: dateFormatHandler("comm", data.date),
            desc: data.desc,
            snapshot: data.snapshot
          })
          datasets.push(matchData)
        } else {
          datasets.push(matchData, {
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString(),
            day: date.getDate().toString(),
            body: [{
              id: data.id,
              title: data.title,
              author: data.author,
              date: data.date,
              showDate: dateFormatHandler("comm", data.date),
              desc: data.desc,
              snapshot: data.snapshot
            }]
          })
        }
      } else {
        datasets.push({
          year: date.getFullYear().toString(),
          month: (date.getMonth() + 1).toString(),
          day: date.getDate().toString(),
          body: [{
            id: data.id,
            title: data.title,
            author: data.author,
            date: data.date,
            showDate: dateFormatHandler("comm", data.date),
            desc: data.desc,
            snapshot: data.snapshot
          }]
        })
      }
    })
    return {...data, data: datasets}
  }
)

export const momentsSlice = createSlice({
  name: 'moments',
  initialState,
  reducers: {
    clearContent: (state) => {
      state.loading = false
      state.content = null
      state.error = null
    }
  },
  extraReducers: {
    [getMoments.pending.type]: (state) => {
      state.loading = true
    },
    [getMoments.fulfilled.type]: (state, action) => {
      state.loading = false
      state.content = action.payload
      state.error = null
    },
    [getMoments.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    }
  }
})