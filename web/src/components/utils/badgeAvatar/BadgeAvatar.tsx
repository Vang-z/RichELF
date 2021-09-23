import React, {useEffect, useState} from "react";
import styles from "./BadgeAvatar.module.css";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import useScreenSize from "use-screen-size";
import {useSnackbar} from "notistack";
import {useSelector} from "../../../redux/hooks";
import jwt_decode from "jwt-decode";

import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";

import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from "@mui/icons-material/Close";

import {SizeProps, Small, Large, MiniWidth, Medium} from "../../../utils/util";
import Api from "../../../utils/api";


interface BadgeAvatarProps {
  src: string,
  online: boolean,
  className?: string,
  user?: string
}

const UserPanel: React.FC<{ username: string }> = ({username}) => {
  const [userInfo, setUserInfo] = useState<any>(null)
  const {t} = useTranslation()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const auth = useSelector(s => s.auth)
  const language = useSelector(s => s.language)

  useEffect(() => {
    Api.http.get(`/user/${username}`, {
      headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
    }).then(res => {
      if (res.status === 200) {
        setUserInfo(res.data.data)
      }
    })
  }, [auth, username])

  if (!userInfo) return <></>
  return <Box className={styles.UserPanelBox} onClick={e => e.preventDefault()}>
    <Box className={styles.UserPanelHeader}>
      <Link to={`/user/${userInfo.username}`}>
        <BadgeAvatar size={"medium"} src={userInfo.avatar_url} online={false}/>
      </Link>
      <Box className={styles.UserPanelInfo}>
        <Link to={`/user/${userInfo.username}`}>
          <span className={styles.Username}>{userInfo.username}</span>
        </Link>
        <span className={styles.UserDesc}>{userInfo.bio}</span>
      </Box>
    </Box>
    {
      language.lang === 'zh' ?
        <Box className={styles.UserPanelContent}>
          <span className={styles.UserPreviewInfo}><SupervisorAccountIcon/>{userInfo.followers} {t(`profile.follower`)}</span>
          <span className={styles.UserDot}>•</span>
          <span className={styles.UserPreviewInfo}><GroupIcon/>{userInfo.followings} {t(`profile.following`)}</span>
        </Box> :
        <>
          <Box className={styles.UserPanelContent}>
            <span className={styles.UserPreviewInfo}><SupervisorAccountIcon/>
              {userInfo.followers} {t(`profile.follower`)}
            </span>
          </Box>
          <Box className={styles.UserPanelContent}>
            <span className={styles.UserPreviewInfo}><GroupIcon/>{userInfo.followings} {t(`profile.following`)}</span>
          </Box>
        </>
    }
    <Box className={styles.UserPanelFooter}>
      {
        userInfo.is_followed ?
          <Button
            className={styles.UserPanelBtn} size={"small"} variant={"outlined"}
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
            className={styles.UserPanelBtn} size={"small"} variant={"outlined"}
            onClick={() => {
              if (!auth.accessToken) {
                enqueueSnackbar(t(`enqueueSnackbar.followWaitingForLogin`), {
                  variant: "warning",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                return
              }
              if (!(jwt_decode(auth.accessToken) as any).create_at) {
                enqueueSnackbar(t(`enqueueSnackbar.followWaitingForActive`), {
                  variant: "warning",
                  action: key => <IconButton
                    disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                })
                return
              }
              if ((jwt_decode(auth.accessToken) as any).uid === userInfo.uid) {
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

export const BadgeAvatar: React.FC<BadgeAvatarProps & SizeProps> = ({src, online, size, className, user}) => {
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small

  if (user === undefined) {
    return <Box className={className === undefined ? styles.BadgeContainer : className}>
      <Badge
        className={styles.Badge}
        overlap="circular"
        anchorOrigin={{vertical: 'bottom', horizontal: 'right',}}
        variant={online ? "dot" : "standard"}>
        <Avatar
          alt="..." src={src}
          classes={size === Small ? {root: styles.BadgeSmall} : size === Large ? {root: styles.BadgeLarge} : undefined}/>
      </Badge>
    </Box>
  }
  if (screenSize === Small) {
    return <Box className={className === undefined ? styles.BadgeContainer : className}>
      <object>
        <Link to={`/user/${user}`}>
          <Badge
            className={styles.Badge}
            overlap="circular"
            anchorOrigin={{vertical: 'bottom', horizontal: 'right',}}
            variant={online ? "dot" : "standard"}>
            <Avatar
              alt="..." src={src}
              classes={size === Small ? {root: styles.BadgeSmall} : size === Large ? {root: styles.BadgeLarge} : undefined}/>
          </Badge>
        </Link>
      </object>
    </Box>
  }

  return <Box className={className === undefined ? styles.BadgeContainer : className}>
    <Tooltip
      title={<UserPanel username={user}/>}
      classes={{
        tooltip: styles.Tooltip,
      }}>
      <object>
        <Link to={`/user/${user}`}>
          <Badge
            className={styles.Badge}
            overlap="circular"
            anchorOrigin={{vertical: 'bottom', horizontal: 'right',}}
            variant={online ? "dot" : "standard"}>
            <Avatar
              alt="..." src={src}
              classes={size === Small ? {root: styles.BadgeSmall} : size === Large ? {root: styles.BadgeLarge} : undefined}/>
          </Badge>
        </Link>
      </object>
    </Tooltip>
  </Box>
}
