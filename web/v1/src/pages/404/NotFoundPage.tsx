import React, {useEffect} from "react";
import useScreenSize from "use-screen-size";
import {useLocation} from "react-router-dom";

import {MainLayout} from "../../layouts";
import {NotFound} from "../../components";
import {Medium, MiniWidth, scroll2Top, Small, usePrevious} from "../../utils/util";

export const NotFoundPage: React.FC = () => {
  const location = useLocation()
  const preLoc = usePrevious(location)
  const size = useScreenSize().width >= MiniWidth ? Medium : Small

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
  })

  return <>
    <MainLayout size={size}>
      <NotFound/>
    </MainLayout>
  </>
}