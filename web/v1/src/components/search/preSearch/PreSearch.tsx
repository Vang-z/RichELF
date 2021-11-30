import React, {useEffect} from "react";
import styles from "./PreSearch.module.css";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {preSearch} from "../../../redux/search/slice";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import DescriptionIcon from "@mui/icons-material/Description";
import LoyaltyIcon from "@mui/icons-material/Loyalty";

import {ArticlePreview} from "../../utils";
import {dateFormatHandler} from "../../../utils/util";


export const PreSearch: React.FC = () => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const pre = useSelector(s => s.search.preSearch)
  const search = useSelector(s => s.search.keywords)

  useEffect(() => {
    dispatch(preSearch(search))
  }, [dispatch, search])

  return <>
    <Box className={styles.ArticleContainer}>
      <Box className={styles.ArticleTitleContainer}>
        <DescriptionIcon/><p className={styles.Article}>{t('searchContent.article')}</p>
      </Box>
      {
        pre && pre.articles.map((article: any) => {
          return <ArticlePreview
            preSearch={true}
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
    <Box className={styles.TagContainer}>
      <Box className={styles.TagTitleContainer}>
        <LoyaltyIcon/><p className={styles.User}>{t('searchContent.user')}</p>
      </Box>
      <Box className={styles.TagContentContainer}>
        {
          pre && pre.users.map((user: any) => {
            return <Button
              className={styles.TagBtn}
              size={"small"}
              variant={"outlined"}
              key={user.uid}
              onClick={() => history.push(`/user/${user.username}`)}>
              <span className={styles.TagAvatar}><Avatar alt="..." src={user.avatar_url}/></span>
              <span className={styles.Hot}>{user.username}</span>
            </Button>
          })
        }
      </Box>
    </Box>
  </>
}
