import React, {useEffect} from "react";
import styles from "./PreSearch.module.css";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {preSearchArticles, preSearchUsers} from "../../../redux/search/slice";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";

import DescriptionIcon from "@material-ui/icons/Description";
import LoyaltyIcon from "@material-ui/icons/Loyalty";

import {ArticlePreview} from "../../utils";


export const PreSearch: React.FC = () => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const articles = useSelector(s => s.search.preSearchArticles)
  const users = useSelector(s => s.search.preSearchUsers)

  useEffect(() => {
    dispatch(preSearchArticles())
    dispatch(preSearchUsers())
  }, [dispatch])

  return <>
    <Box className={styles.ArticleContainer}>
      <Box className={styles.ArticleTitleContainer}>
        <DescriptionIcon/><p className={styles.Article}>{t('searchContent.article')}</p>
      </Box>
      {
        articles && articles.data.map((article: any) => {
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
            star={article.star}
            view={article.view}/>
        })
      }
    </Box>
    <Box className={styles.TagContainer}>
      <Box className={styles.TagTitleContainer}>
        <LoyaltyIcon/><p className={styles.User}>{t('searchContent.user')}</p>
      </Box>
      <Box className={styles.TagContentContainer}>
        {
          users && users.data.map((user: any) => {
            return <Button
              className={styles.TagBtn}
              size={"small"}
              variant={"outlined"}
              key={user.id}
              onClick={() => history.push(`/user/${user.username}`)}>
              <span className={styles.TagAvatar}><Avatar alt="..." src={user.avatar}/></span>
              <span className={styles.Hot}>{user.username}</span>
            </Button>
          })
        }
      </Box>
    </Box>
  </>
}
