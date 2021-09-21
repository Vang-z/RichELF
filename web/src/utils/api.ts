import axios, {AxiosInstance} from "axios";

export const BASE_URL = 'http://127.0.0.1:8080/api/v1'

class Api {
  public http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: BASE_URL,
      timeout: 5000
    })
  }

  searchArticles(keywords: string, page: number) {
    const url = `/api/keywords/article/${keywords}/${page}`
    return this.http.get(url)
  }

  searchUsers(keywords: string, page: number) {
    const url = `/api/keywords/user/${keywords}/${page}`
    return this.http.get(url)
  }
}

export default new Api()
