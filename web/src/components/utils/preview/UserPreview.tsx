import React from "react";
import styles from "./Preview.module.css"
import {Link} from "react-router-dom";
import useScreenSize from "use-screen-size";
import {useTranslation} from "react-i18next";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import {BadgeAvatar} from "../../utils";

import DescriptionIcon from '@material-ui/icons/Description';
import StorageIcon from '@material-ui/icons/Storage';
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import GroupIcon from '@material-ui/icons/Group';

import {Medium, MiniWidth, Small} from "../../../utils/util";

interface UserPreviewProps {
  username: string,
  avatar: string,
  desc: string,
  article: number | string,
  dataset: number | string,
  praise: number | string,
  follower: number | string,
  following: number | string,
  followed: boolean
}

export const UserPreview: React.FC<UserPreviewProps> = (props) => {
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const {t} = useTranslation()

  return <>
    <Box className={styles.UserPreview}>
      <Box className={styles.UserMainContent}>
        <Box className={styles.UserHeader}>
          <BadgeAvatar size={"medium"} src={props.avatar} online={false}/>
          <Box className={styles.UserInfo}>
            <Link to={`/user/${props.username}`}>
              <span className={styles.Username}>{props.username}</span>
            </Link>
            <span className={styles.UserDesc}>{props.desc}</span>
          </Box>
        </Box>
        <Box className={styles.UserContent}>
          <span className={styles.UserPreviewInfo}><DescriptionIcon/>{props.article}</span>
          <span className={styles.UserDot}>•</span>
          <span className={styles.UserPreviewInfo}><StorageIcon/>{props.dataset}</span>
          <span className={styles.UserDot}>•</span>
          <span className={styles.UserPreviewInfo}><FavoriteBorderIcon/>{props.praise}</span>
          {
            screenSize === Medium && <>
              <span className={styles.UserDot}>•</span>
              <span className={styles.UserPreviewInfo}><SupervisorAccountIcon/>{props.follower}</span>
              <span className={styles.UserDot}>•</span>
              <span className={styles.UserPreviewInfo}><GroupIcon/>{props.following}</span>
            </>
          }
        </Box>
      </Box>
      <Box className={styles.UserActionBox}>
        {
          props.followed ?
            <Button variant={"outlined"} size={"small"}>{t(`profile.unfollow`)}</Button> :
            <Button variant={"outlined"} size={"small"}>{t(`profile.follow`)}</Button>
        }
      </Box>
    </Box>
  </>
}
