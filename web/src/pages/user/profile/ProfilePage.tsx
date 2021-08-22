import React, {useEffect} from "react";
import useScreenSize from "use-screen-size";
import {useLocation, useParams} from "react-router-dom";

import {MainLayout} from "../../../layouts";
import {ProfileContent} from "../../../components";

import {MiniWidth, Small, Medium, scroll2Top, usePrevious} from "../../../utils/util";

interface ProfilePageParams {
  username: string,
}


export const ProfilePage: React.FC = () => {
  const location = useLocation()
  const preLoc = usePrevious(location)
  const size = useScreenSize().width >= MiniWidth ? Medium : Small
  const {username} = useParams<ProfilePageParams>()

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
      <ProfileContent username={username} size={size}/>
    </MainLayout>
  </>
}
