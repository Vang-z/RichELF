import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import Api from "../../utils/api"

interface ProfileState {
  loading: boolean,
  error: string | null,
  timelines: any,
  popularRepositories: any,
  contribution: any,
  repositories: any,
  follower: any,
  following: any,
  user: any,
}

const initialState: ProfileState = {
  loading: false,
  error: null,
  timelines: null,
  popularRepositories: null,
  contribution: null,
  repositories: null,
  follower: null,
  following: null,
  user: null,
}

export const getPopularRepositories = createAsyncThunk(
  'profile/getPopularRepositories',
  async (username: string) => {
    const {data} = await Api.getPopularRepositories(username)
    return data
  }
)

export const getContribution = createAsyncThunk(
  'profile/getContribution',
  async (username: string) => {
    const {data} = await Api.getContribution(username)
    return data
  }
)

export const getTimeline = createAsyncThunk(
  'profile/getTimeline',
  async (params: { username: string, page: number }, thunkAPI) => {
    const {data} = await Api.getTimeline(params.username, params.page)
    const preTimelines = (thunkAPI.getState() as any).profile.timelines
    const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let datasets: any[] = []
    if (preTimelines) datasets = JSON.parse(JSON.stringify(preTimelines.data))
    data.data.forEach((data: any) => {
      const date = new Date(data.date)
      if (preTimelines) {
        let matchData = datasets.pop()
        if (matchData.year === date.getFullYear().toString() && matchData.month === monthList[date.getMonth()]) {
          matchData.body.push({
            action: data.action,
            obj: data.obj,
            date: data.date.slice(5),
            title: data.title
          })
          datasets.push(matchData)
        } else {
          datasets.push(matchData, {
            year: date.getFullYear().toString(),
            month: monthList[date.getMonth()],
            body: [{
              action: data.action,
              obj: data.obj,
              date: data.date.slice(5),
              title: data.title
            }]
          })
        }
      } else {
        datasets.push({
          year: date.getFullYear().toString(),
          month: monthList[date.getMonth()],
          body: [{
            action: data.action,
            obj: data.obj,
            date: data.date.slice(5),
            title: data.title
          }]
        })
      }
    })
    return {...data, data: datasets}
  }
)

export const getRepositories = createAsyncThunk(
  'profile/getRepositories',
  async (params: { username: string, page: number }, thunkAPI) => {
    const {data} = await Api.getRepositories(params.username, params.page)
    const preRepositories = (thunkAPI.getState() as any).profile.repositories
    let repositories: any[] = []
    if (preRepositories) repositories = JSON.parse(JSON.stringify(preRepositories.data))
    repositories = repositories.concat(data.data)
    return {...data, data: repositories}
  }
)

export const getFollower = createAsyncThunk(
  'profile/getFollower',
  async (params: { username: string, page: number }, thunkAPI) => {
    const {data} = await Api.getFollower(params.username, params.page)
    const preFollower = (thunkAPI.getState() as any).profile.follower
    let follower: any[] = []
    if (preFollower) follower = JSON.parse(JSON.stringify(preFollower.data))
    follower = follower.concat(data.data)
    return {...data, data: follower}
  }
)

export const getFollowing = createAsyncThunk(
  'profile/getFollowing',
  async (params: { username: string, page: number }, thunkAPI) => {
    const {data} = await Api.getFollowing(params.username, params.page)
    const preFollowing = (thunkAPI.getState() as any).profile.following
    let following: any[] = []
    if (preFollowing) following = JSON.parse(JSON.stringify(preFollowing.data))
    following = following.concat(data.data)
    return {...data, data: following}
  }
)

export const getUser = createAsyncThunk(
  'profile/getUser',
  async (username: string, thunkAPI) => {
    const {data} = await Api.getUser(username)
    return data
  }
)

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearContent: (state) => {
      state.loading = false
      state.timelines = null
      state.popularRepositories = null
      state.contribution = null
      state.repositories = null
      state.follower = null
      state.following = null
      state.user = null
      state.error = null
    }
  },
  extraReducers: {
    [getPopularRepositories.pending.type]: (state) => {
      state.loading = true
    },
    [getPopularRepositories.fulfilled.type]: (state, action) => {
      state.loading = false
      state.popularRepositories = action.payload
      state.error = null
    },
    [getPopularRepositories.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getContribution.pending.type]: (state) => {
      state.loading = true
    },
    [getContribution.fulfilled.type]: (state, action) => {
      state.loading = false
      state.contribution = action.payload
      state.error = null
    },
    [getContribution.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getTimeline.pending.type]: (state) => {
      state.loading = true
    },
    [getTimeline.fulfilled.type]: (state, action) => {
      state.loading = false
      state.timelines = action.payload
      state.error = null
    },
    [getTimeline.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getRepositories.pending.type]: (state) => {
      state.loading = true
    },
    [getRepositories.fulfilled.type]: (state, action) => {
      state.loading = false
      state.repositories = action.payload
      state.error = null
    },
    [getRepositories.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getFollower.pending.type]: (state) => {
      state.loading = true
    },
    [getFollower.fulfilled.type]: (state, action) => {
      state.loading = false
      state.follower = action.payload
      state.error = null
    },
    [getFollower.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getFollowing.pending.type]: (state) => {
      state.loading = true
    },
    [getFollowing.fulfilled.type]: (state, action) => {
      state.loading = false
      state.following = action.payload
      state.error = null
    },
    [getFollowing.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
    [getUser.pending.type]: (state) => {
      state.loading = true
    },
    [getUser.fulfilled.type]: (state, action) => {
      state.loading = false
      state.user = action.payload
      state.error = null
    },
    [getUser.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
  }
})