import React from "react";
import styles from "./Timeline.module.css"
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {v4 as uuid4} from "uuid";
import {useDispatch} from "react-redux";
import {getTimeline} from "../../../redux/profile/slice";
import {useSelector} from "../../../redux/hooks";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import GestureIcon from '@mui/icons-material/Gesture';
import RemoveIcon from '@mui/icons-material/Remove';


export const Timeline: React.FC<{ username: string }> = ({username}) => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const timelines = useSelector(s => s.profile.timelines)

  /**
   * @param {action} action - 0: 加入社区 1: 浏览 2: 关注 3: 取关 4: 点赞 5: 下载 6: 评论 7: 发布 8: 修改 9: 删除
   * **/
  const iconHandler = (action: number) => {
    switch (action) {
      case 0:
        return <AccountBalanceIcon/>
      case 1:
        return <EmojiFoodBeverageIcon/>
      case 2:
        return <EmojiFlagsIcon/>
      case 3:
        return <FlashOnIcon/>
      case 4:
        return <FavoriteIcon/>
      case 5:
        return <CloudDownloadIcon/>
      case 6:
        return <QuestionAnswerIcon/>
      case 7:
        return <EmojiObjectsIcon/>
      case 8:
        return <GestureIcon/>
      case 9:
        return <RemoveIcon/>
    }
  }

  return <>
    {
      timelines && timelines.results.map((timeline: any) => {
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
                          if (b.obj) {
                            const s = b.obj.split('$_$')
                            if (s[0] === 'user') {
                              history.push(`/${s[0]}/${s[1]}`)
                            } else {
                              history.push(`/${s[0]}/${s[2]}`)
                            }
                          }
                        }}
                      >{b.action === 0 ? t(`timeline.community`) : b.obj.split('$_$')[1]}</span>
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
         hidden={timelines && !timelines.next}>
      <Button
        disableRipple={true} fullWidth={true} variant={"outlined"}
        onClick={() => dispatch(getTimeline({
          username: username,
          page: timelines.next
        }))}>{t(`profile.loadingMore`)}</Button>
    </Box>
  </>
}
