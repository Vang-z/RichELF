import React, {useCallback, useEffect} from "react";
import styles from "./Content.module.css"
import {useHistory} from "react-router-dom"
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {getDatasets, getRecommendDatasets, datasetSlice} from "../../../redux/dataset/slice";

import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SwapRightOutlined from "@ant-design/icons/SwapRightOutlined";

import {RangeDataPiker, DataPiker, DatasetPreview, ProcessBar} from "../../utils";

import {SizeProps, Medium} from "../../../utils/util";
import Api from "../../../utils/api";


export const Content: React.FC<SizeProps> = ({size}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const mainDatasets = useSelector(s => s.dataset.mainContent)
  const recommendDatasets = useSelector(s => s.dataset.recommendContent)
  const loading = useSelector(s => s.dataset.loading)


  const loadingPages = useCallback(() => {
    const loadingMore = document.getElementById(`loadingMore`)
    if (loadingMore) {
      const offsetTop = loadingMore.offsetTop
      const scrollTop = document.documentElement.scrollTop
      const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

      if ((offsetTop - scrollTop <= viewPortHeight + 100) && mainDatasets && mainDatasets.nextPage && !loading) {
        dispatch(getDatasets(mainDatasets.nextPage))
      }
    }
  }, [dispatch, loading, mainDatasets])

  useEffect(() => {
    document.addEventListener('scroll', loadingPages)
    return () => document.removeEventListener('scroll', loadingPages)
  }, [loadingPages])

  useEffect(() => {
    dispatch(getDatasets(1))
    dispatch(getRecommendDatasets())
    return () => {
      dispatch(datasetSlice.actions.clearContent())
    }
  }, [dispatch])

  return <Fade in={true} timeout={500}>
    {
      size === Medium ?
        <Box className={styles.DatasetContainer}>
          <Box>
            <Box className={styles.AppBarContainer}>
              <Box className={styles.TendingBar}>
                <Box className={styles.TendingBarTitle}>{t(`content.popularRecommend`)}</Box>
                {
                  recommendDatasets && recommendDatasets.data.map((dataset: any) => {
                    return <DatasetPreview
                      className={styles.Tending}
                      key={dataset.id}
                      id={dataset.id}
                      title={dataset.title}
                      desc={dataset.desc}
                      author={dataset.author}
                      date={dataset.date}
                      download={dataset.download}
                      comment={dataset.comment}
                      praise={dataset.praise}
                      view={dataset.view}/>
                  })
                }
              </Box>
            </Box>
          </Box>
          <Box className={styles.DatasetContent}>
            <Box className={styles.ActionBar}>
              <Box className={styles.DateBox}>
                <RangeDataPiker
                  className={styles.DatePicker}
                  changeHandler={(e) => {
                    console.log(e)
                  }}
                />
                <Button className={styles.DateBtn} variant={"outlined"}>{t(`content.reset`)}</Button>
                <Button className={styles.DateBtn} variant={"outlined"}>{t(`content.filter`)}</Button>
              </Box>

              <Button
                className={styles.ActionBtn}
                variant={"outlined"}
                startIcon={<CloudUploadIcon/>}
                onClick={() => {
                  Api.getUUID().then(res => {
                    history.push(`/user/Vang_z/dataset/${res.data.data}`)
                  })
                }}
              >{t(`searchResult.newDataset`)}</Button>
            </Box>
            {
              mainDatasets && mainDatasets.data.map((dataset: any) => {
                return <DatasetPreview
                  key={dataset.id}
                  id={dataset.id}
                  title={dataset.title}
                  desc={dataset.desc}
                  author={dataset.author}
                  date={dataset.date}
                  download={dataset.download}
                  comment={dataset.comment}
                  praise={dataset.praise}
                  view={dataset.view}/>
              })
            }
            <Box p={2} id={`loadingMore`}>
              <Box className={styles.loadingMore}>
                {
                  mainDatasets && mainDatasets.nextPage !== null ?
                    <ProcessBar/> : <span>{t(`content.end`)}</span>
                }
              </Box>
            </Box>
          </Box>
        </Box> :
        <Box className={styles.DatasetContainerMini}>
          <Box className={styles.DatePickerContainerMini}>
            <DataPiker
              changeHandler={(e) => console.log(e)}
              placeholder={t(`content.startDate`)}/>
            <SwapRightOutlined style={{margin: '0 10px', color: 'rgba(255, 255, 255, 0.3)'}}/>
            <DataPiker
              changeHandler={(e) => console.log(e)}
              placeholder={t(`content.endDate`)}/>
          </Box>
          <Box className={styles.DatePickerBtnContainerMini}>
            <ButtonGroup>
              <Button variant={"outlined"} size={"small"}>重置</Button>
              <Button variant={"outlined"} size={"small"}>过滤</Button>
            </ButtonGroup>
          </Box>
          <Divider style={{width: '88%', margin: "0 auto"}}/>
          <Box className={styles.DatasetContentMini}>
            {
              mainDatasets && mainDatasets.data.map((dataset: any) => {
                return <DatasetPreview
                  key={dataset.id}
                  id={dataset.id}
                  title={dataset.title}
                  desc={dataset.desc}
                  author={dataset.author}
                  date={dataset.date}
                  download={dataset.download}
                  comment={dataset.comment}
                  praise={dataset.praise}
                  view={dataset.view}/>
              })
            }
          </Box>
          <Box p={2} id={`loadingMore`}>
            <Box className={styles.loadingMore}>
              {
                mainDatasets && mainDatasets.nextPage !== null ?
                  <ProcessBar/>: <span>{t(`content.end`)}</span>
              }
            </Box>
          </Box>
        </Box>
    }
  </Fade>
}
