import React, {useEffect} from "react";
import styles from "./Detail.module.css"
import useScreenSize from "use-screen-size";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {getDataset, datasetSlice} from "../../../redux/dataset/slice";

import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";

import {Render} from "../render";
import {Comment} from "../../utils";

import {Medium, MiniWidth, Small, dateFormatHandler} from "../../../utils/util";


export const Detail: React.FC<{ did: string }> = ({did}) => {
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const dispatch = useDispatch()
  const dataset = useSelector(s => s.dataset.dataset)

  useEffect(() => {
    dispatch(getDataset(did))
    return () => {
      dispatch(datasetSlice.actions.clearContent())
    }
  }, [did, dispatch])

  if (!dataset) return <></>
  return <Fade in={true} timeout={500}>
    <Box className={styles.Container}>
      <Render
        title={dataset.data.title}
        author={dataset.data.author}
        createDate={dateFormatHandler("comm", dataset.data.createDate)}
        download={dataset.data.download}
        star={dataset.data.star}
        view={dataset.data.view}
        comment={dataset.data.commentCount}
        content={dataset.data.content}
        datasetSize={dataset.data.datasetSize}
      />
      {
        (screenSize === Small && dataset.data.comments === undefined) ? <></> :
          <Comment commentsCount={dataset.data.commentCount} comments={dataset.data.comments}/>
      }
    </Box>
  </Fade>
}
