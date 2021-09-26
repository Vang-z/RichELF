import React, {useEffect} from "react";
import styles from "./Content.module.css"
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {useSnackbar} from "notistack";
import {useSelector} from "../../../../redux/hooks";
import {editorSlice, getArticle, initialEditorState} from "../../../../redux/editor/slice";
import jwt_decode from "jwt-decode";

import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

import SaveIcon from '@mui/icons-material/Save';
import TelegramIcon from '@mui/icons-material/Telegram';
import CloseIcon from "@mui/icons-material/Close";

import {ArticleRender} from "../../../article";
import {ArticlePreview, FileUpload, Editor} from "../../../utils";
import {dateFormatHandler} from "../../../../utils/util";
import Api from "../../../../utils/api";


export const Content: React.FC = () => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {aid} = useParams<{ username: string, aid: string }>()
  const articleInfo = useSelector(s => s.editor)
  const auth = useSelector(s => s.auth)
  const user = auth.accessToken ? jwt_decode(auth.accessToken) as any : {}
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  useEffect(() => {
    // 不使用 setTimeout 会产生 'Can't perform a React state update on an unmounted component.' 警告
    // 初步排查是异步请求数据的问题, 暂时无法解决
    // 知道如何解决的大佬请赐教, 谢谢.
    setTimeout(() => {
      dispatch(getArticle({aid, auth}))
    }, 0)
    return () => {
      dispatch(editorSlice.actions.dispatchInit(initialEditorState))
    }
  }, [dispatch, aid, auth])

  return <Box className={styles.ArticleContentContainer}>
    <Box className={styles.PreviewContainer}>
      <ArticlePreview
        className={styles.TitlePreview}
        preSearch={false}
        author={{
          username: user.username,
          avatar: user.avatar_url
        }}
        title={articleInfo.title}
        desc={articleInfo.desc}
        lang={articleInfo.lang}
        date={dateFormatHandler("diff", (articleInfo.publishAt ? articleInfo.publishAt : new Date((new Date().getTime() + (new Date().getTimezoneOffset() * 60000)))).toString())}
        commentCount={0}
        downloadCount={0}
        stars={0}
        views={0}
      />
      <ArticleRender
        className={styles.ContentPreview}
        title={articleInfo.title}
        author={{
          username: user.username,
          avatar: user.avatar_url
        }}
        createAt={dateFormatHandler("comm", (articleInfo.publishAt ? articleInfo.publishAt : new Date((new Date().getTime() + (new Date().getTimezoneOffset() * 60000)))).toString())}
        lang={articleInfo.lang}
        content={articleInfo.content}
        stars={0}
        views={0}
        download={0}
        comment={0}
        file={articleInfo.file}
      />
    </Box>
    <Divider className={styles.VerticalDivider} orientation="vertical" flexItem={true}/>
    <Box className={styles.EditorContainer}>
      <Box className={styles.TitleBar}>
        <Box className={styles.InputBox}>
          <Box className={styles.TitleHeader}>
            <TextField
              className={styles.TitleInput}
              variant={"outlined"}
              label={t(`create.title`)}
              size={"small"}
              value={articleInfo.title}
              onChange={(event) => dispatch(editorSlice.actions.dispatchTitle(event.target.value as string))}
              fullWidth={true}/>
            <FormControl className={styles.TitleLang} variant="outlined" size={"small"}>
              <InputLabel>{t(`create.lang`)}</InputLabel>
              <Select
                label="lang"
                value={articleInfo.lang}
                onChange={event => dispatch(editorSlice.actions.dispatchLang(event.target.value as string))}>
                <MenuItem value={'python'}>Python</MenuItem>
                <MenuItem value={'go'}>Golang</MenuItem>
                <MenuItem value={'c'}>C / C ++</MenuItem>
                <MenuItem value={'java'}>Java</MenuItem>
                <MenuItem value={'javascript'}>JavaScript</MenuItem>
                <MenuItem value={'typescript'}>TypeScript</MenuItem>
                <MenuItem value={'ruby'}>Ruby</MenuItem>
                <MenuItem value={'matlab'}>Matlab</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            className={styles.DescInput}
            variant={"outlined"}
            label={t(`create.desc`)}
            size={"small"}
            value={articleInfo.desc}
            onChange={(event) => dispatch(editorSlice.actions.dispatchDesc(event.target.value as string))}
            fullWidth={true}/>
        </Box>
        <Box className={styles.FilePondBox}>
          <FileUpload/>
        </Box>
      </Box>
      <Box className={styles.EditorBar}>
        <Editor width={'100%'} height={860}/>
        <ButtonGroup className={styles.EditorBtn} color={"secondary"}>
          <Button
            startIcon={<SaveIcon/>} variant={"outlined"} size={"small"}
            onClick={async () => {
              let formData = new FormData()
              formData.append('title', articleInfo.title)
              formData.append('desc', articleInfo.desc)
              formData.append('lang', articleInfo.lang)
              formData.append('content', articleInfo.content)
              formData.append('s', articleInfo.publishAt ? '1' : '0')
              articleInfo.file && articleInfo.file.fid && formData.append('file', articleInfo.file.fid)
              const res = await Api.http.put(`/article/${aid}`, formData, {
                headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
              })
              if (res.status !== 200) {
                enqueueSnackbar(t('enqueueSnackbar.saveFailed'), {
                  variant: "warning",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                return
              }
              enqueueSnackbar(t('enqueueSnackbar.saveSuccess'), {
                variant: "success",
                action: key => <IconButton
                  disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
              })
            }}
          >
            {t(`create.save`)}
          </Button>
          <Button
            startIcon={<TelegramIcon/>} variant={"outlined"} size={"small"}
            onClick={async () => {
              let formData = new FormData()
              formData.append('title', articleInfo.title)
              formData.append('desc', articleInfo.desc)
              formData.append('lang', articleInfo.lang)
              formData.append('content', articleInfo.content)
              formData.append('s', '1')
              articleInfo.file && articleInfo.file.fid && formData.append('file', articleInfo.file.fid)
              const res = await Api.http.put(`/article/${aid}`, formData, {
                headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
              })
              if (res.status !== 200) {
                enqueueSnackbar(t('enqueueSnackbar.publishArticleFailed'), {
                  variant: "warning",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                return
              }
              enqueueSnackbar(t('enqueueSnackbar.publishArticleSuccess'), {
                variant: "success",
                action: key => <IconButton
                  disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
              })
            }}>
            {t(`create.publish`)}
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  </Box>
}