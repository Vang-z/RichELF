import React, {useEffect, useCallback} from "react";
import styles from "./Moments.module.css";
import {useTranslation} from "react-i18next";
import {v4 as uuid4} from "uuid";
import {Link, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {getMoments, momentsSlice} from "../../../redux/moments/slice";
import {useSelector} from "../../../redux/hooks";

import Box from "@mui/material/Box";

import CameraIcon from "@mui/icons-material/Camera";

import {BadgeAvatar, ProcessBar} from "../../utils";

import {SizeProps, Small} from "../../../utils/util";
import {LightAsync as SyntaxHighlighter} from "react-syntax-highlighter";
import {gml} from "react-syntax-highlighter/dist/esm/styles/hljs";


export const Moments: React.FC<SizeProps> = ({size}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const loading = useSelector(s => s.moments.loading)
  const momentsContent = useSelector(s => s.moments.content)

  useEffect(() => {
    dispatch(getMoments(1))
  }, [dispatch])

  const loadingMore = useCallback(() => {
    const loadingMore = document.getElementById(`footer`)
    if (loadingMore && !loading) {
      const offsetTop = loadingMore.offsetTop
      const scrollTop = document.documentElement.scrollTop
      const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      if ((offsetTop - scrollTop <= viewPortHeight + 960) && momentsContent && momentsContent.next) {
        dispatch(getMoments(momentsContent.next))
      }
    }
  }, [dispatch, momentsContent, loading])

  useEffect(() => {
    document.addEventListener('scroll', loadingMore)
    return () => document.removeEventListener('scroll', loadingMore)
  }, [loadingMore])

  useEffect(() => {
    return () => {
      dispatch(momentsSlice.actions.clearContent())
    }
  }, [dispatch])

  return <Box id={`activity`} className={styles.Container}>
    <Box>
      <h5 className={styles.Motto}>
        <CameraIcon/>&nbsp;{t('moments.motto')}
      </h5>
    </Box>
    {
      momentsContent && momentsContent.results.length !== 0 && <Box className={styles.ActivityBorder}>
        <span className={styles.ActivityTitle}>{t('moments.recently')}</span>
        {
          momentsContent.results.map((timeline: any) => {
            return <Box className={styles.TimelineBox} key={uuid4()}>
              <Box className={styles.TimelineDate}>
              <span className={styles.TimelineDateBox}>
                <span className={styles.TimelineDateDay}>{timeline.year}-{timeline.month}-{timeline.day}</span>
              </span>
              </Box>
              {
                timeline.body.map((b: any) => {
                  return <Box className={styles.TimelineBody} key={uuid4()}>
                    <Box className={styles.TimelineIconBox}>
                      <BadgeAvatar className={styles.TimelineAvatar} size={"small"} src={b.author.avatar} online={false}
                                   user={b.author.username}/>
                    </Box>
                    <Box className={styles.TimelineContentBox}>
                      <Box className={styles.TimelineTitleHeader}>
                        <Box className={styles.TimelineTitleBox}>
                          <Link to={`/article/${b.id}`} className={styles.TimelineTitle}>{b.title}</Link>
                        </Box>
                        <Box className={styles.TimelineDateInfo}>
                          <span>{b.showDate.slice(11, 16)}</span>
                        </Box>
                      </Box>
                      <Box className={styles.TimelinePreview}>
                        <Box className={styles.TimelinePreviewDesc}>{b.desc}</Box>
                      </Box>
                      {
                        b.snapshot && <Box
                          className={styles.TimelineSnapshot}
                          style={size === Small ? {fontSize: '9px'} : undefined}
                          onClick={() => history.push(`/article/${b.id}`)}>
                          <span className={styles.TimelineSnapshotMore}>{t('moments.learnMore')}</span>
                          <SyntaxHighlighter
                            style={gml}
                            language="python"
                            showLineNumbers={false}
                            children={b.snapshot}
                          />
                        </Box>
                      }
                    </Box>
                  </Box>
                })
              }
            </Box>
          })
        }
        {
          loading &&
          <ProcessBar className={styles.Loading}/>
        }
      </Box>
    }

  </Box>
}