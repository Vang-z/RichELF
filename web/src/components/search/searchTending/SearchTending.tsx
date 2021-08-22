import React, {useEffect} from "react";
import styles from "./SearchTending.module.css";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {searchSlice, getTendingKeywords, getTendingUser} from "../../../redux/search/slice";

import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import WhatshotIcon from "@material-ui/icons/Whatshot";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import LoyaltyIcon from "@material-ui/icons/Loyalty";


export const SearchTending: React.FC = () => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const tendingKeywords = useSelector(s => s.search.tendingKeywords)
  const tendingUser = useSelector(s => s.search.tendingUser)

  useEffect(() => {
    dispatch(getTendingKeywords())
    dispatch(getTendingUser())
  }, [dispatch])

  return <>
    <Box className={styles.TendingContainer}>
      <Box className={styles.TendingTitleContainer}>
        <WhatshotIcon/><p className={styles.TendingTitle}>{t('searchTending.tending')}</p>
      </Box>
      <Box className={styles.TendingContentContainer}>
        {
          tendingKeywords && tendingKeywords.data.map((tending: any) => {
            return <li
              className={styles.TendingContent}
              key={tending.id}
              onClick={() => {
                dispatch(searchSlice.actions.dispatchKeywords(tending.title))
                history.push(`/search/${tending.title}`)
              }}
            >
              <TrendingUpIcon className={styles.TendingKeywordIcon}/>
              <p className={styles.TendingKeyword}>{tending.title}</p>
            </li>
          })
        }
      </Box>
    </Box>
    <Box className={styles.TagContainer}>
      <Box className={styles.TagTitleContainer}>
        <LoyaltyIcon/><p className={styles.TagTitle}>{t('searchTending.tag')}</p>
      </Box>
      <Box className={styles.TagContentContainer}>
        {
          tendingUser && tendingUser.data.map((user: any) => {
            return <Button
              className={styles.TagBtn}
              size={"small"}
              variant={"outlined"}
              key={user.username}
              onClick={() => history.push(`/user/${user.username}`)}>
              <span className={styles.TagAvatar}><Avatar alt="..." src={user.avatar}/></span>
              <span className={styles.Hot}>{user.username}</span>
            </Button>
          })
        }
      </Box>
    </Box>
  </>
}
