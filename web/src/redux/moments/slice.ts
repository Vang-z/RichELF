import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {dateFormatHandler, BUSINESS} from "../../utils/util";
import Api from "../../utils/api";

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
    let {data} = await Api.http.get(`/article?page=${page}&start=&end=`)
    if (data.code === BUSINESS.OK) {
      data = data.data
      const preMoments = (thunkAPI.getState() as any).moments.content
      let results: any[] = []
      if (preMoments && page !== 1) results = JSON.parse(JSON.stringify(preMoments.results))
      data.results.forEach((data: any) => {
        const date = new Date(data.publish_at)
        if (results.length > 0) {
          let matchData = results.pop()
          if (matchData.year === date.getFullYear().toString() && matchData.month === (date.getMonth() + 1).toString() && matchData.day === date.getDate().toString()) {
            matchData.body.push({
              id: data.aid,
              title: data.title,
              author: data.author,
              date: data.publish_at,
              showDate: dateFormatHandler("comm", data.publish_at),
              desc: data.desc,
              snapshot: data.snapshot
            })
            results.push(matchData)
          } else {
            results.push(matchData, {
              year: date.getFullYear().toString(),
              month: (date.getMonth() + 1).toString(),
              day: date.getDate().toString(),
              body: [{
                id: data.aid,
                title: data.title,
                author: data.author,
                date: data.publish_at,
                showDate: dateFormatHandler("comm", data.publish_at),
                desc: data.desc,
                snapshot: data.snapshot
              }]
            })
          }
        } else {
          results.push({
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString(),
            day: date.getDate().toString(),
            body: [{
              id: data.aid,
              title: data.title,
              author: data.author,
              date: data.publish_at,
              showDate: dateFormatHandler("comm", data.publish_at),
              desc: data.desc,
              snapshot: data.snapshot
            }]
          })
        }
      })
      return {...data, results: results}
    }
    return {
      results: []
    }
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