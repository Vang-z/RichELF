import React, {useEffect} from "react";
import useScreenSize from "use-screen-size";
import {useLocation, useParams} from "react-router-dom";

import {MainLayout} from "../../../layouts";
import {SettingsContent} from "../../../components";

import {MiniWidth, Small, Medium, scroll2Top, usePrevious} from "../../../utils/util";

interface SettingPageParams {
  username: string,
}


export const SettingsPage: React.FC = () => {
  const location = useLocation()
  const preLoc = usePrevious(location)
  const size = useScreenSize().width >= MiniWidth ? Medium : Small
  const {username} = useParams<SettingPageParams>()

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
  })

  useEffect(() => {
    document.title = `RichELF | ${username}`
  }, [username])

  return <>
    <MainLayout size={size}>
      <SettingsContent size={size}/>
    </MainLayout>
  </>
}
