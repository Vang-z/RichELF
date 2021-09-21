import React, {useEffect, useState, useCallback} from "react";
import styles from "./SettingsContent.module.css"
import classNames from "classnames";
import {useSelector} from "../../../redux/hooks";
import {authSlice} from "../../../redux/auth/slice";
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import jwt_decode from "jwt-decode";
import SparkMD5 from "spark-md5";
import validator from "validator";

import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Modal from '@mui/material/Modal';
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

import Cropper from 'react-easy-crop'

import {
  scrollToAnchor,
  scrollToPos,
  readFile,
  dataURLtoFile,
  SizeProps,
  Medium,
  Small,
} from "../../../utils/util";
import {getCroppedImg} from '../../../utils/canvasUtils'
import Api from '../../../utils/api'


export const SettingsContent: React.FC<SizeProps> = ({size}) => {
  const {t} = useTranslation()
  const [tab, setTab] = useState(0);
  const [accountModal, setAccountModal] = useState({
    open: false,
    title: '',
    passwordPlaceholder: t(`settings.authenticationP`),
    placeholder: '',
    label: '',
    type: ''
  })
  const [info, setInfo] = useState({
    email: '0',
    star: '0',
    comment: '0',
    follow: '0',
    snackbar: '0',
  })
  const [imgSrc, setImgSrc] = useState<{ src: string, filename: string, fileType: string } | null>(null)
  const [crop, setCrop] = useState({x: 0, y: 0})
  const [rotation, setRotation] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ width: number; height: number; x: number; y: number }>({
    width: 0,
    height: 0,
    x: 0,
    y: 0
  })
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const dispatch = useDispatch()
  const history = useHistory()
  const auth = useSelector(s => s.auth)
  const user = auth.accessToken ? jwt_decode(auth.accessToken) as any : {}

  const [avatarSrc, setAvatarSrc] = useState(user.avatar_url)
  const [username, setUsername] = useState(user.username)
  const [bio, setBio] = useState(user.bio ? user.bio : '')
  const [link, setLink] = useState(user.link ? user.link : '')
  const [accountForm, setAccountForm] = useState<{
    pwd: string, data: string, emailCode: string, getCode: any, interval: any
  }>({
    pwd: '',
    data: '',
    emailCode: '',
    getCode: t('settings.getCode'),
    interval: null
  })

  const scrollHandler = useCallback(() => {
    const dis = 320
    const scrollTop = document.documentElement.scrollTop
    const profilePos = document.getElementById(`profile`) as HTMLElement
    const profilePosOffset = profilePos.offsetTop - scrollTop
    const accountPos = document.getElementById(`account`) as HTMLElement
    const accountPosOffset = accountPos.offsetTop - scrollTop
    const notificationPos = document.getElementById(`notification`) as HTMLElement
    const notificationPosOffset = notificationPos.offsetTop - scrollTop
    if (notificationPosOffset <= dis) {
      setTab(2)
    } else if (accountPosOffset <= dis) {
      setTab(1)
    } else if (profilePosOffset <= dis) {
      setTab(0)
    }
  }, [])

  const avatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (typeof file === 'undefined') return;
      if (file.type.split('/')[0] !== 'image') {
        enqueueSnackbar(t(`enqueueSnackbar.imgFormatError`), {
          variant: "warning",
          action: key => <IconButton disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
        })
        return;
      }
      let imageDataUrl = await readFile(file) as string
      setImgSrc({
        src: imageDataUrl,
        filename: file.name,
        fileType: file.type
      })
    }
  }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const closeModalHandler = () => {
    (document.getElementById('avatarUpload') as HTMLInputElement).value = ''
    setImgSrc(null)
    setZoom(1)
    setRotation(0)
  }

  useEffect(() => {
    if (size === Medium) {
      document.addEventListener('scroll', scrollHandler)
      return () => document.removeEventListener('scroll', scrollHandler)
    }
  }, [scrollHandler, size])

  const saveProfileInfoHandler = async () => {
    let formData = new FormData();
    formData.append("username", username);
    formData.append("avatar", avatarSrc);
    formData.append("bio", bio);
    formData.append("link", link);
    const res = await Api.http.put(`/user`, formData, {
      headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
    })
    if (res.status === 200) {
      dispatch(authSlice.actions.setToken({
        accessToken: res.data.access_token,
        tokenType: res.data.token_type
      }))
      enqueueSnackbar(t(`enqueueSnackbar.saveSuccess`), {
        variant: "success",
        action: key => <IconButton disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
      })
      history.replace(`/user/${username}/settings`)
    } else {
      enqueueSnackbar(t(`enqueueSnackbar.saveFailed`), {
        variant: "warning",
        action: key => <IconButton disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
      })
    }
  }

  return <>
    <Box className={styles.Container}>
      {size === Medium && <Box className={styles.SidebarBox}>
        <Box className={styles.SidebarContainer}>
          <Box className={styles.SidebarTitle}>
            {t(`settings.accountSettings`)}
          </Box>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tab}
            className={styles.Tabs}
            classes={{
              indicator: styles.IndicatorColor
            }}
          >
            <Tab label={t(`settings.profile`)} classes={{selected: styles.TabSelected}} onClick={scrollToPos(0)}
                 disableRipple={true}/>
            <Tab label={t(`settings.account`)} classes={{selected: styles.TabSelected}} onClick={scrollToPos(408)}
                 disableRipple={true}/>
            <Tab label={t(`settings.notification`)} className={styles.TabTrouble}
                 classes={{selected: styles.TabSelected}}
                 onClick={scrollToAnchor(`notification`)} disableRipple={true}/>
            <Tab disabled={true} className={styles.TabDisabled}/>
          </Tabs>
        </Box>
      </Box>}
      <Box className={styles.MainContent}>
        <Box className={classNames([styles.MainContainer, {[`${styles.MiniMainContainer}`]: size === Small}])}
             id={`profile`}>
          <Box className={styles.MainTitle}>{t(`settings.profile`)}</Box>
          <Box className={styles.PictureContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.avatar`)} ：</Box>
            <Box className={styles.Picture}>
              {size === Medium && <Box
                className={styles.AvatarShade}
                onClick={() => {
                  (document.getElementById(`avatarUpload`) as HTMLInputElement).click()
                }}>
                <CloudUploadIcon/>
              </Box>}
              <img
                src={avatarSrc}
                className={styles.PictureSrc}
                alt="..."
              />
              <input
                className={styles.PictureInput}
                id={`avatarUpload`}
                type="file"
                accept={`image/*`}
                onChange={avatarChange}
              />
            </Box>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.username`)} ：</Box>
            <Input
              className={styles.InfoInput}
              placeholder={t(`settings.usernameP`)}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              defaultValue={username}/>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.bio`)} ：</Box>
            <Input
              className={styles.InfoInput}
              placeholder={t(`settings.bioP`)}
              onChange={(e) => {
                setBio(e.target.value)
              }}
              defaultValue={bio}/>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.link`)} ：</Box>
            <Input
              className={styles.InfoInput}
              placeholder={t(`settings.linkP`)}
              onChange={(e) => {
                setLink(e.target.value)
              }}
              defaultValue={link}/>
          </Box>
          <Box className={styles.ButtonContainer}>
            {
              user.create_at ?
                <Button className={styles.Button} variant={"outlined"} size={"small"} color={"secondary"}
                        onClick={saveProfileInfoHandler}>{t(`settings.save`)}</Button> :
                <Tooltip placement="top-end" title={`${t(`settings.waitingForActive`)}`} arrow={true}>
                  <span>
                  <Button disabled={true} className={styles.Button} variant={"outlined"}
                          size={"small"}>{t(`settings.save`)}</Button>
                  </span>
                </Tooltip>
            }
          </Box>
        </Box>

        <Box className={classNames([styles.MainContainer, {[`${styles.MiniMainContainer}`]: size === Small}])}
             id={`account`}>
          <Box className={styles.MainTitle}>{t(`settings.account`)}</Box>
          <Box className={styles.InfoContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.email`)} ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={user.email}/>
            {
              user.create_at ?
                <Button
                  onClick={() => {
                    setAccountModal({
                      ...accountModal,
                      open: true,
                      title: `${t(`settings.change`)}${t(`settings.email`)}`,
                      placeholder: t(`settings.newEmail`),
                      label: t(`settings.change`),
                      type: 'email'
                    })
                  }}
                  className={classNames([styles.Button, styles.EditBtn])} variant={"outlined"}
                  size={"small"}>
                  {t(`settings.change`)}
                </Button> :
                <Tooltip placement="top-start" title={`${t(`settings.waitingForActive`)}`} arrow={true}>
                  <span>
                    <Button
                      disabled
                      className={classNames([styles.Button, styles.EditBtn])} variant={"outlined"}
                      size={"small"}>
                      {t(`settings.change`)}
                    </Button>
                  </span>
                </Tooltip>
            }
          </Box>
          <Box className={styles.InfoContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.mobile`)} ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={user.mobile_hash}/>
            {
              user.create_at ?
                <Button
                  onClick={() => {
                    setAccountModal({
                      ...accountModal,
                      open: true,
                      title: `${user.mobile_hash ? t(`settings.change`) : t(`settings.bind`)}${t(`settings.mobile`)}`,
                      placeholder: t(`settings.mobileNum`),
                      label: `${user.mobile_hash ? t(`settings.change`) : t(`settings.bind`)}`,
                      type: 'mobile'
                    })
                  }}
                  className={classNames([styles.Button, styles.EditBtn])} variant={"outlined"}
                  size={"small"}>
                  {`${user.mobile_hash ? t(`settings.change`) : t(`settings.bind`)}`}
                </Button> :
                <Tooltip placement="top-start" title={`${t(`settings.waitingForActive`)}`} arrow={true}>
                  <span>
                    <Button
                      disabled
                      className={classNames([styles.Button, styles.EditBtn])} variant={"outlined"}
                      size={"small"}>
                      {t(`settings.bind`)}
                    </Button>
                  </span>
                </Tooltip>
            }
          </Box>
          <Box className={styles.InfoContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.password`)} ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={`●●●●●●`}/>
            {
              user.create_at ?
                <Button
                  onClick={() => {
                    setAccountModal({
                      ...accountModal,
                      open: true,
                      title: `${t(`settings.change`)}${t(`settings.password`)}`,
                      placeholder: t(`settings.newPassword`),
                      label: t(`settings.change`),
                      type: 'password'
                    })
                  }}
                  className={classNames([styles.Button, styles.EditBtn])} variant={"outlined"}
                  size={"small"}>
                  {t(`settings.change`)}
                </Button> :
                <Tooltip placement="top-start" title={`${t(`settings.waitingForActive`)}`} arrow={true}>
                  <span>
                    <Button
                      disabled
                      className={classNames([styles.Button, styles.EditBtn])} variant={"outlined"}
                      size={"small"}>
                      {t(`settings.change`)}
                    </Button>
                  </span>
                </Tooltip>
            }
          </Box>
          <Box className={styles.InfoContainer}>
            <Box className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>QQ ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={``}/>
            <Button
              disabled
              className={classNames([styles.Button, styles.EditBtn])} variant={"outlined"}
              size={"small"}>
              {t(`settings.bind`)}
            </Button>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>Github ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={``}/>
            <Button
              disabled
              className={classNames([styles.Button, styles.EditBtn])} variant={"outlined"}
              size={"small"}>
              {t(`settings.bind`)}
            </Button>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>Google ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={``}/>
            <Button
              disabled
              className={classNames([styles.Button, styles.EditBtn])} variant={"outlined"}
              size={"small"}>
              {t(`settings.bind`)}
            </Button>
          </Box>
        </Box>

        <Box className={classNames([styles.MainContainer, {[`${styles.MiniMainContainer}`]: size === Small}])}
             id={`notification`}>
          <Box className={styles.MainTitle}>{t(`settings.notification`)}</Box>
          <Box className={styles.InfoContainer}>
            <Box className={styles.Label}>{t(`settings.emailNotification`)} ：</Box>
            <RadioGroup
              aria-label="email" name="email" value={info.email} row={true}
              onChange={(e, value) => setInfo({...info, email: value})}>
              <FormControlLabel value="0" control={<Radio color={"default"} size={"small"}/>}
                                label={t(`settings.accept`)}/>
              <FormControlLabel value="1" control={<Radio color={"default"} size={"small"}/>}
                                label={t(`settings.reject`)}/>
            </RadioGroup>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box className={styles.Label}>{t(`settings.starNotification`)} ：</Box>
            <RadioGroup
              aria-label="star" name="star" value={info.star} row={true}
              onChange={(e, value) => setInfo({...info, star: value})}>
              <FormControlLabel value="0" control={<Radio color={"default"} size={"small"}/>}
                                label={t(`settings.accept`)}/>
              <FormControlLabel value="1" control={<Radio color={"default"} size={"small"}/>}
                                label={t(`settings.reject`)}/>
            </RadioGroup>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box className={styles.Label}>{t(`settings.commentNotification`)} ：</Box>
            <RadioGroup
              aria-label="comment" name="comment" value={info.comment} row={true}
              onChange={(e, value) => setInfo({...info, comment: value})}>
              <FormControlLabel value="0" control={<Radio color={"default"} size={"small"}/>}
                                label={t(`settings.accept`)}/>
              <FormControlLabel value="1" control={<Radio color={"default"} size={"small"}/>}
                                label={t(`settings.reject`)}/>
            </RadioGroup>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box className={styles.Label}>{t(`settings.followNotification`)} ：</Box>
            <RadioGroup
              aria-label="follow" name="follow" value={info.follow} row={true}
              onChange={(e, value) => setInfo({...info, follow: value})}>
              <FormControlLabel value="0" control={<Radio color={"default"} size={"small"}/>}
                                label={t(`settings.accept`)}/>
              <FormControlLabel value="1" control={<Radio color={"default"} size={"small"}/>}
                                label={t(`settings.reject`)}/>
            </RadioGroup>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box className={styles.Label}>{t(`settings.noticeBar`)} ：</Box>
            <RadioGroup
              aria-label="follow" name="follow" value={info.snackbar} row={true}
              onChange={(e, value) => setInfo({...info, snackbar: value})}>
              <FormControlLabel value="0" control={<Radio color={"default"} size={"small"}/>}
                                label={t(`settings.open`)}/>
              <FormControlLabel value="1" control={<Radio color={"default"} size={"small"}/>}
                                label={t(`settings.close`)}/>
            </RadioGroup>
          </Box>
          <Box className={styles.ButtonContainer}>
            {
              user.create_at ?
                <Button disabled={true} className={styles.Button} variant={"outlined"}
                        size={"small"}>{t(`settings.save`)}</Button> :
                <Tooltip placement="top-end" title={`${t(`settings.waitingForActive`)}`} arrow={true}>
                  <span>
                  <Button disabled={true} className={styles.Button} variant={"outlined"}
                          size={"small"}>{t(`settings.save`)}</Button>
                  </span>
                </Tooltip>
            }
          </Box>
        </Box>

        {size === Medium && <Box className={styles.FillContent}/>}
      </Box>
    </Box>
    <Modal
      open={!!imgSrc}
      onClose={closeModalHandler}
      BackdropComponent={Backdrop}
      closeAfterTransition={true}
      BackdropProps={{timeout: 500}}
    >
      <Fade in={!!imgSrc}>
        <Box className={classNames([styles.CropperBox, {[`${styles.MiniCropperBox}`]: size === Small}])}>
          <IconButton
            className={styles.CloseBtn}
            size={"small"}
            disableRipple={true}
            onClick={closeModalHandler}
          ><CloseIcon/></IconButton>
          <Box className={classNames([styles.CropperContainer, {[`${styles.MiniCropperContainer}`]: size === Small}])}>
            <Cropper
              image={imgSrc ? imgSrc.src : undefined}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onRotationChange={(rotation) => {
                setRotation(parseInt(String(rotation)))
              }}
              onZoomChange={(zoom) => {
                setZoom(parseFloat(zoom.toFixed(3)))
              }}
              onCropComplete={onCropComplete}
            />
          </Box>
          <Box className={styles.Controls}>
            <Box className={styles.SliderContainer}>
              <span className={styles.SliderLabel}>{t(`settings.zoom`)} ：</span>
              <Slider
                className={classNames([styles.Slider, {[`${styles.MiniSlider}`]: size === Small}])}
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => {
                  setZoom(zoom as number)
                }}
              />
              <span className={styles.SliderInfo}>{zoom}ｘ</span>
            </Box>
            <Box className={styles.SliderContainer}>
              <span className={styles.SliderLabel}>{t(`settings.rotation`)} ：</span>
              <Slider
                className={classNames([styles.Slider, {[`${styles.MiniSlider}`]: size === Small}])}
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e, rotation) => {
                  setRotation(rotation as number)
                }}
              />
              <span className={styles.SliderInfo}>{rotation} °</span>
            </Box>
            <Box className={styles.ButtonContainer}>
              <Button size={"small"} variant={"outlined"} onClick={() => {
                const croppedImage = getCroppedImg(
                  imgSrc ? imgSrc.src : '',
                  imgSrc ? imgSrc.fileType : '',
                  croppedAreaPixels,
                  rotation
                )
                croppedImage.then(async (e: string) => {
                  const file = dataURLtoFile(e, imgSrc ? imgSrc.filename : '')
                  let spark = new SparkMD5.ArrayBuffer()
                  const identifier = spark.append(await file.arrayBuffer()).end()
                  let formData = new FormData();
                  formData.append("file", file);
                  formData.append("filesize", file.size.toString());
                  formData.append("category", 'users');
                  formData.append("identifier", identifier);
                  let res = await Api.http.post(`/file/upload`, formData, {
                    headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
                  })
                  if (res.status === 201 || res.status === 200) {
                    return setAvatarSrc(res.data.data)
                  }
                  return setAvatarSrc(e);
                })
                closeModalHandler()
              }}>{t(`settings.upload`)}</Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
    <Modal
      open={accountModal.open}
      onClose={() => setAccountModal({
        ...accountModal,
        open: false,
      })}
      BackdropComponent={Backdrop}
      closeAfterTransition={true}
      BackdropProps={{timeout: 500}}
    >
      <Fade in={accountModal.open}>
        <Box
          className={classNames([styles.AccountModalContainer, {[`${styles.MiniAccountModalContainer}`]: size === Small}])}>
          <IconButton
            className={styles.CloseBtn}
            size={"small"}
            disableRipple={true}
            onClick={() => setAccountModal({
              ...accountModal,
              open: false,
            })}
          ><CloseIcon/></IconButton>
          <Box
            className={classNames([styles.AccountModalTitle, {[`${styles.MiniAccountModalTitle}`]: size === Small}])}>{accountModal.title}</Box>
          <Input
            className={styles.AccountModalInput} placeholder={accountModal.passwordPlaceholder} type={'password'}
            onChange={(e) => {
              setAccountForm({
                ...accountForm,
                pwd: e.target.value
              })
            }}/>
          <Input
            className={styles.AccountModalInput} placeholder={accountModal.placeholder}
            type={accountModal.type === 'password' ? 'password' : 'text'}
            onChange={(e) => {
              setAccountForm({
                ...accountForm,
                data: e.target.value
              })
            }}/>
          {
            accountModal.type === 'email' &&
            <Box className={styles.AccountModalEmailCodeBox}>
              <Input
                className={styles.AccountModalEmailCodeInput} placeholder={`${t(`settings.captcha`)}`} fullWidth={true}
                onChange={(e) => {
                  setAccountForm({
                    ...accountForm,
                    emailCode: e.target.value
                  })
                }}/>
              <Button
                className={styles.AccountModalEmailCodeBtn} variant={"outlined"} size={"small"}
                disabled={typeof accountForm.getCode === "number"}
                onClick={async () => {
                  if (!validator.isEmail(accountForm.data)) {
                    enqueueSnackbar(t(`enqueueSnackbar.emailValidateFailed`), {
                      variant: "warning",
                      action: key => <IconButton
                        disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                    })
                    return
                  }
                  let time = 60;
                  setAccountForm({
                    ...accountForm,
                    getCode: time--
                  });
                  accountForm.interval = setInterval(function () {
                    setAccountForm({
                      ...accountForm,
                      getCode: time--
                    });
                    if (time < 0) {
                      clearInterval(accountForm.interval);
                      setAccountForm({
                        ...accountForm,
                        getCode: t(`settings.getCode`)
                      });
                    }
                  }, 1000)
                  let formData = new FormData();
                  formData.append("password", btoa(accountForm.pwd));
                  formData.append("email", accountForm.data);
                  formData.append("code", '');
                  const res = await Api.http.put(`/user/email`, formData, {
                    headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
                  })
                  if (res.status !== 200) {
                    enqueueSnackbar(t(`enqueueSnackbar.emailSendFailed`), {
                      variant: "warning",
                      action: key => <IconButton
                        disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                    })
                    return
                  }
                  enqueueSnackbar(t(`enqueueSnackbar.emailSendSuccess`), {
                    variant: "success",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                }}
              >
                {accountForm.getCode}
              </Button>
            </Box>
          }
          <Button
            className={styles.AccountModalBtn} variant={"outlined"}
            onClick={async () => {
              let res, formData
              switch (accountModal.type) {
                case "email":
                  if (!accountForm.emailCode) {
                    enqueueSnackbar(t(`enqueueSnackbar.captchaValidateFailed`), {
                      variant: "warning",
                      action: key => <IconButton
                        disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                    })
                    return
                  }
                  formData = new FormData();
                  formData.append("password", btoa(accountForm.pwd));
                  formData.append("email", accountForm.data);
                  formData.append("code", btoa(accountForm.emailCode));
                  res = await Api.http.put(`/user/email`, formData, {
                    headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
                  })
                  if (res.status !== 200) {
                    enqueueSnackbar(t(`enqueueSnackbar.emailSendFailed`), {
                      variant: "warning",
                      action: key => <IconButton
                        disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                    })
                    return
                  }
                  enqueueSnackbar(t(`enqueueSnackbar.emailChangeSuccess`), {
                    variant: "success",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                  dispatch(authSlice.actions.setToken({
                    accessToken: res.data.access_token,
                    tokenType: res.data.token_type
                  }))
                  setAccountModal({
                    open: false,
                    title: '',
                    passwordPlaceholder: t(`settings.authenticationP`),
                    placeholder: '',
                    label: '',
                    type: ''
                  })
                  setAccountForm({
                    pwd: '',
                    data: '',
                    emailCode: '',
                    getCode: t(`settings.getCode`),
                    interval: null
                  })
                  return
                case "password":
                  if (accountForm.data.length < 6) {
                    enqueueSnackbar(t(`enqueueSnackbar.pwdValidateFailed`), {
                      variant: "warning",
                      action: key => <IconButton
                        disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                    })
                    return
                  }
                  formData = new FormData();
                  formData.append("password", btoa(accountForm.pwd));
                  formData.append("new_password", btoa(accountForm.data));
                  res = await Api.http.put(`/user/password`, formData, {
                    headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
                  })
                  if (res.status !== 200) {
                    enqueueSnackbar(t(`enqueueSnackbar.pwdChangeFailed`), {
                      variant: "warning",
                      action: key => <IconButton
                        disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                    })
                    return
                  }
                  enqueueSnackbar(t(`enqueueSnackbar.pwdChangeSuccess`), {
                    variant: "success",
                    action: key => <IconButton
                      disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                  })
                  dispatch(authSlice.actions.setToken({
                    accessToken: res.data.access_token,
                    tokenType: res.data.token_type
                  }))
                  setAccountModal({
                    open: false,
                    title: '',
                    passwordPlaceholder: t(`settings.authenticationP`),
                    placeholder: '',
                    label: '',
                    type: ''
                  })
                  setAccountForm({
                    pwd: '',
                    data: '',
                    emailCode: '',
                    getCode: t(`settings.getCode`),
                    interval: null
                  })
                  return
              }
            }}
          >
            {accountModal.label}
          </Button>
        </Box>
      </Fade>
    </Modal>
  </>
}