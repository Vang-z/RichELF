import React from "react";
import styles from "./Timeline.module.css"
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {v4 as uuid4} from "uuid";
import {useDispatch} from "react-redux";
import {getTimeline} from "../../../redux/profile/slice";
import {useSelector} from "../../../redux/hooks";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import EmojiFoodBeverageIcon from '@material-ui/icons/EmojiFoodBeverage';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';


export const Timeline: React.FC<{ username: string }> = ({username}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const timelines = useSelector(s => s.profile.timelines)

  const iconHandler = (action: string) => {
    switch (action) {
      case "join":
        return <AccountBalanceIcon/>
      case "comment":
        return <QuestionAnswerIcon/>
      case "follow":
        return <EmojiFlagsIcon/>
      case "view":
        return <EmojiFoodBeverageIcon/>
      case "praise":
        return <FavoriteIcon/>
      case "publish":
        return <EmojiObjectsIcon/>
      case "download":
        return <CloudDownloadIcon/>
    }
  }

  return <>
    {
      timelines && timelines.data.map((timeline: any) => {
        return <Box className={styles.TimelineBox} key={uuid4()}>
          <Box className={styles.TimelineDate}>
            <span className={styles.TimelineDateBox}>
              <span className={styles.TimelineDateMonth}>{t(`timeline.month.${timeline.month}`)}</span>
              <span>&nbsp;&nbsp;</span>
              <span className={styles.TimelineDateYear}>{timeline.year}</span>
            </span>
          </Box>
          {
            timeline.body.map((b: any) => {
              return <Box className={styles.TimelineBody} key={uuid4()}>
                <Box className={styles.TimelineIconBox}>
                  <Box className={styles.TimelineIcon}>
                    {iconHandler(b.action)}
                  </Box>
                </Box>
                <Box className={styles.TimelineContentBox}>
                  <Box className={styles.TimelineTitle}>
                    <Box className={styles.TimelineTitleBox}>
                      <span className={styles.TimelineTitleAction}>{t(`timeline.action.${b.action}`)}</span>
                      <span>&nbsp;&nbsp;</span>
                      <span
                        className={styles.TimelineTitleObj}
                        onClick={() => {
                          if (b.obj !== '') {
                            const s = b.obj.split('_')
                            const type = s[0]
                            const id = s[1]
                            history.push(`/${type}/${id}`)
                          }
                        }}
                      >{b.action === "join" ? t(`timeline.community`) : b.title}</span>
                    </Box>
                    <Box className={styles.TimelineDateInfo}>
                      <span>{b.date}</span>
                    </Box>
                  </Box>
                </Box>
              </Box>
            })
          }
        </Box>
      })
    }
    <Box className={styles.LoadingMore}
         hidden={timelines && !timelines.nextPage}>
      <Button
        disableRipple={true} fullWidth={true} variant={"outlined"}
        onClick={() => dispatch(getTimeline({
          username: username,
          page: timelines.nextPage
        }))}>{t(`profile.loadingMore`)}</Button>
    </Box>
  </>
}
