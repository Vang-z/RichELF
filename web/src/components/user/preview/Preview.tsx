import React, {useState} from "react";
import styles from "./Preview.module.css"
import classNames from "classnames";
import {Link, useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {useSelector} from "../../../redux/hooks";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import IconButton from "@mui/material/IconButton";

import CommentIcon from "@mui/icons-material/Comment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloseIcon from '@mui/icons-material/Close';

import {dateFormatHandler, SizeProps, Small} from "../../../utils/util";
import Api from "../../../utils/api";
import {useDispatch} from "react-redux";
import {getRepositories, getPopularRepositories, getContribution, getTimeline} from "../../../redux/profile/slice";

interface PreviewProps {
  className: string
  aid: string,
  status?: string | number,
  username?: string,
  title: string,
  desc: string,
  date: string,
  lang: string,
  views: string | number,
  commentCount: string | number,
  stars: string | number,
  downloadCount: string | number,
}

export const Preview: React.FC<SizeProps & PreviewProps> = (props) => {
  const [modalOpen, setModalOpen] = useState(false)
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const auth = useSelector(s => s.auth)

  const statusHandler = () => {
    if (props.status === undefined) {
      return ['', undefined]
    }
    switch (props.status) {
      case 0:
        return [t(`profile.editing`), styles.Warning]
      case 1:
        return [t(`profile.inReview`), styles.Warning]
      case 2:
        return [t(`profile.pending`), styles.Error]
      case 3:
        return [t(`profile.published`), styles.Success]
    }
    return ['', undefined]
  }
  return <>
    <Box className={classNames([props.className, styles.Preview])}>
      <Box className={styles.PreviewContent}>
        <Box>
          <Box className={styles.PreviewHeader}>
            <Link to={`/article/${props.aid}`}>
              <Box className={styles.PreviewTitle}>
                <ViewQuiltIcon/>
                <span>{props.title}</span>
              </Box>
            </Link>
            {
              props.status !== undefined &&
              <>
              <span className={styles.PreviewDate}>
                {dateFormatHandler(props.size === Small ? "diff" : "comm", props.date)}
              </span>
                <span className={classNames([styles.PreviewStatus, statusHandler()[1]])}>
                {statusHandler()[0]}
              </span>
              </>
            }
          </Box>
          <Box className={styles.PreviewDesc}>
            <span className={styles.PreviewBrief}>{props.desc}</span>
          </Box>
        </Box>
        <Box className={styles.PreviewIcon}>
          <span className={styles.PreviewInfo}>
            <VisibilityIcon/><span className={styles.InfoNum}>{props.views}</span>
          </span>
          <span className={styles.Dot}>•</span>
          <span className={styles.PreviewInfo}>
            <CommentIcon/><span className={styles.InfoNum}>{props.commentCount}</span>
          </span>
          <span className={styles.Dot}>•</span>
          <span className={styles.PreviewInfo}>
            <FavoriteBorderIcon/><span className={styles.InfoNum}>{props.stars}</span>
          </span>
          <span className={styles.Dot}>•</span>
          <span className={styles.PreviewInfo}>
            <CloudDownloadIcon/><span className={styles.InfoNum}>{props.downloadCount}</span>
          </span>
        </Box>
      </Box>
      {props.size !== Small && props.status !== undefined &&
      <Box className={styles.ActionContainer}>
        <Button
          variant={"outlined"} size={"small"}
          onClick={() => {
            history.push(`/user/${props.username}/article/${props.aid}`)
          }}
        >
          {t(`profile.edit`)}
        </Button>
        <Button
          variant={"outlined"} size={"small"}
          onClick={() => {
            setModalOpen(true)
          }}
        >
          {t(`profile.delete`)}
        </Button>
      </Box>}
    </Box>
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      BackdropComponent={Backdrop}
      closeAfterTransition={true}
      BackdropProps={{timeout: 500}}
    >
      <Fade in={modalOpen}>
        <Box
          className={styles.ModalContainer}>
          <IconButton
            className={styles.CloseBtn}
            size={"small"}
            disableRipple={true}
            onClick={() => setModalOpen(false)}
          ><CloseIcon/></IconButton>
          <Box className={styles.ModalTitleBox}>
            <p>{t(`profile.delArticleP1`)}</p>
            <span className={styles.ModalTitle}>{props.title}</span>
            <p>{t(`profile.delArticleP2`)}</p>
            <p>{t(`profile.delArticleP3`)}</p>
          </Box>
          <Button
            className={styles.ModalBtn} variant={"outlined"} size={"small"}
            onClick={async () => {
              const res = await Api.http.delete(`/article/${props.aid}`, {
                headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
              })
              if (res.status === 200) {
                enqueueSnackbar(t('enqueueSnackbar.delSuccess'), {
                  variant: "success",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                setModalOpen(false)
                const username = props.username as string
                dispatch(getRepositories({username, page: 1, auth}))
                dispatch(getPopularRepositories(username))
                dispatch(getContribution(username))
                dispatch(getTimeline({username: username, page: 1}))
                return
              }
              enqueueSnackbar(res.data.detail.msg, {
                variant: "warning",
                action: key => <IconButton
                  disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
              })
            }}
          >
            {t('profile.delArticle')}
          </Button>
        </Box>
      </Fade>
    </Modal>
  </>
}
