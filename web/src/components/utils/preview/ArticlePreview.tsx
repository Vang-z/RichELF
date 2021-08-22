import React from "react";
import styles from "./Preview.module.css"
import {Link} from "react-router-dom";

import Box from "@material-ui/core/Box";

import {BadgeAvatar} from "../badgeAvatar";

import CodeIcon from "@material-ui/icons/Code";
import CommentIcon from "@material-ui/icons/Comment";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';

import {dateFormatHandler} from "../../../utils/util";

interface PreviewProps {
  preSearch: boolean,
  id: string,
  title: string,
  author: {
    avatar: string,
    username: string
  }
  desc: string,
  date: string,
  lang: string,
  comment: string,
  praise: string,
  view: string,
  className?: string,
  hiddenAuthor?: boolean
}


export const ArticlePreview: React.FC<PreviewProps> = (props) => {
  return <>
    <Link to={`/article/${props.id}`}
          className={props.className ? props.className : props.preSearch ? styles.PreSearchArticle : styles.Article}>
      <Box>
        <Box className={styles.ArticleTitle}><ViewQuiltIcon/>{props.title}</Box>
        <Box className={styles.ArticleDesc}>
          <span className={styles.ArticleBrief}>{props.desc}</span>
          {
            !props.hiddenAuthor && <Box className={styles.ArticleAuthor}>
              <BadgeAvatar src={props.author.avatar} online={false} size={"small"} user={props.author.username}/>
              <span>{props.author.username}</span>
              <span className={styles.Dot} style={{top: '2px'}}>•</span>
              <span>{dateFormatHandler("diff", props.date)}</span>
            </Box>
          }
        </Box>
      </Box>
      <Box className={styles.ArticleIcon}>
        <span className={styles.ArticleInfo}><CodeIcon/>{props.lang}</span>
        <span className={styles.Dot}>•</span>
        <span className={styles.ArticleInfo}><CommentIcon/>{props.comment}</span>
        <span className={styles.Dot}>•</span>
        <span className={styles.ArticleInfo}><FavoriteBorderIcon/>{props.praise}</span>
        <span className={styles.Dot}>•</span>
        <span className={styles.ArticleInfo}><VisibilityIcon/>{props.view}</span>
      </Box>
    </Link>
  </>
}
