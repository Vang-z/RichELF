import React, {useState} from "react";
import styles from "./Preview.module.css"
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {useSelector} from "../../../redux/hooks";
import jwt_decode from "jwt-decode";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import {BadgeAvatar} from "../../utils";

import AttachFileIcon from '@mui/icons-material/AttachFile';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from "@mui/icons-material/Close";

import Api from "../../../utils/api";

interface UserPreviewProps {
  className?: string,
  uid: string,
  username: string,
  avatar: string,
  bio: string,
  articles: number,
  followers: number,
  followings: number,
  is_followed: boolean
}

export const UserPreview: React.FC<UserPreviewProps> = (props) => {
  const [userInfo, setUserInfo] = useState({
    uid: props.uid,
    username: props.username,
    avatar: props.avatar,
    bio: props.bio,
    articles: props.articles,
    followers: props.followers,
    followings: props.followings,
    is_followed: props.is_followed
  })
  const {t} = useTranslation()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const auth = useSelector(s => s.auth)

  return <Box className={props.className ? props.className : styles.UserPreview}>
    <Box className={styles.UserMainContent}>
      <Box className={styles.UserHeader}>
        <BadgeAvatar size={"medium"} src={userInfo.avatar} online={false}/>
        <Box className={styles.UserInfo}>
          <Link to={`/user/${userInfo.username}`}>
            <span className={styles.Username}>{userInfo.username}</span>
          </Link>
          <span className={styles.UserDesc}>{userInfo.bio}</span>
        </Box>
      </Box>
      <Box className={styles.UserContent}>
        <span className={styles.UserPreviewInfo}>
          <AttachFileIcon/><span className={styles.InfoNum}>{userInfo.articles}</span>
        </span>
        <span className={styles.UserDot}>•</span>
        <span className={styles.UserPreviewInfo}>
          <SupervisorAccountIcon/><span className={styles.InfoNum}>{userInfo.followers}</span>
        </span>
        <span className={styles.UserDot}>•</span>
        <span className={styles.UserPreviewInfo}>
          <GroupIcon/><span className={styles.InfoNum}>{userInfo.followings}</span>
        </span>
      </Box>
    </Box>
    <Box className={styles.UserActionBox}>
      {
        userInfo.is_followed ?
          <Button
            variant={"outlined"} size={"small"}
            onClick={() => {
              Api.http.delete(`/user/friendship/${userInfo.uid}`, {
                headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
              }).then(res => {
                if (res.status === 200) {
                  enqueueSnackbar(t(`enqueueSnackbar.unfollowSuccess`), {
                    variant: "success",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                  setUserInfo({
                    ...userInfo,
                    is_followed: false,
                    followers: userInfo.followers - 1
                  })
                }
              })
            }}
          >{t(`profile.unfollow`)}</Button> :
          <Button
            variant={"outlined"} size={"small"}
            onClick={() => {
              if (!auth.accessToken) {
                enqueueSnackbar(t(`enqueueSnackbar.followWaitingForLogin`), {
                  variant: "warning",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                return
              }
              const user = jwt_decode(auth.accessToken) as any
              if (!user.create_at) {
                enqueueSnackbar(t(`enqueueSnackbar.followWaitingForActive`), {
                  variant: "warning",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                return
              }
              if (user.uid === userInfo.uid) {
                enqueueSnackbar(t(`enqueueSnackbar.followSelf`), {
                  variant: "warning",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                return
              }
              Api.http.post(`/user/friendship/${userInfo.uid}`, {}, {
                headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
              }).then(res => {
                if (res.status === 201) {
                  enqueueSnackbar(t(`enqueueSnackbar.followSuccess`), {
                    variant: "success",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                  setUserInfo({
                    ...userInfo,
                    is_followed: true,
                    followers: userInfo.followers + 1
                  })
                }
              })
            }}
          >{t(`profile.follow`)}</Button>
      }
    </Box>
  </Box>
}
