import React, {useCallback, useEffect} from "react";
import styles from "./Content.module.css"
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useSnackbar} from "notistack";
import jwt_decode from "jwt-decode";
import {useSelector} from "../../../redux/hooks";
import {getArticles, getRecommendArticles, articleSlice} from "../../../redux/article/slice";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";
import NearMeIcon from '@mui/icons-material/NearMe';
import SwapRightOutlined from "@ant-design/icons/SwapRightOutlined"

import {RangeDataPiker, DataPiker, ArticlePreview, ProcessBar} from "../../utils";

import {SizeProps, Medium, dateFormatHandler} from "../../../utils/util";
import Api from "../../../utils/api";


export const Content: React.FC<SizeProps> = ({size}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const mainArticles = useSelector(s => s.article.mainContent)
  const articleParams = useSelector(s => s.article.articleParams)
  const recommendArticles = useSelector(s => s.article.recommendContent)
  const loading = useSelector(s => s.article.loading)
  const auth = useSelector(s => s.auth)

  const loadingPages = useCallback(() => {
    const loadingMore = document.getElementById(`loadingMore`)
    if (loadingMore) {
      const offsetTop = loadingMore.offsetTop
      const scrollTop = document.documentElement.scrollTop
      const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

      if ((offsetTop - scrollTop <= viewPortHeight + 100) && mainArticles && mainArticles.next && !loading) {
        dispatch(getArticles(mainArticles.next))
      }
    }
  }, [dispatch, loading, mainArticles])

  useEffect(() => {
    document.addEventListener('scroll', loadingPages)
    return () => document.removeEventListener('scroll', loadingPages)
  }, [loadingPages])

  useEffect(() => {
    dispatch(getArticles(1))
    dispatch(getRecommendArticles())
    return () => {
      dispatch(articleSlice.actions.clearContent())
    }
  }, [dispatch])

  const filterHandler = () => {
    dispatch(getArticles(1))
  }

  const resetHandler = () => {
    dispatch(articleSlice.actions.dispatchArticleParams({start: '', end: ''}))
    dispatch(getArticles(1))
  }

  return <Fade in={true} timeout={500}>
    {
      size === Medium ?
        <Box className={styles.Container}>
          <Box>
            <Box className={styles.AppBarContainer}>
              <Box className={styles.TendingBar}>
                <Box className={styles.TendingBarTitle}>{t(`content.popularRecommend`)}</Box>
                {
                  recommendArticles && recommendArticles.map((article: any) => {
                    return <ArticlePreview
                      preSearch={true}
                      key={article.aid}
                      id={article.aid}
                      title={article.title}
                      desc={article.desc}
                      author={article.author}
                      date={dateFormatHandler('diff', article.publish_at)}
                      lang={article.lang}
                      commentCount={article.comment_count}
                      stars={article.stars}
                      views={article.views}
                      downloadCount={article.download_count}/>
                  })
                }
              </Box>
            </Box>
          </Box>
          <Box className={styles.Content}>
            <Box className={styles.ActionBar}>
              <Box className={styles.DateBox}>
                <RangeDataPiker
                  className={styles.DatePicker}
                  value={articleParams}
                  changeHandler={(e) => {
                    e && dispatch(articleSlice.actions.dispatchArticleParams({
                      start: dateFormatHandler('comm', e[0]._d).split(' ')[0],
                      end: dateFormatHandler('comm', e[1]._d).split(' ')[0],
                    }))
                  }}
                />
                <Button
                  className={styles.DateBtn} variant={"outlined"}
                  onClick={resetHandler}
                >{t(`content.reset`)}</Button>
                <Button
                  className={styles.DateBtn} variant={"outlined"}
                  onClick={filterHandler}
                >
                  {t(`content.filter`)}
                </Button>
              </Box>
              <Button
                className={styles.ActionBtn}
                variant={"outlined"}
                startIcon={<NearMeIcon/>}
                onClick={() => {
                  if (auth.accessToken) {
                    const user = jwt_decode(auth.accessToken) as any
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
                }}
              >{t(`searchResult.newArticle`)}</Button>
            </Box>
            {
              mainArticles && mainArticles.results.map((article: any) => {
                return <ArticlePreview
                  preSearch={false}
                  key={article.aid}
                  id={article.aid}
                  title={article.title}
                  desc={article.desc}
                  author={article.author}
                  date={dateFormatHandler('diff', article.publish_at)}
                  lang={article.lang}
                  commentCount={article.comment_count}
                  stars={article.stars}
                  views={article.views}
                  downloadCount={article.download_count}/>
              })
            }
            <Box p={2} id={`loadingMore`}>
              <Box className={styles.loadingMore}>
                {
                  mainArticles && mainArticles.next ?
                    <ProcessBar/> : mainArticles && mainArticles.count > 6 && <span>{t(`content.end`)}</span>
                }
              </Box>
            </Box>
          </Box>
        </Box> :
        <Box className={styles.ContainerMini}>
          <Box className={styles.DatePickerContainerMini}>
            <DataPiker
              placeholder={t(`content.startDate`)}
              value={articleParams.start}
              changeHandler={(e) => {
                e && dispatch(articleSlice.actions.dispatchArticleParams({
                  ...articleParams,
                  start: dateFormatHandler('comm', e._d).split(' ')[0],
                }))
              }}
            />
            <SwapRightOutlined style={{margin: '0 10px', color: 'rgba(255, 255, 255, 0.3)'}}/>
            <DataPiker
              placeholder={t(`content.endDate`)}
              value={articleParams.end}
              changeHandler={(e) => {
                e && dispatch(articleSlice.actions.dispatchArticleParams({
                  ...articleParams,
                  end: dateFormatHandler('comm', e._d).split(' ')[0],
                }))
              }}
            />
          </Box>
          <Box className={styles.DatePickerBtnContainerMini}>
            <ButtonGroup>
              <Button variant={"outlined"} onClick={resetHandler}>{t(`content.reset`)}</Button>
              <Button variant={"outlined"} onClick={filterHandler}>{t(`content.filter`)}</Button>
            </ButtonGroup>
          </Box>
          <Divider style={{width: '88%', margin: "0 auto"}}/>
          <Box className={styles.ContentMini}>
            {
              mainArticles && mainArticles.results.map((article: any) => {
                return <ArticlePreview
                  preSearch={false}
                  key={article.aid}
                  id={article.aid}
                  title={article.title}
                  desc={article.desc}
                  author={article.author}
                  date={dateFormatHandler('diff', article.publish_at)}
                  lang={article.lang}
                  commentCount={article.comment_count}
                  stars={article.stars}
                  views={article.views}
                  downloadCount={article.download_count}/>
              })
            }
          </Box>
          <Box p={2} id={`loadingMore`}>
            <Box className={styles.loadingMore}>
              {
                mainArticles && mainArticles.next ?
                  <ProcessBar/> : mainArticles && mainArticles.count > 6 && <span>{t(`content.end`)}</span>
              }
            </Box>
          </Box>
        </Box>
    }
  </Fade>
}
