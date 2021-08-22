import React, {useEffect} from "react";
import styles from "./Detail.module.css"
import useScreenSize from "use-screen-size";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {getArticle, articleSlice} from "../../../redux/article/slice";

import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";

import {Render} from "../render";
import {Comment} from "../../utils";

import {Medium, MiniWidth, Small, dateFormatHandler} from "../../../utils/util";


export const Detail: React.FC<{ aid: string }> = ({aid}) => {
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const dispatch = useDispatch()
  const article = useSelector(s => s.article.article)

  useEffect(() => {
    dispatch(getArticle(aid))
    return () => {
      dispatch(articleSlice.actions.clearContent())
    }
  }, [aid, dispatch])

  if (!article) return <></>
  return <Fade in={true} timeout={500}>
    <Box className={styles.Container}>
      <Render
        title={article.data.title}
        author={article.data.author}
        createDate={dateFormatHandler("comm", article.createDate)}
        lang={article.data.lang}
        praise={article.data.praise}
        view={article.data.view}
        comment={article.data.commentCount}
        content={article.data.content}/>
      {
        (screenSize === Small && article.data.comments === undefined) ? <></> :
          <Comment commentsCount={article.data.commentCount} comments={article.data.comments}/>
      }
    </Box>
  </Fade>
}
