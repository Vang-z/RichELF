import {articlePreview, datasetPreview, user} from "../../../assets/fake_data/search";

const PageSize = 12

export const getArticles = (page: number = 0) => {
  const articles = articlePreview.slice(page * PageSize, (page + 1) * PageSize)
  const nextPage = articles.length === PageSize ? page + 1 : null
  return {
    content: articles,
    page: page,
    nextPage: nextPage
  }
}

export const getDatasets = (page: number = 0) => {
  const datasets = datasetPreview.slice(page * PageSize, (page + 1) * PageSize)
  const nextPage = datasets.length === PageSize ? page + 1 : null
  return {
    content: datasets,
    page: page,
    nextPage: nextPage
  }
}

export const getUsers = (page: number = 0) => {
  const users = user.slice(page * PageSize, (page + 1) * PageSize)
  const nextPage = users.length === PageSize ? page + 1 : null
  return {
    content: users,
    page: page,
    nextPage: nextPage
  }
}

export interface ArticleProps {
  content: {
    id: string;
    title: string;
    date: string;
    desc: string;
    praise: string;
    comment: string;
    view: string;
    author: { username: string; avatar: string; };
    lang: string;
  }[];
  page: number;
  nextPage: number | null;
}

export interface DatasetProps {
  content: {
    id: string;
    title: string;
    date: string;
    desc: string;
    praise: string;
    download: string;
    comment: string;
    view: string;
    author: { username: string; avatar: string; };
  }[];
  page: number;
  nextPage: number | null;
}

export interface UserProps {
  content: {
    id: string;
    username: string,
    avatar: string,
    desc: string,
    article: number | string,
    dataset: number | string,
    praise: number | string,
    follower: number | string,
    following: number | string,
    followed: boolean
  }[];
  page: number;
  nextPage: number | null;
}

export * from "./ArticlePreview"
export * from "./DatasetPreview"
export * from "./UserPreview"
