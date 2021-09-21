import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {AuthState} from "../auth/slice";
import {BUSINESS} from "../../utils/util";
import Api from "../../utils/api";

interface ProfileState {
  error: string | null,
  timelines: any,
  timelinesState: boolean,
  popularRepositories: any,
  popularRepositoriesState: boolean,
  contribution: any,
  contributionState: boolean,
  repositories: any,
  repositoriesState: boolean,
  repositoriesSort: string,
  repositoriesKeywords: string,
  follower: any,
  followerState: boolean,
  followerSort: string,
  followerKeywords: string,
  following: any,
  followingState: boolean,
  followingSort: string,
  followingKeywords: string,
  user: any,
  userState: boolean,
}

const initialState: ProfileState = {
  error: null,
  timelines: null,
  timelinesState: false,
  popularRepositories: null,
  popularRepositoriesState: false,
  contribution: null,
  contributionState: false,
  repositories: null,
  repositoriesState: false,
  repositoriesSort: 'publish_at',
  repositoriesKeywords: '',
  follower: null,
  followerState: false,
  followerSort: 'create_at',
  followerKeywords: '',
  following: null,
  followingState: false,
  followingSort: 'create_at',
  followingKeywords: '',
  user: null,
  userState: false,
}

export const getPopularRepositories = createAsyncThunk(
  'profile/getPopularRepositories',
  async (username: string) => {
    const {data} = await Api.http.get(`/user/${username}/repository/popular`)
    if (data.code === BUSINESS.OK) {
      return data
    }
    return []
  }
)

export const getContribution = createAsyncThunk(
  'profile/getContribution',
  async (username: string) => {
    const {data} = await Api.http.get(`/user/${username}/contribution`)
    if (data.code === BUSINESS.OK) {
      return data.data
    }
    return {}
  }
)

export const getTimeline = createAsyncThunk(
  'profile/getTimeline',
  async (params: { username: string, page: number }, thunkAPI) => {
    const {data} = await Api.http.get(`/timeline/${params.username}?page=${params.page}`)
    if (data.code === BUSINESS.OK) {
      const preTimelines = (thunkAPI.getState() as any).profile.timelines
      const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      let results: any[] = []
      if (preTimelines && params.page !== 1) results = JSON.parse(JSON.stringify(preTimelines.results))
      data.data.results.forEach((data: any) => {
        const date = new Date(data.create_at)
        if (results.length > 0) {
          let matchData = results.pop()
          if (matchData.year === date.getFullYear().toString() && matchData.month === monthList[date.getMonth()]) {
            matchData.body.push({
              action: data.action,
              obj: data.obj,
              date: data.create_at.slice(5, 10),
            })
            results.push(matchData)
          } else {
            results.push(matchData, {
              year: date.getFullYear().toString(),
              month: monthList[date.getMonth()],
              body: [{
                action: data.action,
                obj: data.obj,
                date: data.create_at.slice(5, 10),
              }]
            })
          }
        } else {
          results.push({
            year: date.getFullYear().toString(),
            month: monthList[date.getMonth()],
            body: [{
              action: data.action,
              obj: data.obj,
              date: data.create_at.slice(5, 10),
            }]
          })
        }
      })
      return {...data.data, results: results}
    }
    return {results: []}
  }
)

export const getRepositories = createAsyncThunk(
  'profile/getRepositories',
  async (params: { username: string, page: number, keywords?: string, auth: AuthState }, thunkAPI) => {
    const state = thunkAPI.getState() as any
    const {data} = await Api.http.get(`/user/${params.username}/repository?page=${params.page}&sort=${state.profile.repositoriesSort}&keywords=${state.profile.repositoriesKeywords}`, {
      headers: {'Authorization': params.auth.accessToken ? `${params.auth.tokenType} ${params.auth.accessToken}` : 'Bearer'}
    })
    if (data.code === BUSINESS.OK) {
      const preRepositories = state.profile.repositories
      let repositories: any[] = []
      if (preRepositories && params.page !== 1) repositories = JSON.parse(JSON.stringify(preRepositories.results))
      repositories = repositories.concat(data.data.results)
      return {...data.data, results: repositories}
    }
    return {results: []}
  }
)

export const getFollower = createAsyncThunk(
  'profile/getFollower',
  async (params: { username: string, page: number, auth: AuthState }, thunkAPI) => {
    const state = thunkAPI.getState() as any
    const {data} = await Api.http.get(`/user/${params.username}/friendship?page=${params.page}&q=followers&sort=${state.profile.followerSort}&keywords=${state.profile.followerKeywords}`, {
      headers: {'Authorization': params.auth.accessToken ? `${params.auth.tokenType} ${params.auth.accessToken}` : 'Bearer'}
    })
    if (data.code === BUSINESS.OK) {
      const preFollower = state.profile.follower
      let followers: any[] = []
      if (preFollower && params.page !== 1) followers = JSON.parse(JSON.stringify(preFollower.results))
      followers = followers.concat(data.data.results)
      return {...data, results: followers}
    }
    return {results: []}
  }
)

export const getFollowing = createAsyncThunk(
  'profile/getFollowing',
  async (params: { username: string, page: number, auth: AuthState }, thunkAPI) => {
    const state = thunkAPI.getState() as any
    const {data} = await Api.http.get(`/user/${params.username}/friendship?page=${params.page}&q=followings&sort=${state.profile.followingSort}&keywords=${state.profile.followingKeywords}`, {
      headers: {'Authorization': params.auth.accessToken ? `${params.auth.tokenType} ${params.auth.accessToken}` : 'Bearer'}
    })
    if (data.code === BUSINESS.OK) {
      const preFollowing = state.profile.following
      let followings: any[] = []
      if (preFollowing && params.page !== 1) followings = JSON.parse(JSON.stringify(preFollowing.results))
      followings = followings.concat(data.data.results)
      return {...data, results: followings}
    }
    return {results: []}
  }
)

export const getUser = createAsyncThunk(
  'profile/getUser',
  async (params: { username: string, auth: AuthState }) => {
    const {data} = await Api.http.get(`/user/${params.username}`, {
      headers: {'Authorization': params.auth.accessToken ? `${params.auth.tokenType} ${params.auth.accessToken}` : 'Bearer'}
    })
    if (data.code === BUSINESS.OK) {
      return data.data
    }
    return {}
  }
)

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearContent: (state) => {
      state.timelines = null
      state.timelinesState = false
      state.popularRepositories = null
      state.popularRepositoriesState = false
      state.contribution = null
      state.contributionState = false
      state.repositories = null
      state.repositoriesState = false
      state.repositoriesSort = 'publish_at'
      state.repositoriesKeywords = ''
      state.follower = null
      state.followerState = false
      state.followerSort = 'create_at'
      state.followerKeywords = ''
      state.following = null
      state.followingState = false
      state.followingSort = 'create_at'
      state.followingKeywords = ''
      state.user = null
      state.userState = false
      state.error = null
    },
    dispatchRepositoriesSort: (state, action) => {
      state.repositoriesSort = action.payload
    },
    dispatchRepositoriesKeywords: (state, action) => {
      state.repositoriesKeywords = action.payload
    },
    dispatchFollowerSort: (state, action) => {
      state.followerSort = action.payload
    },
    dispatchFollowerKeywords: (state, action) => {
      state.followerKeywords = action.payload
    },
    dispatchFollowingSort: (state, action) => {
      state.followingSort = action.payload
    },
    dispatchFollowingKeywords: (state, action) => {
      state.followingKeywords = action.payload
    },
  },
  extraReducers: {
    [getPopularRepositories.pending.type]: (state) => {
      state.popularRepositoriesState = true
    },
    [getPopularRepositories.fulfilled.type]: (state, action) => {
      state.popularRepositoriesState = false
      state.popularRepositories = action.payload
      state.error = null
    },
    [getPopularRepositories.rejected.type]: (state, action) => {
      state.popularRepositoriesState = false
      state.error = action.error
    },
    [getContribution.pending.type]: (state) => {
      state.contributionState = true
    },
    [getContribution.fulfilled.type]: (state, action) => {
      state.contributionState = false
      state.contribution = action.payload
      state.error = null
    },
    [getContribution.rejected.type]: (state, action) => {
      state.contributionState = false
      state.error = action.error
    },
    [getTimeline.pending.type]: (state) => {
      state.timelinesState = true
    },
    [getTimeline.fulfilled.type]: (state, action) => {
      state.timelinesState = false
      state.timelines = action.payload
      state.error = null
    },
    [getTimeline.rejected.type]: (state, action) => {
      state.timelinesState = false
      state.error = action.error
    },
    [getRepositories.pending.type]: (state) => {
      state.repositoriesState = true
    },
    [getRepositories.fulfilled.type]: (state, action) => {
      state.repositoriesState = false
      state.repositories = action.payload
      state.error = null
    },
    [getRepositories.rejected.type]: (state, action) => {
      state.repositoriesState = false
      state.error = action.error
    },
    [getFollower.pending.type]: (state) => {
      state.followerState = true
    },
    [getFollower.fulfilled.type]: (state, action) => {
      state.followerState = false
      state.follower = action.payload
      state.error = null
    },
    [getFollower.rejected.type]: (state, action) => {
      state.followerState = false
      state.error = action.error
    },
    [getFollowing.pending.type]: (state) => {
      state.followingState = true
    },
    [getFollowing.fulfilled.type]: (state, action) => {
      state.followingState = false
      state.following = action.payload
      state.error = null
    },
    [getFollowing.rejected.type]: (state, action) => {
      state.followingState = false
      state.error = action.error
    },
    [getUser.pending.type]: (state) => {
      state.userState = true
    },
    [getUser.fulfilled.type]: (state, action) => {
      state.userState = false
      state.user = action.payload
      state.error = null
    },
    [getUser.rejected.type]: (state, action) => {
      state.userState = false
      state.error = action.error
    },
  }
})