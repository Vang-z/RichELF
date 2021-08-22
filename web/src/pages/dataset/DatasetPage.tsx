import React, {useEffect} from "react";
import useScreenSize from "use-screen-size";
import {useParams, useLocation} from "react-router-dom"

import {MainLayout} from "../../layouts";
import {DatasetContent, DatasetDetail} from "../../components";

import {Medium, MiniWidth, Small, scroll2Top, usePrevious} from "../../utils/util";

interface DatasetParams {
  did: string
}


export const DatasetPage: React.FC = () => {
  const size = useScreenSize().width >= MiniWidth ? Medium : Small
  const {did} = useParams<DatasetParams>()
  const location = useLocation()
  const preLoc = usePrevious(location)

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
  })

  useEffect(() => {
    document.title = 'RichELF | 数据集'
  }, [])

  return <>
    <MainLayout size={size}>
      {
        did ? <DatasetDetail did={did}/> : <DatasetContent size={size}/>
      }
    </MainLayout>
  </>
}
