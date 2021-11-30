import React, {useState} from "react";
import styles from "./Comment.module.css"
import classNames from "classnames"
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import useScreenSize from "use-screen-size";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {getArticle} from "../../../redux/article/slice";
import {initialAuthState} from "../../../redux/auth/slice";
import {editorSlice} from "../../../redux/editor/slice";
import jwt_decode from "jwt-decode";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";

import {BadgeAvatar} from "../badgeAvatar";
import {Editor} from "../editor";

import {SizeProps, Medium, MiniWidth, Small, dateFormatHandler} from "../../../utils/util";
import Api from "../../../utils/api";

const avatar = require('../../../assets/images/avatar.png')

interface CommentProps {
  aid: string,
  articleAuthor: string
  commentsCount: string | number
  comments?: CommentsProps[]
}

export interface CommentsProps {
  aid: string
  cid: string
  articleAuthor: string
  author: {
    username: string,
    avatar: string,
  },
  create_at: string,
  content: string,
  comments?: CommentsProps[]
}

const CommentBox: React.FC<CommentsProps & SizeProps> = (
  {size, aid, cid, articleAuthor, author, create_at, content, comments}) => {
  const [openReply, setOpenReply] = useState(false)
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const auth = useSelector(s => s.auth)
  const editorContent = useSelector(s => s.editor.content)
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  return <Box className={classNames([styles.CommentBox, {[`${styles.MiniCommentBox}`]: size === Small}])}>
    {
      size === Medium && <>
        <BadgeAvatar
          className={styles.CommentAvatar} src={author.avatar} online={false} size={"small"} user={author.username}/>
        <Box className={styles.CommentDirIcon}/>
      </>
    }
    <Box className={classNames([styles.CommentBorder, {[`${styles.MiniCommentBorder}`]: size === Small}])}>
      <Box className={styles.CommentInfo}>
        <Box style={{display: "flex", alignItems: "center"}}>
          {
            size === Small && <BadgeAvatar
              className={styles.MiniCommentAvatar} src={author.avatar} online={false} size={"small"}
              user={author.username}/>
          }
          <span>{author.username}</span>
          {
            author.username === articleAuthor && <span className={styles.CommentAuthor}>{t(`comment.author`)}</span>
          }
          <span className={styles.CommentDot}>•</span>
          <span className={styles.CommentDate}>{dateFormatHandler('comm', create_at)}</span>
        </Box>
        <Box hidden={size === Small}>
          <span className={styles.CommentReply} onClick={() => setOpenReply(true)}>{t(`detail.reply`)}</span>
        </Box>
      </Box>
      <Box
        className={classNames([styles.CommentRender, {[`${styles.MiniCommentRender}`]: size === Small}])}
        dangerouslySetInnerHTML={{__html: content}}/>
      {
        openReply &&
        <Box className={styles.CommentBox}>
          <BadgeAvatar
            className={styles.CommentAvatar}
            src={auth.accessToken ? (jwt_decode(auth.accessToken) as any).avatar_url : avatar.default} online={false}
            size={"small"}/>
          <Box className={styles.CommentDirIcon}/>
          <Box className={styles.CommentBorder}>
            <Editor height={200} width={'100%'}/>
            <ButtonGroup>
              <Button
                className={styles.CommentBtn} variant={"outlined"} size={"small"}
                onClick={() => {
                  dispatch(editorSlice.actions.dispatchContent(''))
                  setOpenReply(false)
                }}>
                {t(`comment.cancel`)}
              </Button>
              <Button
                className={styles.CommentBtn} variant={"outlined"} size={"small"}
                onClick={async () => {
                  if (!content) {
                    enqueueSnackbar(t(`enqueueSnackbar.commentValidateFailed`), {
                      variant: "warning",
                      action: key => <IconButton
                        disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                    })
                    return
                  }
                  if (!auth.accessToken) {
                    enqueueSnackbar(t(`enqueueSnackbar.commentWaitingForLogin`), {
                      variant: "warning",
                      action: key => <IconButton
                        disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                    })
                    return
                  }
                  if (!(jwt_decode(auth.accessToken) as any).create_at) {
                    enqueueSnackbar(t(`enqueueSnackbar.commentWaitingForActive`), {
                      variant: "warning",
                      action: key => <IconButton
                        disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                    })
                    return
                  }
                  let formData = new FormData()
                  formData.append('cid', cid)
                  formData.append('content', editorContent)
                  const res = await Api.http.post(`/comment`, formData, {
                    headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
                  })
                  if (res.status === 201) {
                    enqueueSnackbar(t(`enqueueSnackbar.commentSuccess`), {
                      variant: "success",
                      action: key => <IconButton
                        disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                    })
                    setOpenReply(false)
                    dispatch(editorSlice.actions.dispatchContent(''))
                    dispatch(getArticle({aid, auth: initialAuthState}))
                  }
                }}
              >
                {t(`detail.submit`)}
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      }
      {
        comments !== undefined &&
        comments.map(comment => {
          return <CommentBox
            key={comment.cid} cid={comment.cid} aid={aid} size={size} articleAuthor={articleAuthor}
            author={comment.author} create_at={comment.create_at} content={comment.content}
            comments={comment.comments}/>
        })
      }
    </Box>
  </Box>
}


export const Comment: React.FC<CommentProps> = ({aid, articleAuthor, comments, commentsCount}) => {
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const {t} = useTranslation()
  const [openEditor, setOpenEditor] = useState(false)
  const dispatch = useDispatch()
  const content = useSelector(s => s.editor.content)
  const auth = useSelector(s => s.auth)
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  return <Box
    className={classNames([styles.CommentContainer, {[`${styles.MiniCommentContainer}`]: screenSize === Small}])}>
    <Box className={styles.CommentTitle}>{t(`detail.comment`)}&nbsp;(&nbsp;{commentsCount}&nbsp;)</Box>
    {
      screenSize === Medium &&
      <Box className={styles.CommentBox}>
        <BadgeAvatar
          className={styles.CommentAvatar}
          src={auth.accessToken ? (jwt_decode(auth.accessToken) as any).avatar_url : avatar.default} online={false}
          size={"small"}/>
        <Box className={styles.CommentDirIcon} style={openEditor ? undefined : {display: "none"}}/>
        <Box className={styles.CommentBorder} style={openEditor ? undefined : {display: "none"}}>
          <Editor height={240} width={'100%'}/>
          <ButtonGroup>
            <Button
              className={styles.CommentBtn} variant={"outlined"} size={"small"}
              onClick={() => {
                setOpenEditor(false)
                dispatch(editorSlice.actions.dispatchContent(''))
              }}>
              {t(`comment.cancel`)}
            </Button>
            <Button
              className={styles.CommentBtn} variant={"outlined"} size={"small"}
              onClick={async () => {
                if (!content) {
                  enqueueSnackbar(t(`enqueueSnackbar.commentValidateFailed`), {
                    variant: "warning",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                  return
                }
                if (!auth.accessToken) {
                  enqueueSnackbar(t(`enqueueSnackbar.commentWaitingForLogin`), {
                    variant: "warning",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                  return
                }
                if (!(jwt_decode(auth.accessToken) as any).create_at) {
                  enqueueSnackbar(t(`enqueueSnackbar.commentWaitingForActive`), {
                    variant: "warning",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                  return
                }
                let formData = new FormData()
                formData.append('aid', aid)
                formData.append('content', content)
                const res = await Api.http.post(`/comment`, formData, {
                  headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
                })
                if (res.status === 201) {
                  enqueueSnackbar(t(`enqueueSnackbar.commentSuccess`), {
                    variant: "success",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                  setOpenEditor(false)
                  dispatch(editorSlice.actions.dispatchContent(''))
                  dispatch(getArticle({aid, auth: initialAuthState}))
                  return
                }
              }}
            >
              {t(`detail.submit`)}
            </Button>
          </ButtonGroup>
        </Box>
        <TextField
          className={styles.CommentInput} variant="outlined" label={t(`detail.comment`)} fullWidth={true}
          onClick={() => setOpenEditor(true)}
          style={openEditor ? {display: "none"} : undefined}/>
      </Box>
    }
    {
      comments && comments.map(comment => {
        return <CommentBox
          key={comment.cid}
          aid={aid}
          cid={comment.cid}
          size={screenSize}
          articleAuthor={articleAuthor}
          author={comment.author}
          create_at={comment.create_at}
          content={comment.content}
          comments={comment.comments}/>
      })
    }
  </Box>
}
