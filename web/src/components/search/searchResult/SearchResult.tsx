import React, {useEffect, useState, useCallback} from "react";
import styles from "./SearchResult.module.css"
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {searchArticles, searchDatasets, searchUsers, searchSlice} from "../../../redux/search/slice";

import SwipeableViews from 'react-swipeable-views';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Autocomplete from '@material-ui/lab/Autocomplete';

import CreateIcon from '@material-ui/icons/Create';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import {ArticlePreview, DatasetPreview, UserPreview, ProcessBar} from "../../utils";
import Api from "../../../utils/api";


interface ActionBarProps {
  options: {
    name: string,
    id: number
  }[],
  actions?: {
    icon: React.ReactNode,
    action: string,
    label: string
  }
}

const ActionBar: React.FC<ActionBarProps> = ({options, actions}) => {
  const {t} = useTranslation()
  const history = useHistory()

  const actionHandler = () => {
    actions && Api.getUUID().then(res => {
      history.push(`/user/Vang_z/${actions.action}/${res.data.date}`)
    })
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
        getOptionSelected={(option, value) => option.id === value.id}
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
        onChange={(event: any, value: { name: string, id: number }) => {
          console.log(value)
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
  const datasetContent = useSelector(s => s.search.datasetContent)
  const userContent = useSelector(s => s.search.userContent)
  const loading = useSelector(s => s.search.loading)

  const articleOptions = [
    {name: `${t('searchResult.bestMatch')}`, id: 0},
    {name: `${t('searchResult.recentlyUpdated')}`, id: 1},
    {name: `${t('searchResult.mostStars')}`, id: 2},
    {name: `${t('searchResult.mostViews')}`, id: 3},
  ];
  const datasetOptions = [
    {name: `${t('searchResult.bestMatch')}`, id: 0},
    {name: `${t('searchResult.recentlyUpdated')}`, id: 1},
    {name: `${t('searchResult.mostDownloads')}`, id: 2},
    {name: `${t('searchResult.mostViews')}`, id: 3},
    {name: `${t('searchResult.mostStars')}`, id: 4},
  ];
  const userOptions = [
    {name: `${t('searchResult.bestMatch')}`, id: 0},
    {name: `${t('searchResult.mostFollowers')}`, id: 1},
    {name: `${t('searchResult.mostPopular')}`, id: 2},
  ];

  const loadingPages = useCallback(() => {
    const loadingMore = document.getElementById(`loadingMore`)
    if (loadingMore) {
      const offsetTop = loadingMore.offsetTop
      const scrollTop = document.documentElement.scrollTop
      const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

      if ((offsetTop - scrollTop <= viewPortHeight + 100) && !loading) {
        switch (tab) {
          case 0:
            if (articleContent && articleContent.nextPage) {
              dispatch(searchArticles({keywords: keywords, page: articleContent.nextPage}))
            }
            break
          case 1:
            if (datasetContent && datasetContent.nextPage) {
              dispatch(searchDatasets({keywords: keywords, page: datasetContent.nextPage}))
            }
            break
          case 2:
            if (userContent && userContent.nextPage) {
              dispatch(searchUsers({keywords: keywords, page: userContent.nextPage}))
            }
            break
        }
      }
    }
  }, [articleContent, datasetContent, userContent, dispatch, keywords, loading, tab])

  useEffect(() => {
    document.addEventListener('scroll', loadingPages)
    return () => document.removeEventListener('scroll', loadingPages)
  }, [loadingPages])

  useEffect(() => {
    dispatch(searchArticles({keywords: keywords, page: 1}))
    dispatch(searchDatasets({keywords: keywords, page: 1}))
    dispatch(searchUsers({keywords: keywords, page: 1}))
    return () => {
      dispatch(searchSlice.actions.clearSearch())
    }
  }, [dispatch, keywords])

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
            label={t('searchResult.datasets')}
            disableRipple={true}/>
          <Tab
            classes={{selected: styles.TabSelected}}
            label={t('searchResult.users')}
            disableRipple={true}/>
        </Tabs>
      </AppBar>
      <SwipeableViews
        index={tab}
        onChangeIndex={(value) => {
          setTab(value)
        }}>
        <Box hidden={tab !== 0}>
          {
            tab === 0 && <Box className={styles.Content}>
              <ActionBar options={articleOptions}
                         actions={{icon: <CreateIcon/>, label: t(`searchResult.newArticle`), action: 'article'}}/>
              {
                articleContent && articleContent.data.map((article: any) => {
                  return <ArticlePreview
                    preSearch={false}
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    desc={article.desc}
                    author={article.author}
                    date={article.date}
                    lang={article.lang}
                    comment={article.comment}
                    praise={article.praise}
                    view={article.view}/>
                })
              }
            </Box>
          }
        </Box>
        <Box hidden={tab !== 1}>
          {
            tab === 1 && <Box className={styles.Content}>
              <ActionBar options={datasetOptions}
                         actions={{icon: <CloudUploadIcon/>, label: t(`searchResult.newDataset`), action: 'dataset'}}/>
              {
                datasetContent && datasetContent.data.map((data: any) => {
                  return <DatasetPreview
                    key={data.id}
                    id={data.id}
                    title={data.title}
                    desc={data.desc}
                    author={data.author}
                    date={data.date}
                    download={data.download}
                    comment={data.comment}
                    praise={data.praise}
                    view={data.view}/>
                })
              }
            </Box>
          }
        </Box>
        <Box hidden={tab !== 2}>
          {
            tab === 2 && <Box className={styles.Content}>
              <ActionBar options={userOptions}/>
              {
                userContent && userContent.data.map((user: any) => {
                  return <UserPreview
                    key={user.id}
                    username={user.username}
                    avatar={user.avatar}
                    desc={user.desc}
                    article={user.article}
                    dataset={user.dataset}
                    praise={user.praise}
                    follower={user.follower}
                    following={user.following}
                    followed={user.followed}
                  />
                })
              }
            </Box>
          }
        </Box>
      </SwipeableViews>
      <Box p={2} id={`loadingMore`}>
        <Box className={styles.loadingMore}>
          {
            (tab === 0 && articleContent && articleContent.nextPage !== null) ||
            (tab === 1 && datasetContent && datasetContent.nextPage !== null) ||
            (tab === 2 && userContent && userContent.nextPage !== null) ?
              <ProcessBar/> : <span>{`${t('searchResult.end')}`}</span>
          }
        </Box>
      </Box>
    </Box>
  </>
}
