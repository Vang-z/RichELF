import React, {useEffect, useState, useCallback} from "react";
import styles from "./SettingsContent.module.css"
import classNames from "classnames";
import {useSelector} from "../../../redux/hooks";
import {UserProps} from "../../../redux/auth/slice";
import {useTranslation} from "react-i18next";

import Box from "@material-ui/core/Box";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Modal from '@material-ui/core/Modal';
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';

import Cropper from 'react-easy-crop'

import {scrollToAnchor, scrollToPos, readFile, SizeProps, Medium, Small} from "../../../utils/util";
import {getCroppedImg} from '../../../utils/canvasUtils'

import avatar from "../../../assets/images/avatar.jpg"


export const SettingsContent: React.FC<SizeProps> = ({size}) => {
  const {t} = useTranslation()
  const [tab, setTab] = useState(0);
  const [accountModal, setAccountModal] = useState({
    open: false,
    title: t(`settings.authentication`),
    placeholder: t(`settings.authenticationP`),
    label: t(`settings.authenticate`)
  })
  const [info, setInfo] = useState({
    email: '0',
    star: '0',
    comment: '0',
    follow: '0',
    snackbar: '0',
  })
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({x: 0, y: 0})
  const [rotation, setRotation] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ width: number; height: number; x: number; y: number }>({
    width: 0,
    height: 0,
    x: 0,
    y: 0
  })
  const auth = useSelector(s => s.auth)
  const user = auth.user as UserProps

  const [avatarSrc, setAvatarSrc] = useState(avatar)

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
        console.log("图片格式错误！", file);
        return;
      }
      let imageDataUrl = (await readFile(file))
      setImgSrc(imageDataUrl as string)
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

  const AccountBtn = (label: string) => {
    return <Button
      onClick={() => setAccountModal({...accountModal, open: true})}
      className={classNames([styles.Button, styles.EditBtn])} variant={"outlined"}
      size={"small"}>{label}</Button>
  }

  const accountBtnHandler = (event: 'bind' | 'unbind' | 'change', type: 'email' | 'mobile' | 'password' | 'qq' | 'github' | 'google') => {
    switch (type) {
      case "email":
        return AccountBtn(t(`settings.change`))
      case "mobile":
        if (event === "bind") return AccountBtn(t(`settings.bind`))
        else return AccountBtn(t(`settings.change`))
      case "password":
        return AccountBtn(t(`settings.change`))
      case "qq":
        if (event === "bind") return AccountBtn(t(`settings.bind`))
        else return AccountBtn(t(`settings.unbind`))
      case "github":
        if (event === "bind") return AccountBtn(t(`settings.bind`))
        else return AccountBtn(t(`settings.unbind`))
      case "google":
        if (event === "bind") return AccountBtn(t(`settings.bind`))
        else return AccountBtn(t(`settings.unbind`))
    }
  }

  useEffect(() => {
    if (size === Medium) {
      document.addEventListener('scroll', scrollHandler)
      return () => document.removeEventListener('scroll', scrollHandler)
    }
  }, [scrollHandler, size])

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
            <Tab label={t(`settings.notification`)} className={styles.TabTrouble} classes={{selected: styles.TabSelected}}
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
              defaultValue={user.username}/>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.bio`)} ：</Box>
            <Input
              className={styles.InfoInput}
              placeholder={t(`settings.bioP`)}
              defaultValue={user.desc}/>
          </Box>
          <Box className={styles.InfoContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.link`)} ：</Box>
            <Input
              className={styles.InfoInput}
              placeholder={t(`settings.linkP`)}
              defaultValue={user.link}/>
          </Box>
          <Box className={styles.ButtonContainer}>
            <Button className={styles.Button} variant={"outlined"} size={"small"}>{t(`settings.save`)}</Button>
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
              placeholder={`vang-z@foxmail.com`}/>
            {accountBtnHandler('change', "email")}
          </Box>
          <Box className={styles.InfoContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.mobile`)} ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={`183 * * * * 7779`}/>
            {accountBtnHandler('change', "mobile")}
          </Box>
          <Box className={styles.InfoContainer}>
            <Box
              className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>{t(`settings.password`)} ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={`●●●●●●`}/>
            {accountBtnHandler('change', "password")}
          </Box>
          <Box className={styles.InfoContainer}>
            <Box className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>QQ ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={`🍓 【1346959249】`}/>
            {accountBtnHandler('change', "qq")}
          </Box>
          <Box className={styles.InfoContainer}>
            <Box className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>Github ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={`Vang-z 【vang-z@foxmail.com】`}/>
            {accountBtnHandler('change', "github")}
          </Box>
          <Box className={styles.InfoContainer}>
            <Box className={classNames([styles.Label, {[`${styles.MiniLabel}`]: size === Small}])}>Google ：</Box>
            <Input
              className={classNames([styles.InfoInput, styles.AccountInput, {[`${styles.MiniAccountInput}`]: size === Small}])}
              disabled={true}
              placeholder={`王梓涵 【vang-z@foxmail.com】`}/>
            {accountBtnHandler('change', "google")}
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
            <Button className={styles.Button} variant={"outlined"} size={"small"}>{t(`settings.save`)}</Button>
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
              image={imgSrc as string}
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
                  imgSrc as string,
                  croppedAreaPixels,
                  rotation
                )
                croppedImage.then(e => {
                  console.log(e)
                  return setAvatarSrc(e as string);
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
        open: false,
        title: t(`settings.authentication`),
        placeholder: t(`settings.authenticationP`),
        label: t(`settings.authenticate`)
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
              open: false,
              title: t(`settings.authentication`),
              placeholder: t(`settings.authenticationP`),
              label: t(`settings.authenticate`)
            })}
          ><CloseIcon/></IconButton>
          <Box
            className={classNames([styles.AccountModalTitle, {[`${styles.MiniAccountModalTitle}`]: size === Small}])}>{accountModal.title}</Box>
          <Input className={styles.AccountModalInput} placeholder={accountModal.placeholder}/>
          <Button className={styles.AccountModalBtn} variant={"outlined"}>{accountModal.label}</Button>
        </Box>
      </Fade>
    </Modal>
  </>
}