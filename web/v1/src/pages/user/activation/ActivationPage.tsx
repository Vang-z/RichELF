import React, {useEffect} from "react";
import useScreenSize from "use-screen-size";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {authSlice} from "../../../redux/auth/slice";
import jwt_decode from "jwt-decode";

import {MainLayout} from "../../../layouts";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";

import {MiniWidth, Small, Medium} from "../../../utils/util";
import Api from "../../../utils/api";

interface SettingPageParams {
  key: string,
}


export const ActivationPage: React.FC = () => {
  const size = useScreenSize().width >= MiniWidth ? Medium : Small
  const {key} = useParams<SettingPageParams>()
  const history = useHistory()
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();

  useEffect(() => {
    Api.http.put(`/token/activation/${key}`).then(res => {
      dispatch(authSlice.actions.setToken({
        accessToken: res.data.access_token,
        tokenType: res.data.token_type
      }))
      enqueueSnackbar(t(`enqueueSnackbar.activeSuccess`), {
        variant: "success",
        action: key => <IconButton disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
      })
      history.replace(`/user/${(jwt_decode(res.data.access_token) as any).username}/settings`)
    }).catch(err => {
      enqueueSnackbar(err.response.data.detail.msg, {
        variant: "warning",
        action: key => <IconButton disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
      })
      history.replace(`/`)
    })
  }, [dispatch, key, history, t, enqueueSnackbar, closeSnackbar])


  useEffect(() => {
    document.title = `RichELF | ${t(`page.active`)}`
  }, [t])

  return <>
    <MainLayout size={size}/>
  </>
}
