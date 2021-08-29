import React from "react";
import styles from "./Preview.module.css"
import classNames from "classnames";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import CodeIcon from "@material-ui/icons/Code";
import CommentIcon from "@material-ui/icons/Comment";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import StorageIcon from '@material-ui/icons/Storage';

import {dateFormatHandler, SizeProps, Small} from "../../../utils/util";

interface PreviewProps {
  className: string
  id: string,
  status?: string | number,
  title: string,
  desc: string,
  date?: string,
  lang?: string,
  download?: string,
  comment: string,
  star: string,
  view: string,
}

export const Preview: React.FC<SizeProps & PreviewProps> = (props) => {
  const {t} = useTranslation()
  const statusHandler = () => {
    if (props.status === undefined) {
      return ['', undefined]
    }
    switch (props.status) {
      case 0:
        return [t(`profile.published`), styles.Success]
      case 1:
        return [t(`profile.editing`), styles.Warning]
      case 2:
        return [t(`profile.inReview`), styles.Warning]
      case 3:
        return [t(`profile.pending`), styles.Error]
    }
    return ['', undefined]
  }
  const type = props.lang ? 'article' : 'dataset'

  return <Box className={classNames([props.className, styles.Preview])}>
    <Box className={styles.PreviewContent}>
      <Box>
        <Box className={styles.PreviewHeader}>
          <Link to={`/${type}/${props.id}`}>
            <Box className={styles.PreviewTitle}>
              {
                type === "article" ?
                  <ViewQuiltIcon/> :
                  <StorageIcon/>
              }
              <span>{props.title}</span>
            </Box>
          </Link>
          {props.date && <span
            className={styles.PreviewDate}>{dateFormatHandler(props.size === Small ? "diff" : "comm", props.date)}</span>}
          {props.status !== undefined &&
          <span className={classNames([styles.PreviewStatus, statusHandler()[1]])}>{statusHandler()[0]}</span>}
        </Box>
        <Box className={styles.PreviewDesc}>
          <span className={styles.PreviewBrief}>{props.desc}</span>
        </Box>
      </Box>
      <Box className={styles.PreviewIcon}>
        {
          type === "article" ?
            <span className={styles.PreviewInfo}><CodeIcon/>{props.lang}</span> :
            <span className={styles.PreviewInfo}><CloudDownloadIcon/>{props.download}</span>
        }
        <span className={styles.Dot}>•</span>
        <span className={styles.PreviewInfo}><CommentIcon/>{props.comment}</span>
        <span className={styles.Dot}>•</span>
        <span className={styles.PreviewInfo}><FavoriteBorderIcon/>{props.star}</span>
        <span className={styles.Dot}>•</span>
        <span className={styles.PreviewInfo}><VisibilityIcon/>{props.view}</span>
      </Box>
    </Box>
    {props.date && props.size !== Small &&
    <Box className={styles.ActionContainer}>
      <Button variant={"outlined"} size={"small"}>{t(`profile.edit`)}</Button>
      <Button variant={"outlined"} size={"small"}>{t(`profile.delete`)}</Button>
    </Box>}
  </Box>
}
