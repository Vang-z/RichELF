import React, {useEffect, useState} from "react";
import styles from "./JoinUs.module.css"
import {useTranslation} from "react-i18next";
import useScreenSize from "use-screen-size";
import {useDispatch} from "react-redux";
import {loginBoxSlice} from "../../../redux/loginBox/slice";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AvatarGroup from '@mui/material/AvatarGroup';

import {Medium, MiniWidth, Small} from "../../../utils/util";
import Api from "../../../utils/api";

import {v4 as uuid4} from "uuid";

export const JoinUs: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null)
  const {t} = useTranslation()
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const dispatch = useDispatch()

  useEffect(() => {
    Api.http.get(`/user?size=${screenSize}`).then(res => {
      if (res.status === 200) {
        setUserInfo(res.data.data)
      }
    })
  }, [screenSize])

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
        {
          userInfo && userInfo.results.map((src: string) => {
            return <Avatar key={uuid4()} src={src}/>
          })
        }
        {
          userInfo && userInfo.total &&
          <Avatar children={<span style={{
            fontSize: userInfo.total.length >= 4 ? 14 : 16,
            textTransform: "uppercase"
          }}>{userInfo.total}</span>}/>
        }
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
