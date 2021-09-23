import React, {useEffect} from "react";
import styles from "./AboutPage.module.css";
import classNames from "classnames";
import useScreenSize from "use-screen-size";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

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
    document.title = `RichELF | ${t(`page.about`)}`
  }, [t])

  return <>
    <MainLayout size={size}>
      <Box className={styles.Container}>
        <Box className={styles.Wrapper}>
          <Box className={styles.MainBox}>
            <Box>
              <Box className={classNames([styles.Label])}>{t(`about.about`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.explanationContent`)}</Box>
              <Box className={classNames([styles.Label])}>{t(`about.goal`)}</Box>
              <Box className={classNames([styles.Content])}>
                <span className={styles.Goal}>α. </span>{t(`about.goalContent1`)}
              </Box>
              <Box className={classNames([styles.Content])}>
                <span className={styles.Goal}>β. </span>{t(`about.goalContent2`)}
              </Box>
              <Box className={classNames([styles.Content])}>
                <span className={styles.Goal}>γ. </span>{t(`about.goalContent3`)}
              </Box>
              <Box className={classNames([styles.Content])}>
                <span className={styles.Goal}>δ. </span>{t(`about.goalContent4`)}
              </Box>
              <Box className={classNames([styles.Content])}>
                <span className={styles.Goal}>ε. </span>{t(`about.goalContent5`)}
              </Box>
              <Box className={classNames([styles.Content])}>
                <span className={styles.Goal}>ζ. </span>{t(`about.goalContent6`)}
              </Box>
              <Box className={classNames([styles.Content])}>
                <span className={styles.Goal}>η. </span>{t(`about.goalContent7`)}
              </Box>
              <Box className={classNames([styles.Content])}>
                <span className={styles.Goal}>θ. </span>{t(`about.goalContent8`)}
              </Box>
              <Box className={classNames([styles.Content])}>
                <span className={styles.Goal}>ι. </span>{t(`about.goalContent9`)}
              </Box>
            </Box>
            <Box>
              {size === Medium && <Divider/>}
              <Box className={classNames([styles.Label])}>{t(`about.additional`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.additionalContent`)}</Box>
              <Box className={classNames([styles.Content])}>{t(`about.address`)}：
                <a href="https://github.com/Vang-z/RichELF" target={"_blank"} rel="noreferrer">
                  RichELF</a>
              </Box>
              <Box className={classNames([styles.Content])}>{t(`about.licence`)}：
                <a href="https://github.com/Vang-z/RichELF/blob/main/LICENSE" target={"_blank"} rel="noreferrer">
                  GNU Affero General Public License v3.0</a>
              </Box>
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
