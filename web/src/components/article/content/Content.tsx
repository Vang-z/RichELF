import React, {useCallback, useEffect} from "react";
import styles from "./Content.module.css"
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {getArticles, getRecommendArticles, articleSlice} from "../../../redux/article/slice";

import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Fade from "@material-ui/core/Fade";

import CreateIcon from '@material-ui/icons/Create';
import SwapRightOutlined from "@ant-design/icons/SwapRightOutlined"

import {RangeDataPiker, DataPiker, ArticlePreview, ProcessBar} from "../../utils";

import {SizeProps, Medium} from "../../../utils/util";
import Api from "../../../utils/api";


export const Content: React.FC<SizeProps> = ({size}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const mainArticles = useSelector(s => s.article.mainContent)
  const recommendArticles = useSelector(s => s.article.recommendContent)
  const loading = useSelector(s => s.article.loading)

  const loadingPages = useCallback(() => {
    const loadingMore = document.getElementById(`loadingMore`)
    if (loadingMore) {
      const offsetTop = loadingMore.offsetTop
      const scrollTop = document.documentElement.scrollTop
      const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

      if ((offsetTop - scrollTop <= viewPortHeight + 100) && mainArticles && mainArticles.nextPage && !loading) {
        dispatch(getArticles(mainArticles.nextPage))
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

  return <Fade in={true} timeout={500}>
    {
      size === Medium ?
        <Box className={styles.Container}>
          <Box>
            <Box className={styles.AppBarContainer}>
              <Box className={styles.TendingBar}>
                <Box className={styles.TendingBarTitle}>{t(`content.popularRecommend`)}</Box>
                {
                  recommendArticles && recommendArticles.data.map((article: any) => {
                    return <ArticlePreview
                      preSearch={true}
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
            </Box>
          </Box>
          <Box className={styles.Content}>
            <Box className={styles.ActionBar}>
              <Box className={styles.DateBox}>
                <RangeDataPiker
                  className={styles.DatePicker}
                  changeHandler={(e) => {
                    console.log(e)
                  }}
                />
                <Button className={styles.DateBtn} variant={"outlined"}>{t(`content.reset`)}</Button>
                <Button className={styles.DateBtn} variant={"outlined"}>{t(`content.filter`)}</Button>
              </Box>
              <Button
                className={styles.ActionBtn}
                variant={"outlined"}
                startIcon={<CreateIcon/>}
                onClick={() => {
                  Api.getUUID().then(res => {
                    history.push(`/user/Vang_z/article/${res.data.data}`)
                  })
                }}
              >{t(`searchResult.newArticle`)}</Button>
            </Box>
            {
              mainArticles && mainArticles.data.map((article: any) => {
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
            <Box p={2} id={`loadingMore`}>
              <Box className={styles.loadingMore}>
                {
                  mainArticles && mainArticles.nextPage !== null ?
                    <ProcessBar/> : <span>{t(`content.end`)}</span>
                }
              </Box>
            </Box>
          </Box>
        </Box> :
        <Box className={styles.ContainerMini}>
          <Box className={styles.DatePickerContainerMini}>
            <DataPiker
              changeHandler={(e) => console.log(e)}
              placeholder={t(`content.startDate`)}/>
            <SwapRightOutlined style={{margin: '0 10px', color: 'rgba(255, 255, 255, 0.3)'}}/>
            <DataPiker
              changeHandler={(e) => console.log(e)}
              placeholder={t(`content.endDate`)}/>
          </Box>
          <Box className={styles.DatePickerBtnContainerMini}>
            <ButtonGroup>
              <Button variant={"outlined"} size={"small"}>重置</Button>
              <Button variant={"outlined"} size={"small"}>过滤</Button>
            </ButtonGroup>
          </Box>
          <Divider style={{width: '88%', margin: "0 auto"}}/>
          <Box className={styles.ContentMini}>
            {
              mainArticles && mainArticles.data.map((article: any) => {
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
          <Box p={2} id={`loadingMore`}>
            <Box className={styles.loadingMore}>
              {
                mainArticles && mainArticles.nextPage !== null ?
                  <ProcessBar/> : <span>{t(`content.end`)}</span>
              }
            </Box>
          </Box>
        </Box>
    }
  </Fade>
}
