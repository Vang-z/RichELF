import React from "react";
import styles from "./Content.module.css"
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../../redux/hooks";
import {editorSlice} from "../../../../redux/editor/slice";

import Box from "@material-ui/core/Box";
import TextField from '@material-ui/core/TextField';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import SaveIcon from '@material-ui/icons/Save';
import TelegramIcon from '@material-ui/icons/Telegram';

import {Editor} from "../../../utils";
import {ArticleRender} from "../../../article";
import {dateFormatHandler} from "../../../../utils/util";

export const Content: React.FC = () => {
  const articleInfo = useSelector(s => s.editor)
  const auth = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const publishHandler = () => {
    console.log(articleInfo)
  }

  return <Box className={styles.ArticleContentContainer}>
    <ArticleRender
      className={styles.PreviewContainer}
      title={articleInfo.title}
      author={{username: auth.user?.username as string, avatar: auth.user?.avatar as string}}
      createDate={dateFormatHandler("comm", (new Date((new Date().getTime() + (new Date().getTimezoneOffset() * 60000)))).toString())}
      content={articleInfo.content}
      lang={articleInfo.lang}
      praise={`0`}
      view={`0`}
      comment={`0`}
      preview={true}
    />
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
            onChange={(event) => dispatch(editorSlice.actions.dispatchDesc(event.target.value as string))}
            fullWidth={true}/>
        </Box>
      </Box>
      <Box className={styles.EditorBar}>
        <Editor width={'100%'} height={860}/>
        <ButtonGroup className={styles.EditorBtn}>
          <Button startIcon={<SaveIcon/>} variant={"outlined"} size={"small"}>{t(`create.save`)}</Button>
          <Button startIcon={<TelegramIcon/>} variant={"outlined"} size={"small"}
                  onClick={publishHandler}>{t(`create.publish`)}</Button>
        </ButtonGroup>
      </Box>
    </Box>
  </Box>
}