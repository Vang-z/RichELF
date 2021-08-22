import axios, {AxiosInstance} from "axios";

export const BASE_URL = 'http://127.0.0.1'


class Api {
  public http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: BASE_URL,
      timeout: 5000
    })
  }

  getMoments(page: number) {
    const url = `/api/moments/${page}`;
    return this.http.get(url)
  }

  getArticles(page: number) {
    const url = `/api/articles/${page}`;
    return this.http.get(url)
  }

  getRecommendArticles() {
    const url = `/api/recommendArticles`;
    return this.http.get(url)
  }

  getArticle(aid: string) {
    const url = `/api/article/${aid}`;
    return this.http.get(url)
  }

  getUUID() {
    const url = `/api/uuid`;
    return this.http.get(url)
  }

  getDatasets(page: number) {
    const url = `/api/datasets/${page}`;
    return this.http.get(url)
  }

  getRecommendDatasets() {
    const url = `/api/recommendDatasets`;
    return this.http.get(url)
  }

  getDataset(did: string) {
    const url = `/api/dataset/${did}`;
    return this.http.get(url)
  }

  getTendingKeywords() {
    const url = `/api/keywords/tendingKeywords`
    return this.http.get(url)
  }

  getTendingUser() {
    const url = `/api/keywords/tendingUser`
    return this.http.get(url)
  }

  preSearchArticles() {
    const url = `/api/keywords/preSearchArticles`
    return this.http.get(url)
  }

  preSearchUsers() {
    const url = `/api/keywords/preSearchUsers`
    return this.http.get(url)
  }

  searchArticles(keywords: string, page: number) {
    const url = `/api/keywords/article/${keywords}/${page}`
    return this.http.get(url)
  }

  searchDatasets(keywords: string, page: number) {
    const url = `/api/keywords/dataset/${keywords}/${page}`
    return this.http.get(url)
  }

  searchUsers(keywords: string, page: number) {
    const url = `/api/keywords/user/${keywords}/${page}`
    return this.http.get(url)
  }

  getPopularRepositories(username: string) {
    const url = `/api/user/profile/popularRepositories/${username}`
    return this.http.get(url)
  }

  getContribution(username: string) {
    const url = `/api/user/profile/contribution/${username}`
    return this.http.get(url)
  }

  getTimeline(username: string, page: number) {
    const url = `/api/user/profile/timeline/${username}/${page}`;
    return this.http.get(url)
  }

  getRepositories(username: string, page: number) {
    const url = `/api/user/profile/repositories/${username}/${page}`
    return this.http.get(url)
  }

  getFollower(username: string, page: number) {
    const url = `/api/user/profile/follower/${username}/${page}`
    return this.http.get(url)
  }

  getFollowing(username: string, page: number) {
    const url = `/api/user/profile/following/${username}/${page}`
    return this.http.get(url)
  }
}

export default new Api()
