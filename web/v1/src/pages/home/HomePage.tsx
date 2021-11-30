import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useSelector} from "../../redux/hooks";
import {useTranslation} from "react-i18next";

import useScreenSize from "use-screen-size";
import {Globe, Moments, JoinUs} from "../../components";
import {MainLayout} from "../../layouts";

import {MiniWidth, Small, Medium, scroll2Top, usePrevious} from "../../utils/util";


export const HomePage: React.FC = () => {
  const size = useScreenSize().width >= MiniWidth ? Medium : Small
  const location = useLocation()
  const {t} = useTranslation()
  const preLoc = usePrevious(location)
  const auth = useSelector(s => s.auth)

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
  }, [location, preLoc])

  useEffect(() => {
    document.title = `RichELF | ${t(`page.home`)}`
  }, [t])

  return <>
    <MainLayout size={size}>
      <Globe size={size}/>
      <Moments size={size}/>
      {!auth.accessToken && <JoinUs/>}
    </MainLayout>
  </>
}
