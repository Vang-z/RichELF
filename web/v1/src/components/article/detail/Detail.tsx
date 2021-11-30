import React, {useEffect} from "react";
import styles from "./Detail.module.css"
import useScreenSize from "use-screen-size";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {getArticle, articleSlice} from "../../../redux/article/slice";

import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";

import {NotFound} from "../../404";
import {Render} from "../render";
import {Comment} from "../../utils";

import {Medium, MiniWidth, Small, dateFormatHandler} from "../../../utils/util";


export const Detail: React.FC<{ aid: string }> = ({aid}) => {
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const dispatch = useDispatch()
  const article = useSelector(s => s.article.article)
  const loading = useSelector(s => s.article.loading)
  const auth = useSelector(s => s.auth)

  useEffect(() => {
    dispatch(getArticle({aid, auth}))
    return () => {
      dispatch(articleSlice.actions.clearContent())
    }
  }, [dispatch, aid, auth])

  if (loading && !article) return <></>
  if (!article) return <NotFound/>
  return <Fade in={true} timeout={500}>
    <Box className={styles.Container}>
      <Render
        aid={article.aid}
        title={article.title}
        author={article.author}
        createAt={dateFormatHandler("comm", article.publish_at)}
        lang={article.lang}
        content={article.content}
        stars={article.stars}
        views={article.views}
        download={article.download_count}
        file={article.file}
        comment={article.comment_count}/>
      {
        (screenSize === Small && article.comment_count === 0) ? <></> :
          <Comment aid={article.aid} articleAuthor={article.author.username} commentsCount={article.comment_count}
                   comments={article.comments}/>
      }
    </Box>
  </Fade>
}
