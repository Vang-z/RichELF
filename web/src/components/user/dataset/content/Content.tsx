import React from "react";
import styles from "./Content.module.css"
import {useTranslation} from "react-i18next";
import {useSelector} from "../../../../redux/hooks";
import {editorSlice} from "../../../../redux/editor/slice";
import {useDispatch} from "react-redux";

import Box from "@material-ui/core/Box";
import TextField from '@material-ui/core/TextField';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import SaveIcon from '@material-ui/icons/Save';
import TelegramIcon from '@material-ui/icons/Telegram';

import {Editor, FileUpload} from "../../../utils";
import {DatasetRender} from "../../../dataset";
import {dateFormatHandler} from "../../../../utils/util";

export const Content: React.FC = () => {
  const datasetInfo = useSelector(s => s.editor)
  const auth = useSelector(s => s.auth)
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const publishHandler = () => {
    console.log(datasetInfo)
  }

  return <Box className={styles.DatasetContentContainer}>
    <DatasetRender
      className={styles.PreviewContainer}
      title={datasetInfo.title}
      author={{username: auth.user?.username as string, avatar: auth.user?.avatar as string}}
      createDate={dateFormatHandler("comm", (new Date((new Date().getTime() + (new Date().getTimezoneOffset() * 60000)))).toString())}
      content={datasetInfo.content}
      download={`0`}
      praise={`0`}
      view={`0`}
      comment={`0`}
      preview={true}
    />
    <Divider className={styles.VerticalDivider} orientation="vertical" flexItem={true}/>
    <Box className={styles.EditorContainer}>
      <Box className={styles.TitleBar}>
        <Box className={styles.InputBox}>
          <TextField
            className={styles.TitleInput}
            variant={"outlined"}
            label={t(`create.title`)}
            size={"small"}
            onChange={(event) => dispatch(editorSlice.actions.dispatchTitle(event.target.value as string))}
            fullWidth={true}/>
          <TextField
            className={styles.TitleInput}
            variant={"outlined"}
            label={t(`create.desc`)}
            size={"small"}
            onChange={(event) => dispatch(editorSlice.actions.dispatchDesc(event.target.value as string))}
            fullWidth={true}/>
        </Box>
        <Box className={styles.FilePondBox}>
          <FileUpload/>
        </Box>
      </Box>
      <Box className={styles.EditorBar}>
        <Editor width={'100%'} height={800}/>
        <ButtonGroup className={styles.EditorBtn}>
          <Button
            startIcon={<SaveIcon/>}
            variant={"outlined"}
            size={"small"}>{t(`create.save`)}</Button>
          <Button
            startIcon={<TelegramIcon/>}
            variant={"outlined"}
            size={"small"}
            onClick={publishHandler}>{t(`create.publish`)}</Button>
        </ButtonGroup>
      </Box>
    </Box>
  </Box>
}