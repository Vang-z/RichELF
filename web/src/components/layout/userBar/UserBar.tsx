import React, {useState} from "react";
import styles from "./UserBar.module.css";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {authSlice} from "../../../redux/auth/slice";
import {useTranslation} from "react-i18next";
import {useHistory, useLocation} from "react-router-dom";
import jwt_decode from "jwt-decode";

import Box from "@mui/material/Box";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

import {BadgeAvatar} from "../../utils";

export const UserBar: React.FC = () => {
  const [userBarOpen, setUserBarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(true)
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const {t} = useTranslation()
  const token = useSelector(s => s.auth.accessToken)
  const user = token ? jwt_decode(token as string) as any : {}

  const userBarHandler = () => {
    setUserBarOpen(!userBarOpen)
  }

  const signOutHandler = () => {
    dispatch(authSlice.actions.clearToken())
  }

  const notificationsHandler = () => {
    setNotificationsOpen(!notificationsOpen)
  }

  const profileHandler = () => {
    userBarHandler()
    location.pathname !== `/user/${user.username}` && history.push(`/user/${user.username}`)
  }

  const settingsHandler = () => {
    userBarHandler()
    location.pathname !== `/user/${user.username}/settings` && history.push(`/user/${user.username}/settings`)
  }

  return <Box className={styles.UserBar}>
    <Box onClick={userBarHandler}>
      <BadgeAvatar className={styles.UserBarAvatar} size={"small"} online={true} src={user.avatar_url}/>
    </Box>
    <Drawer
      open={userBarOpen}
      onClose={userBarHandler}
      anchor={"right"}
      variant={"temporary"}
      classes={{
        paper: styles.UserDrawer
      }}
    >
      <List>
        <ListItem>
          <ListItemAvatar>
            <BadgeAvatar className={styles.DrawerAvatar} size={"medium"} online={true} src={user.avatar_url}/>
          </ListItemAvatar>
          <ListItemText primary={user.username} secondary={<span
            className={styles.UserDesc}>{user.bio}</span>}/>
        </ListItem>
      </List>
      <Divider/>
      <List>
        <ListItem button={true} onClick={profileHandler}>
          <ListItemIcon className={styles.DrawerIcon}><AccountCircleIcon/></ListItemIcon>
          <ListItemText primary={t(`userBar.profile`)}/>
        </ListItem>
        <ListItem button={true} onClick={settingsHandler}>
          <ListItemIcon className={styles.DrawerIcon}><SettingsIcon/></ListItemIcon>
          <ListItemText primary={t(`userBar.settings`)}/>
        </ListItem>
        <ListItem button={true} onClick={signOutHandler}>
          <ListItemIcon className={styles.DrawerIcon}><ExitToAppIcon/></ListItemIcon>
          <ListItemText primary={t(`userBar.signOut`)}/>
        </ListItem>
      </List>
      <Divider/>
      <List>
        <ListItem button={true} onClick={notificationsHandler}>
          <ListItemIcon className={styles.DrawerIcon}><NotificationsIcon/></ListItemIcon>
          <ListItemText primary={t(`userBar.notifications`)}/>
          {notificationsOpen ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
        </ListItem>
        <Collapse in={notificationsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button={true}>
              <ListItemIcon className={styles.NotificationIcon}><InfoIcon/></ListItemIcon>
              <ListItemText className={styles.Notification} secondary={t(`userBar.notification`)}/>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  </Box>
}