import React, {useEffect} from "react";
import useScreenSize from "use-screen-size";
import {useLocation, useParams} from "react-router-dom";

import {MainLayout} from "../../../layouts";

import {UserArticleContent} from "../../../components";

import {MiniWidth, Small, Medium, scroll2Top, usePrevious} from "../../../utils/util";

interface NewArticleParams {
  username: string,
  aid: string
}


export const ArticlePage: React.FC = () => {
  const location = useLocation()
  const preLoc = usePrevious(location)
  const size = useScreenSize().width >= MiniWidth ? Medium : Small
  const {username, aid} = useParams<NewArticleParams>()

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
    console.log(username, aid)
  })

  useEffect(() => {
    document.title = 'RichELF | 写文章'
  }, [])

  return <>
    <MainLayout size={size}>
      <UserArticleContent/>
    </MainLayout>
  </>
}
