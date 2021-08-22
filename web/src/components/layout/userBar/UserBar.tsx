import React, {useState} from "react";
import styles from "./UserBar.module.css";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {authSlice, UserProps} from "../../../redux/auth/slice";
import {useTranslation} from "react-i18next";
import {useHistory, useLocation} from "react-router-dom";

import Box from "@material-ui/core/Box";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';

import {BadgeAvatar} from "../../utils";

export const UserBar: React.FC = () => {
  const [userBarOpen, setUserBarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(true)
  const auth = useSelector(s => s.auth)
  const user = auth.user as UserProps
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const {t} = useTranslation()

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
      <BadgeAvatar className={styles.UserBarAvatar} size={"small"} online={true} src={user.avatar}/>
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
            <BadgeAvatar className={styles.DrawerAvatar} size={"medium"} online={true} src={user.avatar}/>
          </ListItemAvatar>
          <ListItemText primary={user.username} secondary={<object className={styles.UserDesc}>{user.desc}</object>}/>
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
              <ListItemText className={styles.Notification} secondary="您的会员已过期，请及时续费"/>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  </Box>
}