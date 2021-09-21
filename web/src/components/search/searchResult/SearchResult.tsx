import React, {useEffect, useState, useCallback} from "react";
import styles from "./SearchResult.module.css"
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import {useSelector} from "../../../redux/hooks";
import {searchArticles, searchSlice, searchUsers} from "../../../redux/search/slice";
import jwt_decode from "jwt-decode";

import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import Autocomplete from '@mui/material/Autocomplete';

import NearMeIcon from '@mui/icons-material/NearMe';
import CloseIcon from "@mui/icons-material/Close";

import {ArticlePreview, UserPreview, ProcessBar} from "../../utils";
import Api from "../../../utils/api";
import {dateFormatHandler} from "../../../utils/util";


interface ActionBarProps {
  options: {
    name: string,
    id: number
  }[],
  actions?: {
    icon: React.ReactNode,
    action: string,
    label: string
  },
  category: 'article' | 'user'
}

const ActionBar: React.FC<ActionBarProps> = ({options, actions, category}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const auth = useSelector(s => s.auth)
  const keywords = useSelector(s => s.search.keywords)

  const actionHandler = () => {
    if (actions) {
      if (auth.accessToken) {
        const user = jwt_decode(auth.accessToken)
        if (!user.create_at) {
          enqueueSnackbar(t(`enqueueSnackbar.makeArticleWaitingForActive`), {
            variant: "warning",
            action: key => <IconButton
              disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
          })
          return
        }
        Api.http.post(`/article`, {}, {
          headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
        }).then(res => {
          history.push(`/user/${user.username}/article/${res.data.data}`)
        }).catch(() => {
          enqueueSnackbar(t(`enqueueSnackbar.makeArticleFailed`), {
            variant: "error",
            action: key => <IconButton
              disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
          })
        })
      } else {
        enqueueSnackbar(t(`enqueueSnackbar.makeArticleWaitingForLogin`), {
          variant: "warning",
          action: key => <IconButton
            disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
        })
      }
    }
  }

  return <>
    <Box className={styles.ActionBarContainer}>
      <Autocomplete
        className={styles.Selector}
        size={"small"}
        options={options}
        disableClearable={true}
        disablePortal={true}
        defaultValue={options[0]}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        renderInput={(params) =>
          <TextField
            {...params}
            label={`${t('searchResult.sort')}`}
            variant="outlined"
            disabled={true}
          />
        }
        classes={{
          paper: styles.SelectorPaper
        }}
        onChange={(event: any, value: any) => {
          switch (category) {
            case "article":
              dispatch(searchSlice.actions.dispatchArticleSort(value.sort))
              dispatch(searchArticles({keywords: keywords, page: 1}))
              return
            case "user":
              dispatch(searchSlice.actions.dispatchUserSort(value.sort))
              dispatch(searchUsers({keywords: keywords, page: 1, auth}))
              return;
          }
        }}
      />
      {actions && <Button
        className={styles.ActionBtn}
        variant={"outlined"}
        startIcon={actions.icon}
        onClick={actionHandler}
      >{actions.label}</Button>}
    </Box>
  </>
}


export const SearchResult: React.FC = () => {
  const {t} = useTranslation()
  const [tab, setTab] = useState(sessionStorage.getItem(`searchTab`) === null ? 0 : parseInt(sessionStorage.getItem(`searchTab`) as string))
  const dispatch = useDispatch()
  const keywords = useSelector(s => s.search.keywords)
  const articleContent = useSelector(s => s.search.articleContent)
  const articleState = useSelector(s => s.search.articleState)
  const userContent = useSelector(s => s.search.userContent)
  const userState = useSelector(s => s.search.userState)
  const auth = useSelector(s => s.auth)
  const articleOptions = [
    {name: `${t('searchResult.recentlyUpdated')}`, id: 0, sort: 'update_at'},
    {name: `${t('searchResult.mostStars')}`, id: 1, sort: 'stars'},
    {name: `${t('searchResult.mostViews')}`, id: 2, sort: 'views'},
    {name: `${t('searchResult.mostComments')}`, id: 3, sort: 'comments'},
  ];
  const userOptions = [
    {name: `${t('searchResult.mostPopular')}`, id: 0, sort: 'popular'},
    {name: `${t('searchResult.mostFollowers')}`, id: 1, sort: 'followers'},
    {name: `${t('searchResult.mostFollowings')}`, id: 2, sort: 'followings'},
  ];

  const loadingPages = useCallback(() => {
    const loadingMore = document.getElementById(`loadingMore`)
    if (loadingMore) {
      const offsetTop = loadingMore.offsetTop
      const scrollTop = document.documentElement.scrollTop
      const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

      if (offsetTop - scrollTop <= viewPortHeight + 100) {
        switch (tab) {
          case 0:
            if (articleContent && articleContent.next && !articleState) {
              dispatch(searchArticles({keywords: keywords, page: articleContent.next}))
            }
            break
          case 1:
            if (userContent && userContent.next && !userState) {
              dispatch(searchUsers({keywords: keywords, page: userContent.next, auth}))
            }
            break
        }
      }
    }
  }, [dispatch, tab, articleContent, articleState, userContent, userState, keywords, auth])

  useEffect(() => {
    document.addEventListener('scroll', loadingPages)
    return () => document.removeEventListener('scroll', loadingPages)
  }, [loadingPages])

  useEffect(() => {
    if (keywords) {
      dispatch(searchArticles({keywords: keywords, page: 1}))
      dispatch(searchUsers({keywords: keywords, page: 1, auth}))
    }
  }, [dispatch, keywords, auth])

  return <>
    <Box className={styles.Container}>
      <AppBar position="static">
        <Tabs
          value={tab}
          onChange={(e, value) => {
            setTab(value)
            sessionStorage.setItem('searchTab', value)
          }}
          variant={"standard"}
          className={styles.Tabs}
          classes={{
            indicator: styles.IndicatorColor
          }}
        >
          <Tab
            classes={{selected: styles.TabSelected}}
            label={t('searchResult.articles')}
            disableRipple={true}/>
          <Tab
            classes={{selected: styles.TabSelected}}
            label={t('searchResult.users')}
            disableRipple={true}/>
        </Tabs>
      </AppBar>
      <Box hidden={tab !== 0}>
        {
          tab === 0 && <Box className={styles.Content}>
            <ActionBar
              options={articleOptions} category={"article"}
              actions={{icon: <NearMeIcon/>, label: t(`searchResult.newArticle`), action: 'article'}}/>
            {
              articleContent && articleContent.results.map((article: any) => {
                return <ArticlePreview
                  preSearch={false}
                  key={article.aid}
                  id={article.aid}
                  title={article.title}
                  desc={article.desc}
                  author={article.author}
                  date={dateFormatHandler('comm', article.publish_at)}
                  lang={article.lang}
                  views={article.views}
                  commentCount={article.comment_count}
                  stars={article.stars}
                  downloadCount={article.download_count}/>
              })
            }
          </Box>
        }
      </Box>
      <Box hidden={tab !== 1}>
        {
          tab === 1 && <Box className={styles.Content}>
            <ActionBar options={userOptions} category={"user"}/>
            {
              userContent && userContent.results.map((user: any) => {
                return <UserPreview
                  key={user.uid}
                  uid={user.uid}
                  username={user.username}
                  avatar={user.avatar_url}
                  bio={user.bio}
                  articles={user.articles}
                  followers={user.followers}
                  followings={user.followings}
                  is_followed={user.is_followed}
                />
              })
            }
          </Box>
        }
      </Box>
      <Box p={2} id={`loadingMore`}>
        <Box className={styles.loadingMore}>
          {
            tab === 0 ? articleContent && articleContent.next !== null ?
                <ProcessBar/> : articleContent && articleContent.count > 6 &&
                <span>{`${t('searchResult.end')}`}</span> :
              userContent && userContent.next !== null ?
                <ProcessBar/> : userContent && userContent.count > 6 &&
                <span>{`${t('searchResult.end')}`}</span>
          }
        </Box>
      </Box>
    </Box>
  </>
}
