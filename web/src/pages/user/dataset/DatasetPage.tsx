import React, {useEffect} from "react";
import useScreenSize from "use-screen-size";
import {useLocation, useParams} from "react-router-dom";

import {MainLayout} from "../../../layouts";

import {UserDatasetContent} from "../../../components";

import {MiniWidth, Small, Medium, scroll2Top, usePrevious} from "../../../utils/util";

interface NewDatasetParams {
  username: string,
  did: string
}


export const DatasetPage: React.FC = () => {
  const location = useLocation()
  const preLoc = usePrevious(location)
  const size = useScreenSize().width >= MiniWidth ? Medium : Small
  const {username, did} = useParams<NewDatasetParams>()

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
    console.log(username, did)
  })

  useEffect(() => {
    document.title = 'RichELF | 上传数据集'
  }, [])

  return <>
    <MainLayout size={size}>
      <UserDatasetContent/>
    </MainLayout>
  </>
}
