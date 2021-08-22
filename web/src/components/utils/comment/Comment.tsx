import React, {useState} from "react";
import styles from "./Comment.module.css"
import classNames from "classnames"
import {useTranslation} from "react-i18next";

import useScreenSize from "use-screen-size";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import {BadgeAvatar} from "../badgeAvatar";
import {Editor} from "../editor";

import {SizeProps, Medium, MiniWidth, Small} from "../../../utils/util";

const avatar = require('../../../assets/images/avatar.jpg')

interface CommentProps {
  commentsCount: string | number
  comments?: CommentsProps[]
}

export interface CommentsProps {
  id: string
  author: {
    username: string,
    avatar: string,
  },
  date: string,
  content: string,
  comments?: CommentsProps[]
}

interface EditorProps {
  hidden: boolean
  height: number
}

const CommentBox: React.FC<CommentsProps & SizeProps> = (
  {size, author, date, content, comments}) => {
  const [openReply, setOpenReply] = useState(false)
  const {t} = useTranslation()


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
          <span className={styles.CommentDot}>•</span>
          <span className={styles.CommentDate}>{date}</span>
        </Box>
        <Box hidden={size === Small}>
          <span className={styles.CommentReply} onClick={() => setOpenReply(true)}>{t(`detail.reply`)}</span>
        </Box>
      </Box>
      <Box
        className={classNames([styles.CommentRender, {[`${styles.MiniCommentRender}`]: size === Small}])}
        dangerouslySetInnerHTML={{__html: content}}/>
      {
        openReply && <CommentEditor height={200} hidden={false}/>
      }
      {
        comments !== undefined &&
        comments.map(comment => {
          return <CommentBox
            id={comment.id} key={comment.id} size={size} author={comment.author}
            date={comment.date} content={comment.content} comments={comment.comments}/>
        })
      }
    </Box>
  </Box>
}

const CommentEditor: React.FC<EditorProps> = ({height, hidden}) => {
  const [openEditor, setOpenEditor] = useState(false)
  const {t} = useTranslation()

  return <Box className={styles.CommentBox}>
    <BadgeAvatar className={styles.CommentAvatar} src={avatar.default} online={false} size={"small"}/>
    <Box className={styles.CommentDirIcon} style={hidden ? (openEditor ? undefined : {display: "none"}) : undefined}/>
    <Box className={styles.CommentBorder} style={hidden ? (openEditor ? undefined : {display: "none"}) : undefined}>
      <Editor height={height} width={'100%'}/>
      <Button className={styles.CommentBtn} variant={"outlined"}>{t(`detail.submit`)}</Button>
    </Box>
    <TextField
      className={styles.CommentInput} variant="outlined" label={t(`detail.comment`)} fullWidth={true}
      onClick={() => setOpenEditor(true)}
      style={hidden ? (openEditor ? {display: "none"} : undefined) : {display: "none"}}/>
  </Box>
}


export const Comment: React.FC<CommentProps> = ({comments, commentsCount}) => {
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const {t} = useTranslation()

  return <Box
    className={classNames([styles.CommentContainer, {[`${styles.MiniCommentContainer}`]: screenSize === Small}])}>
    <Box className={styles.CommentTitle}>{t(`detail.comment`)}&nbsp;(&nbsp;{commentsCount}&nbsp;)</Box>
    {screenSize === Medium && <CommentEditor height={240} hidden={true}/>}
    {
      comments && comments.map((comment: CommentsProps) => {
        return <CommentBox
          key={comment.id}
          id={comment.id}
          size={screenSize}
          author={comment.author}
          date={comment.date}
          content={comment.content}
          comments={comment.comments}/>
      })
    }
  </Box>
}
