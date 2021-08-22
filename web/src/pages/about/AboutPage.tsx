import React, {useEffect} from "react";
import styles from "./AboutPage.module.css";
import classNames from "classnames";
import useScreenSize from "use-screen-size";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";

import {MainLayout} from "../../layouts";

import {MiniWidth, Small, Medium, scroll2Top, usePrevious} from "../../utils/util";


export const AboutPage: React.FC = () => {
  const size = useScreenSize().width >= MiniWidth ? Medium : Small
  const location = useLocation()
  const preLoc = usePrevious(location)
  const {t} = useTranslation()

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
  })

  useEffect(() => {
    document.title = 'RichELF | 关于'
  }, [])

  return <>
    <MainLayout size={size}>
      <Box className={styles.Container}>
        <Box className={styles.Wrapper}>
          <Box className={styles.MainBox}>
            <Box>
              <Box className={classNames([styles.Label])}>{t(`about.explanation`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.explanationContent`)}</Box>
              <Box className={classNames([styles.Label])}>{t(`about.goal`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.goalContent1`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.goalContent2`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.goalContent3`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.goalContent4`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.goalContent5`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.goalContent6`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.goalContent7`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.goalContent8`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.goalContent9`)}</Box>
            </Box>
            <Box>
              {size === Medium && <Divider/>}
              <Box className={classNames([styles.Label])}>{t(`about.additional`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.additionalContent`)}</Box>
              <Box className={classNames([styles.Label])}>{t(`about.contact`)}</Box>
              <Box className={classNames([styles.Content])}>{`QQ: 1346959249`}</Box>
              <Box className={classNames([styles.Content])}>{`Email: Vang-z@foxmail.com`}</Box>
              <Box className={classNames([styles.Label])}>{t(`about.conclusion`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.conclusionContent`)}</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  </>
}
