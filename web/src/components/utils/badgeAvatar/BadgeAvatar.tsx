import React, {useState} from "react";
import styles from "./BadgeAvatar.module.css";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import useScreenSize from "use-screen-size";

import Box from "@material-ui/core/Box";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import {SizeProps, Small, Large, MiniWidth, Medium} from "../../../utils/util";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

interface BadgeAvatarProps {
  src: string,
  online: boolean,
  className?: string,
  user?: string
}

const UserPanel: React.FC<{ username: string }> = ({username}) => {
  const {t} = useTranslation()

  const [userInfo] = useState({
    avatar: 'https://robohash.org/' + username,
    username: username,
    desc: 'But U can not make more time.',
    article: '241',
    dataset: '12',
    star: '411',
  })

  return <Box className={styles.UserPanelBox} onClick={e => e.preventDefault()}>
    <Box className={styles.UserPanelHeader}>
      <BadgeAvatar size={"medium"} src={userInfo.avatar} online={false}/>
      <Box className={styles.UserPanelInfo}>
        <Link to={`/user/${userInfo.username}`}>
          <span className={styles.Username}>{userInfo.username}</span>
        </Link>
        <span className={styles.UserDesc}>{userInfo.desc}</span>
      </Box>
    </Box>
    <Box className={styles.UserPanelContent}>
      <span className={styles.UserPreviewInfo}><DescriptionIcon/>{userInfo.article}</span>
      <span className={styles.UserDot}>•</span>
      <span className={styles.UserPreviewInfo}><StorageIcon/>{userInfo.dataset}</span>
      <span className={styles.UserDot}>•</span>
      <span className={styles.UserPreviewInfo}><FavoriteBorderIcon/>{userInfo.star}</span>
    </Box>
    <Box className={styles.UserPanelFooter}>
      <Button className={styles.UserPanelBtn} size={"small"} variant={"outlined"}>{t(`profile.follow`)}</Button>
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
      interactive={true}
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
