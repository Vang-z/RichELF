import React, {useEffect} from "react";
import useScreenSize from "use-screen-size";
import {useParams, useLocation} from "react-router-dom";

import {MainLayout} from "../../layouts";
import {ArticleContent, ArticleDetail} from "../../components";

import {MiniWidth, Small, Medium, scroll2Top, usePrevious} from "../../utils/util";

interface ArticleParams {
  aid: string
}


export const ArticlePage: React.FC = () => {
  const size = useScreenSize().width >= MiniWidth ? Medium : Small
  const {aid} = useParams<ArticleParams>()
  const location = useLocation()
  const preLoc = usePrevious(location)

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
  })

  useEffect(() => {
    document.title = 'RichELF | 文章'
  }, [])

  return <>
    <MainLayout size={size}>
      {
        aid ? <ArticleDetail aid={aid}/> : <ArticleContent size={size}/>
      }
    </MainLayout>
  </>
}
