import React, {useEffect} from "react";
import useScreenSize from "use-screen-size";
import {useLocation} from "react-router-dom";

import {MainLayout} from "../../layouts";

import {MiniWidth, Small, Medium, scroll2Top, usePrevious} from "../../utils/util";


export const VideoPage: React.FC = () => {
  const location = useLocation()
  const preLoc = usePrevious(location)
  const size = useScreenSize().width >= MiniWidth ? Medium : Small

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
  })

  useEffect(() => {
    document.title = 'Video Page'
  }, [])

  return <>
    <MainLayout size={size}>
    </MainLayout>
  </>
}
