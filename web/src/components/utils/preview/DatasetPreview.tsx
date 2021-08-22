import React from "react";
import styles from "./Preview.module.css"
import {Link} from "react-router-dom";

import Box from "@material-ui/core/Box";

import {BadgeAvatar} from "../badgeAvatar";

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import VisibilityIcon from "@material-ui/icons/Visibility";
import StorageIcon from '@material-ui/icons/Storage';
import CommentIcon from "@material-ui/icons/Comment";
import {dateFormatHandler} from "../../../utils/util";


interface PreviewProps {
  id: string,
  title: string,
  author: {
    avatar: string,
    username: string
  }
  desc: string,
  date: string,
  comment: string,
  download: string,
  praise: string,
  view: string,
  className?: string,
  hiddenAuthor?: boolean
}


export const DatasetPreview: React.FC<PreviewProps> = (props) => {
  return <>
    <Link to={`/dataset/${props.id}`} className={props.className ? props.className : styles.Dataset}>
      <Box>
        <Box className={styles.DatasetTitle}><StorageIcon/>{props.title}</Box>
        <Box className={styles.DatasetDesc}>
          <span className={styles.DatasetBrief}>{props.desc}</span>
          {
            !props.hiddenAuthor && <Box className={styles.DatasetAuthor}>
              <BadgeAvatar src={props.author.avatar} online={false} size={"small"} user={props.author.username}/>
              <span>{props.author.username}</span>
              <span className={styles.Dot} style={{top: '2px'}}>•</span>
              <span className={styles.DatasetDate}>{dateFormatHandler("diff", props.date)}</span>
            </Box>
          }
        </Box>
      </Box>
      <Box className={styles.DatasetIcon}>
        <span className={styles.DatasetInfo}><CloudDownloadIcon/>{props.download}</span>
        <span className={styles.Dot}>•</span>
        <span className={styles.DatasetInfo}><CommentIcon/>{props.comment}</span>
        <span className={styles.Dot}>•</span>
        <span className={styles.DatasetInfo}><FavoriteBorderIcon/>{props.praise}</span>
        <span className={styles.Dot}>•</span>
        <span className={styles.DatasetInfo}><VisibilityIcon/>{props.view}</span>
      </Box>
    </Link>
  </>
}
