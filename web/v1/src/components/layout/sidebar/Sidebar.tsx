import React from "react";
import styles from "./Sidebar.module.css";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {sidebarSlice} from "../../../redux/sidebar/slice";
import {languageSlice} from "../../../redux/lang/slice";
import {useTranslation} from "react-i18next";
import {useHistory, useLocation} from "react-router-dom";

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Input from "@mui/material/Input";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

import ListIcon from '@mui/icons-material/List';
import SearchIcon from '@mui/icons-material/Search';
import CameraIcon from '@mui/icons-material/Camera';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import TranslateIcon from "@mui/icons-material/Translate";


export const Sidebar: React.FC = () => {
  const sidebar = useSelector(s => s.sidebar)
  const language = useSelector(s => s.language)
  const dispatch = useDispatch()
  const history = useHistory()
  const {t} = useTranslation()
  const location = useLocation()

  const sidebarHandler = () => {
    dispatch(sidebarSlice.actions.closeSidebar())
  }

  const navHandler = (path: string) => () => {
    history.push(path)
    sidebarHandler()
  }

  return <Drawer
    open={sidebar.open}
    onClose={sidebarHandler}
    anchor={"left"}
    classes={{
      paper: styles.SidebarDrawer
    }}
  >
    <List className={styles.SidebarHeader}>
      <ListItem>
        <IconButton className={styles.SidebarHeaderIcon} size={"small"} onClick={sidebarHandler}>
          <ListIcon/>
        </IconButton>
        <svg width="120" height="48"
             viewBox="0 0 120 48">
          <g transform="matrix(0.7,0,0,0.7,2,5)"
             fill="#fff">
            <path
              d="M4.2773 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -12.07 q0 -0.80078125 0.56640625 -1.376953125 t1.3672 -0.57617 l10.469 0 q1.9140625 0 3.0078125 -1.2109375 q1.015625 -1.23046875 1.015625 -2.87109375 q0 -0.76171875 -0.3515625 -1.728515625 t-1.2207 -1.6699 t-2.4512 -0.70313 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 q2.578125 0 4.3359375 1.162109375 t2.6563 2.9883 t0.89844 3.8184 q0 3.06640625 -1.97265625 5.4296875 q-0.5078125 0.5859375 -1.30859375 1.162109375 t-1.9434 0.97656 t-2.666 0.40039 l-8.5156 0 l0 10.137 q0 0.80078125 -0.576171875 1.3671875 t-1.377 0.56641 z M20.684 40 q-1.07421875 0 -1.73828125 -1.09375 l-2.5586 -5.1758 q-0.1953125 -0.44921875 -0.1953125 -0.87890625 q0 -1.15234375 1.07421875 -1.71875 q0.4296875 -0.1953125 0.87890625 -0.1953125 q1.171875 0 1.73828125 1.09375 l2.5391 5.1758 q0.1953125 0.44921875 0.1953125 0.87890625 q0 1.15234375 -1.07421875 1.71875 q-0.4296875 0.1953125 -0.859375 0.1953125 z M28.08589375 40 q0.80078125 0 1.3671875 -0.56640625 t0.56641 -1.3672 l0 -24.141 q0 -0.80078125 -0.56640625 -1.3671875 t-1.3672 -0.56641 t-1.3672 0.56641 t-0.56641 1.3672 l0 24.141 q0 0.80078125 0.56640625 1.3671875 t1.3672 0.56641 z M48.32028125 40 q3.73046875 0 7.0703125 -1.9140625 q3.14453125 -1.875 5.01953125 -5 q0.25390625 -0.46875 0.25390625 -0.9765625 q0 -1.07421875 -0.9375 -1.6796875 q-0.48828125 -0.25390625 -0.9765625 -0.25390625 q-1.09375 0 -1.69921875 0.95703125 q-1.38671875 2.32421875 -3.720703125 3.65234375 t-5.0098 1.3281 q-2.79296875 0 -5.087890625 -1.3671875 t-3.6719 -3.6621 t-1.377 -5.0879 q0 -2.8125 1.376953125 -5.107421875 t3.6719 -3.6719 t5.0879 -1.377 q0.8203125 0 1.62109375 0.15625 l0.29297 0.019531 q0.64453125 0 1.2109375 -0.41015625 q0.7421875 -0.52734375 0.7421875 -1.5234375 q0 -0.625 -0.41015625 -1.201171875 t-1.2109 -0.71289 q-1.11328125 -0.1953125 -2.24609375 -0.1953125 q-3.84765625 0 -7.03125 1.904296875 t-5.0781 5.0781 t-1.8945 7.041 q0 3.84765625 1.89453125 7.03125 t5.0781 5.0781 t7.0313 1.8945 z M66.8944875 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -24.141 q0 -0.80078125 0.56640625 -1.3671875 t1.3672 -0.56641 t1.3672 0.56641 t0.56641 1.3672 l0 24.141 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M85.0971875 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -24.141 q0 -0.80078125 0.56640625 -1.3671875 t1.3672 -0.56641 t1.3672 0.56641 t0.56641 1.3672 l0 24.141 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M75.8591875 27.93 q-0.8203125 0 -1.38671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.377 t1.3867 -0.57617 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 z M109.063 40 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 q0 -0.8203125 0.56640625 -1.38671875 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3867 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M109.063 15.859000000000002 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3672 t-0.56641 1.3672 t-1.3672 0.56641 z M109.063 27.93 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.377 t1.3672 -0.57617 l15.41 0 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 z M131.13290625 40 q0.80078125 0 1.3671875 -0.56640625 t0.56641 -1.3672 q0 -0.8203125 -0.56640625 -1.38671875 t-1.3672 -0.56641 l-7.8906 0 q-4.43359375 0 -4.47265625 -6.38671875 l0 -15.801 q0 -0.80078125 -0.56640625 -1.3671875 t-1.3672 -0.56641 t-1.3672 0.56641 t-0.56641 1.3672 l0 15.801 q0 4.296875 1.81640625 6.97265625 q2.32421875 3.30078125 6.5234375 3.30078125 l7.8906 0 z M154.90284375 15.859000000000002 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3672 t-0.56641 1.3672 t-1.3672 0.56641 z M139.49214375 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -12.07 q0 -0.80078125 0.56640625 -1.376953125 t1.3672 -0.57617 l15.41 0 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 l-13.457 0 l0 10.137 q0 0.80078125 -0.56640625 1.3671875 t-1.3867 0.56641 z"/>
          </g>
        </svg>
      </ListItem>
    </List>
    <List className={styles.SidebarSearch}>
      <ListItem>
        <Input
          disableUnderline={true}
          className={styles.Search} placeholder={`${t('header.search')}`}
          onClick={() => {
            history.push(`/search`)
            sidebarHandler()
          }}
          startAdornment={<SearchIcon style={{margin: '0 12px'}}/>}
        />
      </ListItem>
    </List>
    <Divider/>
    <List>
      <ListItem
        button={true}
        disabled={location.pathname === `/`}
        onClick={navHandler(`/`)}
        className={location.pathname === `/` ? styles.Selected : undefined}
      >
        <ListItemIcon className={styles.DrawerIcon}><CameraIcon/></ListItemIcon>
        <ListItemText secondary={t(`header.home`)}/>
      </ListItem>
      <ListItem
        button={true}
        disabled={location.pathname === `/article`}
        onClick={navHandler(`/article`)}
        className={location.pathname.startsWith(`/article`) ? styles.Selected : undefined}
      >
        <ListItemIcon className={styles.DrawerIcon}><ViewQuiltIcon/></ListItemIcon>
        <ListItemText secondary={t(`header.article`)}/>
      </ListItem>
      <ListItem
        button={true}
        disabled={location.pathname === `/video`}
        onClick={navHandler(`/video`)}
        className={location.pathname.startsWith(`/video`) ? styles.Selected : undefined}
      >
        <ListItemIcon className={styles.DrawerIcon}><FeaturedVideoIcon/></ListItemIcon>
        <ListItemText secondary={t(`header.video`)}/>
      </ListItem>
      <ListItem
        button={true}
        disabled={location.pathname === `/about`}
        onClick={navHandler(`/about`)}
        className={location.pathname.startsWith(`/about`) ? styles.Selected : undefined}
      >
        <ListItemIcon className={styles.DrawerIcon}><ChangeHistoryIcon/></ListItemIcon>
        <ListItemText secondary={t(`header.about`)}/>
      </ListItem>
    </List>
    <Divider/>
    <List className={styles.LangList}>
      <ListItem className={styles.LangListLabel}>
        <TranslateIcon/><span>{t(`header.lang`)}</span>
      </ListItem>
      <ListItem>
        <RadioGroup row={true} value={language.lang} onChange={(event, value) => {
          dispatch(languageSlice.actions.changeLanguage(value))
        }}>
          {language.languageList.map(l => {
            return <FormControlLabel
              className={styles.LangRadio}
              key={l.code}
              value={l.code}
              control={<Radio color="default" size={"small"}/>}
              label={l.name}/>
          })}
        </RadioGroup>
      </ListItem>
    </List>
  </Drawer>
}