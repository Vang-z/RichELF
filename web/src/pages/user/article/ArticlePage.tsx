import React, {useEffect} from "react";
import useScreenSize from "use-screen-size";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

import {MainLayout} from "../../../layouts";

import {UserArticleContent} from "../../../components";

import {MiniWidth, Small, Medium, scroll2Top, usePrevious} from "../../../utils/util";


export const ArticlePage: React.FC = () => {
  const location = useLocation()
  const preLoc = usePrevious(location)
  const {t} = useTranslation()
  const size = useScreenSize().width >= MiniWidth ? Medium : Small

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
  })

  useEffect(() => {
    document.title = `RichELF | ${t(`page.newArticle`)}`
  }, [t])

  return <>
    <MainLayout size={size}>
      <UserArticleContent/>
    </MainLayout>
  </>
}
