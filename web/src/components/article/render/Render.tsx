import React, {useEffect} from "react";
import styles from "./Render.module.css"
import useScreenSize from "use-screen-size";
import {useTranslation} from "react-i18next";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";

import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CommentIcon from "@material-ui/icons/Comment";
import CodeIcon from "@material-ui/icons/Code";

import {LightAsync as SyntaxHighlighter} from 'react-syntax-highlighter';
import {gml} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import {BadgeAvatar} from "../../utils";

import {v4 as uuidv4} from 'uuid';

import {Medium, MiniWidth, Small, PLACEHOLDER, renderGenerateHtml, renderCopyHandler} from "../../../utils/util";

interface RenderProps {
  title: string,
  author: {
    username: string,
    avatar: string
  },
  createDate: string,
  content: string,
  praise: string,
  view: string,
  lang: string,
  comment: string,
  preview?: boolean,
  className?: string
}


export const Render: React.FC<RenderProps> = (
  {title, author, createDate, content, lang, praise, view, comment, preview, className}) => {
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const {t} = useTranslation()

  let innerHtml: string[]
  let codeSamples: string[]
  const Html = renderGenerateHtml(content)
  innerHtml = Html[0]
  codeSamples = Html[1]

  useEffect(() => {
    document.title = `RichELF | ${title}`
  })

  return <Box className={className ? className : styles.Container}>
    <Box className={styles.Title}>{title}</Box>
    <Box className={styles.Info}>
      <BadgeAvatar src={author.avatar} online={false} size={"small"}/>
      <span>{author.username}</span>
      <span className={styles.Dot}>•</span>
      <span>{createDate}</span>
    </Box>
    <Box className={styles.Info}>
      <span className={styles.Icon}><CodeIcon/>{lang}</span>
      <span className={styles.Dot}>•</span>
      <span className={styles.Icon}><CommentIcon/>{comment}</span>
      <span className={styles.Dot}>•</span>
      <span className={styles.Icon}><FavoriteBorderIcon/>{praise}</span>
      <span className={styles.Dot}>•</span>
      <span className={styles.Icon}><VisibilityIcon/>{view}</span>
    </Box>
    {
      innerHtml.map((html) => {
        const key = uuidv4()
        return html === PLACEHOLDER ?
          <Box style={screenSize === Small ? {fontSize: '10px'} : {fontSize: '16px'}} key={key}>
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
              language={lang}
              showLineNumbers={true}
              children={codeSamples.shift()}
              id={key}
            />
          </Box> :
          <Box
            className={screenSize === Small ? styles.Render : undefined} key={uuidv4()}
            dangerouslySetInnerHTML={{__html: html}}/>
      })
    }
    {
      !preview && <Box style={{display: "flex", justifyContent: "space-evenly", height: '32px'}}>
        <Button
          className={styles.ActionIcon}
          size={"small"}
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
        >
          {t(`detail.praise`)}
        </Button>
      </Box>
    }
  </Box>
}