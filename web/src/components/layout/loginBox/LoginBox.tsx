import React, {useEffect, useState} from "react";
import styles from "./LoginBox.module.css"
import useScreenSize from "use-screen-size";
import {useTranslation} from "react-i18next";
import {useSnackbar} from 'notistack';
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {loginBoxSlice} from "../../../redux/loginBox/slice";
import {authSlice} from "../../../redux/auth/slice";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from '@material-ui/core/Checkbox';

import CloseIcon from '@material-ui/icons/Close';
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Visibility from "@material-ui/icons/VisibilityOutlined";
import VisibilityOff from "@material-ui/icons/VisibilityOffOutlined";

import githubIcon from "../../../assets/images/github.svg"
import qqIcon from "../../../assets/images/qq.svg"
import googleIcon from "../../../assets/images/google.svg"
import {Medium, MiniWidth, Small} from "../../../utils/util";

const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJ0clI2b1NtQUtHcFZ1V3llUDV1WjI5IiwiZXhwIjoxNjI4NjUwNjA0fQ.l0Mcr_CJzouZhLrKy7RPn20RDj9HyN-wfO4vJI3Bnig'
const USER = {
  "uid": "5df73bde-a5c7-4ab0-9b21-64c5093d8b68",
  "last_login": "2021-08-04T10:56:44.677316+08:00",
  "is_superuser": true,
  "desc": "But U can not make more time.",
  "email": "vang-z@foxmail.com",
  "username": "Vang-z",
  "link": "https://vangz.club/user/Vang-z",
  "avatar": "https://vangz.club/media/avatar/trR6oSmAKGpVuWyeP5uZ29/WpgAk6ckPKU8vRawTtg2WS.jpg",
  "telephone": null,
  "date_joined": "2020-03-31T13:16:40.780282+08:00",
  "is_active": true,
  "is_staff": true,
  "coin": 0,
  "follow": []
}


export const LoginBox: React.FC = () => {
  const dispatch = useDispatch()
  const screenSize = useScreenSize().width >= MiniWidth ? Medium : Small
  const loginBoxStatus = useSelector(s => s.loginBox)
  const {t} = useTranslation()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const [tab, setTab] = useState(0)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false)
  const [checkRegisterPasswordVisible, setCheckRegisterPasswordVisible] = useState(false)
  const [agreement, setAgreement] = useState(true)

  const closeModalHandler = () => {
    dispatch(loginBoxSlice.actions.dispatchOpen({open: false, type: 'login'}))
  };
  useEffect(() => {
    switch (loginBoxStatus.type) {
      case "login":
        setTab(0)
        return
      case "register":
        setTab(1)
        return
    }
  }, [loginBoxStatus])

  const loginHandler = () => {
    dispatch(authSlice.actions.setToken({user: USER, token: TOKEN}))
    closeModalHandler()
    enqueueSnackbar('登陆成功', {
      variant: "success",
      action: key => <IconButton disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
    })
  }

  const containerStyle = (screenSize === Medium ? styles.Container : styles.MiniContainer)
  const tabStyle = (screenSize === Medium ? styles.Tab : styles.MiniTab)
  const formControlStyle = (screenSize === Medium ? styles.FormControl : styles.MiniFormControl)
  const inputStyle = (screenSize === Medium ? styles.Input : styles.MiniInput)
  const btnStyle = (screenSize === Medium ? styles.Btn : styles.MiniBtn)
  const oauthBoxStyle = (screenSize === Medium ? styles.OauthBox : styles.MiniOauthBox)
  const agreementBoxStyle = (screenSize === Medium ? styles.AgreementBox : styles.MiniAgreementBox)

  return <Modal
    open={loginBoxStatus.open}
    onClose={closeModalHandler}
    closeAfterTransition={true}
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
  >
    <Fade in={loginBoxStatus.open}>
      <Box className={styles.MainContainer}>
        <Paper className={styles.MainBox}>
          {
            screenSize === Medium &&
            <Box className={styles.TitleBox}>
              <svg width="270" height="64"
                   viewBox="0 0 270 36">
                <g transform="matrix(1.6,0,0,1.6,5,-20)"
                   fill="#fff">
                  <path
                    d="M4.2773 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -12.07 q0 -0.80078125 0.56640625 -1.376953125 t1.3672 -0.57617 l10.469 0 q1.9140625 0 3.0078125 -1.2109375 q1.015625 -1.23046875 1.015625 -2.87109375 q0 -0.76171875 -0.3515625 -1.728515625 t-1.2207 -1.6699 t-2.4512 -0.70313 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 q2.578125 0 4.3359375 1.162109375 t2.6563 2.9883 t0.89844 3.8184 q0 3.06640625 -1.97265625 5.4296875 q-0.5078125 0.5859375 -1.30859375 1.162109375 t-1.9434 0.97656 t-2.666 0.40039 l-8.5156 0 l0 10.137 q0 0.80078125 -0.576171875 1.3671875 t-1.377 0.56641 z M20.684 40 q-1.07421875 0 -1.73828125 -1.09375 l-2.5586 -5.1758 q-0.1953125 -0.44921875 -0.1953125 -0.87890625 q0 -1.15234375 1.07421875 -1.71875 q0.4296875 -0.1953125 0.87890625 -0.1953125 q1.171875 0 1.73828125 1.09375 l2.5391 5.1758 q0.1953125 0.44921875 0.1953125 0.87890625 q0 1.15234375 -1.07421875 1.71875 q-0.4296875 0.1953125 -0.859375 0.1953125 z M28.08589375 40 q0.80078125 0 1.3671875 -0.56640625 t0.56641 -1.3672 l0 -24.141 q0 -0.80078125 -0.56640625 -1.3671875 t-1.3672 -0.56641 t-1.3672 0.56641 t-0.56641 1.3672 l0 24.141 q0 0.80078125 0.56640625 1.3671875 t1.3672 0.56641 z M48.32028125 40 q3.73046875 0 7.0703125 -1.9140625 q3.14453125 -1.875 5.01953125 -5 q0.25390625 -0.46875 0.25390625 -0.9765625 q0 -1.07421875 -0.9375 -1.6796875 q-0.48828125 -0.25390625 -0.9765625 -0.25390625 q-1.09375 0 -1.69921875 0.95703125 q-1.38671875 2.32421875 -3.720703125 3.65234375 t-5.0098 1.3281 q-2.79296875 0 -5.087890625 -1.3671875 t-3.6719 -3.6621 t-1.377 -5.0879 q0 -2.8125 1.376953125 -5.107421875 t3.6719 -3.6719 t5.0879 -1.377 q0.8203125 0 1.62109375 0.15625 l0.29297 0.019531 q0.64453125 0 1.2109375 -0.41015625 q0.7421875 -0.52734375 0.7421875 -1.5234375 q0 -0.625 -0.41015625 -1.201171875 t-1.2109 -0.71289 q-1.11328125 -0.1953125 -2.24609375 -0.1953125 q-3.84765625 0 -7.03125 1.904296875 t-5.0781 5.0781 t-1.8945 7.041 q0 3.84765625 1.89453125 7.03125 t5.0781 5.0781 t7.0313 1.8945 z M66.8944875 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -24.141 q0 -0.80078125 0.56640625 -1.3671875 t1.3672 -0.56641 t1.3672 0.56641 t0.56641 1.3672 l0 24.141 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M85.0971875 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -24.141 q0 -0.80078125 0.56640625 -1.3671875 t1.3672 -0.56641 t1.3672 0.56641 t0.56641 1.3672 l0 24.141 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M75.8591875 27.93 q-0.8203125 0 -1.38671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.377 t1.3867 -0.57617 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 z M109.063 40 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 q0 -0.8203125 0.56640625 -1.38671875 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3867 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M109.063 15.859000000000002 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3672 t-0.56641 1.3672 t-1.3672 0.56641 z M109.063 27.93 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.377 t1.3672 -0.57617 l15.41 0 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 z M131.13290625 40 q0.80078125 0 1.3671875 -0.56640625 t0.56641 -1.3672 q0 -0.8203125 -0.56640625 -1.38671875 t-1.3672 -0.56641 l-7.8906 0 q-4.43359375 0 -4.47265625 -6.38671875 l0 -15.801 q0 -0.80078125 -0.56640625 -1.3671875 t-1.3672 -0.56641 t-1.3672 0.56641 t-0.56641 1.3672 l0 15.801 q0 4.296875 1.81640625 6.97265625 q2.32421875 3.30078125 6.5234375 3.30078125 l7.8906 0 z M154.90284375 15.859000000000002 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3672 t-0.56641 1.3672 t-1.3672 0.56641 z M139.49214375 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -12.07 q0 -0.80078125 0.56640625 -1.376953125 t1.3672 -0.57617 l15.41 0 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 l-13.457 0 l0 10.137 q0 0.80078125 -0.56640625 1.3671875 t-1.3867 0.56641 z"/>
                </g>
              </svg>
            </Box>
          }
          <IconButton disableRipple={true} className={styles.CloseBtn}
                      onClick={closeModalHandler}><CloseIcon/></IconButton>
          <Box className={containerStyle}>
            <AppBar position="static">
              <Tabs
                value={tab}
                onChange={(e, value) => {
                  setTab(value)
                }}
                variant={"standard"}
                className={styles.Tabs}
                classes={{
                  indicator: styles.IndicatorColor
                }}
              >
                <Tab
                  className={tabStyle}
                  classes={{selected: styles.TabSelected}}
                  label={t(`loginBox.login`)}
                  disableRipple={true}/>
                <Tab
                  className={tabStyle}
                  classes={{selected: styles.TabSelected}}
                  label={t(`loginBox.register`)}
                  disableRipple={true}/>
              </Tabs>
            </AppBar>
            <Box hidden={tab !== 0}>
              {
                tab === 0 &&
                <Box className={styles.LoginContent}>
                  <FormControl className={formControlStyle}>
                    <InputLabel className={styles.InputLabel}>{t(`loginBox.email`)}<small
                      className={styles.SmallFont}>{t(`loginBox.required`)}</small></InputLabel>
                    <Input
                      className={inputStyle}
                      endAdornment={<IconButton size={"small"} disabled={true}>
                        <EmailIcon style={{color: 'rgba(255, 255, 255, 0.7)'}}/>
                      </IconButton>}
                    />
                  </FormControl>
                  <FormControl className={formControlStyle}>
                    <InputLabel className={styles.InputLabel}>{t(`loginBox.password`)}<small
                      className={styles.SmallFont}>{t(`loginBox.required`)}</small></InputLabel>
                    <Input
                      className={inputStyle}
                      type={passwordVisible ? 'text' : 'password'}
                      endAdornment={
                        <IconButton size={"small"} onClick={() => setPasswordVisible(!passwordVisible)}>
                          {
                            passwordVisible ?
                              <Visibility style={{color: 'rgba(255, 255, 255, 0.7)'}}/> :
                              <VisibilityOff style={{color: 'rgba(255, 255, 255, 0.7)'}}/>
                          }
                        </IconButton>
                      }
                    />
                  </FormControl>
                  <Box className={styles.BtnBox}>
                    <Button
                      className={btnStyle}
                      variant={"outlined"}
                      onClick={loginHandler}
                    >{t(`loginBox.login`)}</Button>
                  </Box>
                  <Box className={oauthBoxStyle}>
                    <Avatar className={styles.OauthBtn} src={githubIcon} variant={"rounded"}/>
                    <Avatar className={styles.OauthBtn} src={qqIcon} variant={"rounded"}/>
                    <Avatar className={styles.OauthBtn} src={googleIcon} variant={"rounded"}/>
                  </Box>
                </Box>
              }
            </Box>
            <Box hidden={tab !== 1}>
              {
                tab === 1 &&
                <Box className={styles.RegisterContent}>
                  <FormControl className={formControlStyle}>
                    <InputLabel className={styles.InputLabel}>{t(`loginBox.email`)}<small
                      className={styles.SmallFont}>{t(`loginBox.required`)}</small></InputLabel>
                    <Input
                      className={inputStyle}
                      endAdornment={<IconButton size={"small"} disabled={true}>
                        <EmailIcon style={{color: 'rgba(255, 255, 255, 0.7)'}}/>
                      </IconButton>}
                    />
                  </FormControl>
                  <FormControl className={formControlStyle}>
                    <InputLabel className={styles.InputLabel}>{t(`loginBox.password`)}<small
                      className={styles.SmallFont}>{t(`loginBox.moreThan6C`)}</small></InputLabel>
                    <Input
                      className={inputStyle}
                      type={registerPasswordVisible ? 'text' : 'password'}
                      endAdornment={
                        <IconButton size={"small"}
                                    onClick={() => setRegisterPasswordVisible(!registerPasswordVisible)}>
                          {
                            registerPasswordVisible ?
                              <Visibility style={{color: 'rgba(255, 255, 255, 0.7)'}}/> :
                              <VisibilityOff style={{color: 'rgba(255, 255, 255, 0.7)'}}/>
                          }
                        </IconButton>
                      }
                    />
                  </FormControl>
                  <FormControl className={formControlStyle}>
                    <InputLabel className={styles.InputLabel}>{t(`loginBox.confirmPassword`)}<small
                      className={styles.SmallFont}>{t(`loginBox.required`)}</small></InputLabel>
                    <Input
                      className={inputStyle}
                      type={checkRegisterPasswordVisible ? 'text' : 'password'}
                      endAdornment={
                        <IconButton
                          size={"small"}
                          onClick={() => setCheckRegisterPasswordVisible(!checkRegisterPasswordVisible)}>
                          {
                            checkRegisterPasswordVisible ?
                              <Visibility style={{color: 'rgba(255, 255, 255, 0.7)'}}/> :
                              <VisibilityOff style={{color: 'rgba(255, 255, 255, 0.7)'}}/>
                          }
                        </IconButton>
                      }
                    />
                  </FormControl>
                  <Box className={styles.BtnBox}>
                    <Button
                      className={btnStyle}
                      variant={"outlined"}
                      disabled={!agreement}
                    >{t(`loginBox.register`)}</Button>
                    <Box className={agreementBoxStyle}>
                      <Checkbox
                        className={styles.AgreementCheckbox}
                        checked={agreement}
                        size={"small"}
                        onClick={() => setAgreement(!agreement)}
                      /><small>{t(`loginBox.confirm`)}&nbsp;<span
                      className={styles.Agreement}>{t(`loginBox.agreement`)}</span></small>
                    </Box>
                  </Box>
                </Box>
              }
            </Box>
          </Box>
        </Paper>
      </Box>
    </Fade>
  </Modal>
}
