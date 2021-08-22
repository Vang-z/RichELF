import React from "react";
import styles from "./JoinUs.module.css"
import {useTranslation} from "react-i18next";
import useScreenSize from "use-screen-size";
import {useDispatch} from "react-redux";
import {loginBoxSlice} from "../../../redux/loginBox/slice";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

import AvatarGroup from '@material-ui/lab/AvatarGroup';

import {Medium, MiniWidth, Small} from "../../../utils/util";

const avatar = require("../../../assets/images/avatar.jpg")


export const JoinUs: React.FC = () => {
  const {t} = useTranslation()
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const dispatch = useDispatch()

  return <>
    <Box id={`joinUs`} className={styles.Container}>
      <h5>{t('joinUs.ad')}</h5>
      <AvatarGroup
        className={styles.Icon}
        max={screenSize === Medium ? 12 : 3}
        classes={{
          avatar: styles.IconDetail
        }}
      >
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
        <Avatar src={avatar.default}/>
      </AvatarGroup>
      <Button
        className={styles.Btn}
        size={"large"}
        variant={"outlined"}
        onClick={() => {
          dispatch(loginBoxSlice.actions.dispatchOpen({open: true, type: 'register'}))
        }}>{t('joinUs.join')}</Button>
    </Box>
  </>
}
