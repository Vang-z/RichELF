import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {AuthState} from "../auth/slice";
import Api from "../../utils/api";
import {BUSINESS} from "../../utils/util";

export interface EditorState {
  title: string,
  lang: string,
  desc: string,
  publishAt: string,
  content: string,
  file: { filesize: number, filename: string, fid: string } | null,
  loading: boolean,
  error: string | null,
}

export const initialEditorState: EditorState = {
  title: '',
  lang: '',
  desc: '',
  publishAt: '',
  content: ``,
  file: null,
  loading: false,
  error: null
}

export const initialArticleState: EditorState = {
  title: '这就是一个像模像样的标题',
  lang: 'python',
  desc: '假装这是一个很不错的描述.',
  publishAt: '',
  content: `<h2 id="mcetoc_1fbgagcfco">题目描述</h2><p>使用 Python3 输出 hello RichELF。</p><h2 id="mcetoc_1fbgagcfcp">示例</h2><pre class="language-code"><code>输出：hello RichELF 。</code></pre><h2>解题代码</h2><pre class="language-code"><code>class Solution:
    def func() -&gt; None:
        print('hello RichELF')</code></pre><p>提交结果：</p><p><span class="mce-nbsp-wrap" contenteditable="false"></span><span class="mce-nbsp-wrap" contenteditable="false"></span><span class="mce-nbsp-wrap" contenteditable="false"></span><span class="mce-nbsp-wrap" contenteditable="false"></span><span style="font-size: 8pt;">执行用时：0ms 超过了 100% 的 Python3 提交记录 <br /><span class="mce-nbsp-wrap" contenteditable="false"></span><span class="mce-nbsp-wrap" contenteditable="false"></span><span class="mce-nbsp-wrap" contenteditable="false"></span><span class="mce-nbsp-wrap" contenteditable="false"></span><span class="mce-nbsp-wrap" contenteditable="false"></span>内存消耗：0MB 超过了 100% 的 Python3 提交记录</span></p><p style="text-align: right;"><span style="font-size: 8pt;">来源：RichELF</span><br /><span style="font-size: 8pt;">链接：<span style="color: #ecf0f1;"><a style="color: #ecf0f1;" href="https://richelf.tech" target="_blank" rel="noopener">https://richelf.tech</a></span></span></p>`,
  file: null,
  loading: false,
  error: null
}

export const getArticle = createAsyncThunk(
  'editor/getArticle',
  async (params: { aid: string, auth: AuthState }) => {
    const {data} = await Api.http.get(`/article/${params.aid}/base`, {
      headers: {'Authorization': params.auth.accessToken ? `${params.auth.tokenType} ${params.auth.accessToken}` : 'Bearer'}
    })
    if (data.code === BUSINESS.OK) {
      if (!data.data.title && !data.data.content && !data.data.desc && !data.data.lang && !data.data.publish_at) return initialArticleState
      return data.data
    }
    return {}
  }
)

export const editorSlice = createSlice({
  name: 'editor',
  initialState: initialEditorState,
  reducers: {
    dispatchTitle: (state, action) => {
      state.title = action.payload
    },
    dispatchLang: (state, action) => {
      state.lang = action.payload
    },
    dispatchDesc: (state, action) => {
      state.desc = action.payload
    },
    dispatchContent: (state, action) => {
      state.content = action.payload
    },
    dispatchFile: (state, action) => {
      state.file = action.payload
    },
    dispatchInit: (state, action) => {
      state.title = action.payload.title
      state.lang = action.payload.lang
      state.desc = action.payload.desc
      state.publishAt = action.payload.publishAt
      state.content = action.payload.content
      state.file = action.payload.file
      state.loading = action.payload.loading
      state.error = action.payload.error
    }
  },
  extraReducers: {
    [getArticle.pending.type]: (state) => {
      state.loading = true
    },
    [getArticle.fulfilled.type]: (state, action) => {
      state.loading = false
      state.title = action.payload.title ? action.payload.title : state.title
      state.lang = action.payload.lang ? action.payload.lang : state.lang
      state.desc = action.payload.desc ? action.payload.desc : state.desc
      state.publishAt = action.payload.publish_at ? action.payload.publish_at : state.publishAt
      state.content = action.payload.content ? action.payload.content : state.content
      state.file = action.payload.file ? action.payload.file : state.file
      state.error = null
    },
    [getArticle.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.error
    },
  }
})