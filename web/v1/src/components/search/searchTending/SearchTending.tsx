import React, {useEffect} from "react";
import styles from "./SearchTending.module.css";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {searchSlice, getTending} from "../../../redux/search/slice";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import WhatshotIcon from "@mui/icons-material/Whatshot";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LoyaltyIcon from "@mui/icons-material/Loyalty";


export const SearchTending: React.FC = () => {
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const tending = useSelector(s => s.search.tending)

  useEffect(() => {
    dispatch(getTending())
  }, [dispatch])

  return <>
    <Box className={styles.TendingContainer}>
      <Box className={styles.TendingTitleContainer}>
        <WhatshotIcon/><p className={styles.TendingTitle}>{t('searchTending.tending')}</p>
      </Box>
      <Box className={styles.TendingContentContainer}>
        {
          tending && tending.keywords.map((tending: any) => {
            return <li
              className={styles.TendingContent}
              key={tending.kid}
              onClick={() => {
                dispatch(searchSlice.actions.dispatchKeywords(tending.content))
                history.push(`/search/${tending.content}`)
              }}
            >
              <TrendingUpIcon className={styles.TendingKeywordIcon}/>
              <p className={styles.TendingKeyword}>{tending.content}</p>
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
          tending && tending.users.map((user: any) => {
            return <Button
              className={styles.TagBtn}
              size={"small"}
              variant={"outlined"}
              key={user.username}
              onClick={() => history.push(`/user/${user.username}`)}>
              <span className={styles.TagAvatar}><Avatar alt="..." src={user.avatar_url}/></span>
              <span className={styles.Hot}>{user.username}</span>
            </Button>
          })
        }
      </Box>
    </Box>
  </>
}
