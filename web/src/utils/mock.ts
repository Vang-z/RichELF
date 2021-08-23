import mock from "mockjs";
import {v4 as uuid4} from "uuid";
import {
  activity,
  articlePreview,
  article,
  datasetPreview,
  dataset,
  tending,
  user,
  contributions,
  timelines
} from "../assets/fake_data/search";

const activityData = activity.sort((a, b) => {
  return Date.parse(b.date) - Date.parse(a.date);
})

mock.mock(RegExp('/api/moments.*'), 'get', (e: any) => {
  const page = parseInt(e.url.split('/').pop())
  const pageSize = 10
  const moments = activityData.slice((page - 1) * pageSize, page * pageSize)
  return {
    data: moments,
    page: page,
    nextPage: moments.length === pageSize ? page + 1 : null
  }
})

mock.mock(RegExp('/api/articles.*'), 'get', (e: any) => {
  const page = parseInt(e.url.split('/').pop())
  const pageSize = 10
  const articles = articlePreview.slice(page * pageSize, (page + 1) * pageSize)
  const nextPage = articles.length === pageSize ? page + 1 : null
  return {
    data: articles,
    page: page,
    nextPage: nextPage
  }
})

mock.mock(RegExp('/api/recommendArticles.*'), 'get', () => {
  const seed = Math.floor(Math.random() * 95 + 1)
  const articles = articlePreview.slice(seed, seed + 3)
  return {
    data: articles
  }
})

mock.mock(RegExp('/api/article.*'), 'get', () => {
  return {
    data: article,
  }
})

mock.mock(RegExp('/api/uuid.*'), 'get', () => {
  return {
    data: uuid4(),
  }
})

mock.mock(RegExp('/api/datasets.*'), 'get', (e: any) => {
  const page = parseInt(e.url.split('/').pop())
  const pageSize = 10
  const datasets = datasetPreview.slice(page * pageSize, (page + 1) * pageSize)
  const nextPage = datasets.length === pageSize ? page + 1 : null
  return {
    data: datasets,
    page: page,
    nextPage: nextPage
  }
})

mock.mock(RegExp('/api/recommendDatasets.*'), 'get', () => {
  const seed = Math.floor(Math.random() * 95 + 1)
  const datasets = datasetPreview.slice(seed, seed + 3)
  return {
    data: datasets
  }
})

mock.mock(RegExp('/api/dataset.*'), 'get', () => {
  return {
    data: dataset,
  }
})

mock.mock(RegExp('/api/keywords/tendingKeywords'), 'get', () => {
  return {
    data: tending,
  }
})

mock.mock(RegExp('/api/keywords/tendingUser'), 'get', () => {
  const seed = Math.floor(Math.random() * 20 + 1)
  return {
    data: user.slice(seed, seed + 10)
  }
})

mock.mock(RegExp('/api/keywords/preSearchArticles'), 'get', () => {
  const seed = Math.floor(Math.random() * 90 + 1)
  return {
    data: articlePreview.slice(seed, seed + 3),
  }
})

mock.mock(RegExp('/api/keywords/preSearchUsers'), 'get', () => {
  const seed = Math.floor(Math.random() * 20 + 1)
  return {
    data: user.slice(seed, seed + 10)
  }
})

mock.mock(RegExp('/api/keywords/article.*'), 'get', (e: any) => {
  const page = parseInt(e.url.split('/').pop())
  const pageSize = 10
  const articles = articlePreview.slice(page * pageSize, (page + 1) * pageSize)
  const nextPage = articles.length === pageSize ? page + 1 : null
  return {
    data: articles,
    page: page,
    nextPage: nextPage
  }
})

mock.mock(RegExp('/api/keywords/dataset.*'), 'get', (e: any) => {
  const page = parseInt(e.url.split('/').pop())
  const pageSize = 10
  const datasets = datasetPreview.slice(page * pageSize, (page + 1) * pageSize)
  const nextPage = datasets.length === pageSize ? page + 1 : null
  return {
    data: datasets,
    page: page,
    nextPage: nextPage
  }
})

mock.mock(RegExp('/api/keywords/user.*'), 'get', (e: any) => {
  const page = parseInt(e.url.split('/').pop())
  const pageSize = 10
  const users = user.slice(page * pageSize, (page + 1) * pageSize)
  const nextPage = users.length === pageSize ? page + 1 : null
  return {
    data: users,
    page: page,
    nextPage: nextPage
  }
})

mock.mock(RegExp('/api/user/profile/popularRepositories.*'), 'get', (e: any) => {
  const seed = Math.floor(Math.random() * 90 + 1)
  return {
    data: articlePreview.slice(seed, seed + 2),
  }
})

mock.mock(RegExp('/api/user/profile/contribution.*'), 'get', (e: any) => {
  return {
    data: contributions
  }
})

mock.mock(RegExp('/api/user/profile/timeline.*'), 'get', (e: any) => {
  const page = parseInt(e.url.split('/').pop())
  const pageSize = 5
  const timeline = timelines.slice((page - 1) * pageSize, page * pageSize)
  return {
    data: timeline,
    page: page,
    nextPage: timeline.length === pageSize ? page + 1 : null
  }
})

mock.mock(RegExp('/api/user/profile/repositories.*'), 'get', (e: any) => {
  const page = parseInt(e.url.split('/').pop())
  const pageSize = 5
  const preview = [...articlePreview, ...datasetPreview].sort(() => {
    return .5 - Math.random()
  }).slice(0, 20)
  const repositories = preview.slice((page - 1) * pageSize, page * pageSize)
  return {
    data: repositories,
    page: page,
    nextPage: repositories.length === pageSize ? page + 1 : null
  }
})

mock.mock(RegExp('/api/user/profile/follower.*'), 'get', (e: any) => {
  const page = parseInt(e.url.split('/').pop())
  const pageSize = 5
  const follower = user.slice((page - 1) * pageSize, page * pageSize)
  return {
    data: follower,
    page: page,
    nextPage: follower.length === pageSize ? page + 1 : null
  }
})

mock.mock(RegExp('/api/user/profile/following.*'), 'get', (e: any) => {
  const page = parseInt(e.url.split('/').pop())
  const pageSize = 5
  const preview = [...user].filter((e) => {
    return e.followed
  })
  const following = preview.slice((page - 1) * pageSize, page * pageSize)
  return {
    data: following,
    page: page,
    nextPage: following.length === pageSize ? page + 1 : null
  }
})

mock.mock(RegExp('/api/user/profile/user.*'), 'get', (e: any) => {
  const username = e.url.split('/').pop()
  const followed = Math.random() >= 0.5
  return {
    data: {
      'username': username,
      'followed': followed,
    },
  }
})
