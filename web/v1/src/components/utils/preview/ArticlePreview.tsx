import React from "react";
import styles from "./Preview.module.css"
import {Link} from "react-router-dom";

import Box from "@mui/material/Box";

import {BadgeAvatar} from "../badgeAvatar";

import CommentIcon from "@mui/icons-material/Comment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

interface PreviewProps {
  preSearch: boolean,
  id?: string,
  title: string,
  author: {
    avatar: string,
    username: string
  }
  desc: string,
  date: string,
  lang: string,
  commentCount: string | number,
  stars: string | number,
  views: string | number,
  downloadCount: string | number,
  className?: string,
  hiddenAuthor?: boolean
}


export const ArticlePreview: React.FC<PreviewProps> = (props) => {
  return <>
    <Link to={props.id ? `/article/${props.id}` : `#`}
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
              <span>{props.date}</span>
            </Box>
          }
        </Box>
      </Box>
      <Box className={styles.ArticleIcon}>
        <span className={styles.ArticleInfo}>
          <VisibilityIcon/><span className={styles.InfoNum}>{props.views}</span>
        </span>
        <span className={styles.Dot}>•</span>
        <span className={styles.ArticleInfo}>
          <CommentIcon/><span className={styles.InfoNum}>{props.commentCount}</span>
        </span>
        <span className={styles.Dot}>•</span>
        <span className={styles.ArticleInfo}>
          <FavoriteBorderIcon/><span className={styles.InfoNum}>{props.stars}</span>
        </span>
        <span className={styles.Dot}>•</span>
        <span className={styles.ArticleInfo}>
          <CloudDownloadIcon/><span className={styles.InfoNum}>{props.downloadCount}</span>
        </span>
      </Box>
    </Link>
  </>
}
