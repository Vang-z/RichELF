import React, {useEffect} from "react";
import styles from "./Render.module.css"
import useScreenSize from "use-screen-size";
import {useSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
import {useSelector} from "../../../redux/hooks";
import jwt_decode from "jwt-decode";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import {BadgeAvatar} from "../../utils";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloseIcon from "@mui/icons-material/Close";

import {LightAsync as SyntaxHighlighter} from 'react-syntax-highlighter';
import {gml} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {v4 as uuidv4} from 'uuid';

import {Medium, MiniWidth, Small, PLACEHOLDER, renderGenerateHtml, renderCopyHandler} from "../../../utils/util";
import Api from "../../../utils/api"

interface RenderProps {
  aid?: string,
  title: string,
  author: {
    username: string,
    avatar: string
  },
  createAt: string,
  content: string,
  lang: string,
  stars: string | number,
  views: string | number,
  comment: string | number,
  download: string | number,
  file: { filename: string, filesize: number, fid: string } | null,
  className?: string
}


export const Render: React.FC<RenderProps> = (props) => {
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const {t} = useTranslation()
  const auth = useSelector(s => s.auth)
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  let innerHtml: string[]
  let codeSamples: string[]
  const Html = renderGenerateHtml(props.content)
  innerHtml = Html[0]
  codeSamples = Html[1]

  const filesizeHandler = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let index = 0;
    while (size > 1024) {
      size = size / 1024
      index++
    }
    return size.toFixed(2) + units[index]
  }

  useEffect(() => {
    document.title = `RichELF | ${props.title}`
  })
  return <Box className={props.className ? props.className : styles.Container}>
    <Box className={styles.Title}>{props.title}</Box>
    <Box className={styles.Info}>
      <BadgeAvatar src={props.author.avatar} online={false} size={"small"}/>
      <span>{props.author.username}</span>
      <span className={styles.Dot}>•</span>
      <span>{props.createAt}</span>
    </Box>
    <Box className={styles.Info}>
      <span className={styles.Icon}><VisibilityIcon/>{props.views}</span>
      <span className={styles.Dot}>•</span>
      <span className={styles.Icon}><CommentIcon/>{props.comment}</span>
      <span className={styles.Dot}>•</span>
      <span className={styles.Icon}><FavoriteBorderIcon/>{props.stars}</span>
      <span className={styles.Dot}>•</span>
      <span className={styles.Icon}><CloudDownloadIcon/>{props.download}</span>
    </Box>
    {
      innerHtml.map((html) => {
        const key = uuidv4()
        return html === PLACEHOLDER ?
          <Box style={screenSize === Small ? {fontSize: '10px'} : {fontSize: '16px', position: "relative"}} key={key}>
            {
              screenSize === Medium &&
              <Button
                className={styles.CopyBtn}
                variant={"outlined"}
                size={"small"}
                id={`data_${key}`}
                onClick={renderCopyHandler}
              >{t(`detail.copy`)}</Button>
            }
            <SyntaxHighlighter
              style={gml}
              language={props.lang}
              children={codeSamples.shift()}
              id={key}
            />
          </Box> :
          <Box
            className={screenSize === Small ? styles.Render : undefined} key={uuidv4()}
            dangerouslySetInnerHTML={{__html: html}}/>
      })
    }
    <Grid container={true} style={{height: '32px'}}>
      {
        screenSize === Medium && props.file && props.file.filesize &&
        <Grid xs={6} item={true} style={{display: 'flex', justifyContent: 'center'}}>
          <Button
            className={styles.ActionIcon}
            size={"small"}
            color={"secondary"}
            variant="outlined"
            startIcon={<CloudDownloadIcon/>}
            onClick={async () => {
              if (props.aid) {
                if (!auth.accessToken) {
                  enqueueSnackbar(t(`enqueueSnackbar.downloadWaitingForLogin`), {
                    variant: "warning",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                  return
                }
                if (!(jwt_decode(auth.accessToken) as any).create_at) {
                  enqueueSnackbar(t(`enqueueSnackbar.downloadWaitingForActive`), {
                    variant: "warning",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                  return
                }
                window.open(`https://richelf.tech/api/v1/file/${props.file?.fid}/${props.aid}/${btoa(auth.accessToken)}`)
              }
            }}
          >
            {t(`detail.download`)}&nbsp;&nbsp;{filesizeHandler(props.file.filesize)}
          </Button>
        </Grid>
      }
      <Grid xs={screenSize === Medium && props.file && props.file.filesize ? 6 : 12} item={true}
            style={{display: 'flex', justifyContent: 'center'}}>
        <Button
          className={styles.ActionIcon}
          size={"small"}
          color={"secondary"}
          variant="outlined"
          startIcon={<SvgIcon viewBox={"0, 0, 350, 300"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 350, 300" width="350" height="300">
              <rect x="50" width="50" height="50" fill="#ad1d45" stroke="none"/>
              <rect x="100" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="200" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="250" width="50" height="50" fill="#d62d75" stroke="none"/>
              <rect y="50" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="50" y="50" width="50" height="50" fill="#ee2178" stroke="none"/>
              <rect x="100" y="50" width="50" height="50" fill="#ee2178" stroke="none"/>
              <rect x="150" y="50" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="200" y="50" width="50" height="50" fill="#ee2178" stroke="none"/>
              <rect x="250" y="50" width="50" height="50" fill="#f7b0cf" stroke="none"/>
              <rect x="300" y="50" width="50" height="50" fill="#ad1d45" stroke="none"/>
              <rect y="100" width="50" height="50" fill="#d62d75" stroke="none"/>
              <rect x="50" y="100" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="100" y="100" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="150" y="100" width="50" height="50" fill="#ad1d45" stroke="none"/>
              <rect x="200" y="100" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="250" y="100" width="50" height="50" fill="#d62d75" stroke="none"/>
              <rect x="300" y="100" width="50" height="50" fill="#ad1d45" stroke="none"/>
              <rect x="50" y="150" width="50" height="50" fill="#ad1d45" stroke="none"/>
              <rect x="100" y="150" width="50" height="50" fill="#ee2178" stroke="none"/>
              <rect x="150" y="150" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="200" y="150" width="50" height="50" fill="#ee2178" stroke="none"/>
              <rect x="250" y="150" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="100" y="200" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="150" y="200" width="50" height="50" fill="#d62d75" stroke="none"/>
              <rect x="200" y="200" width="50" height="50" fill="#d9195c" stroke="none"/>
              <rect x="150" y="250" width="50" height="50" fill="#ee2178" stroke="none"/>
            </svg>
          </SvgIcon>}
          onClick={async () => {
            if (props.aid) {
              if (!auth.accessToken) {
                enqueueSnackbar(t(`enqueueSnackbar.praiseWaitingForActive`), {
                  variant: "warning",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                return
              }
              if (!(jwt_decode(auth.accessToken) as any).create_at) {
                enqueueSnackbar(t(`enqueueSnackbar.praiseWaitingForLogin`), {
                  variant: "warning",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                return
              }
              const res = await Api.http.post(`/article/${props.aid}/star`, {}, {
                headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
              })
              if (res.status === 200) {
                enqueueSnackbar(t(`enqueueSnackbar.praiseSuccess`), {
                  variant: "success",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                return
              } else {
                enqueueSnackbar(t(`enqueueSnackbar.alreadyPraise`), {
                  variant: "warning",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
              }
            }
          }}
        >
          {t(`detail.star`)}
        </Button>
      </Grid>
    </Grid>
  </Box>
}
