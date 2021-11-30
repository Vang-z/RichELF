import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";

import {SearchHeader, SearchContent} from "../../components";

import {scroll2Top, usePrevious} from "../../utils/util";


export const SearchPage: React.FC = () => {
  const location = useLocation()
  const preLoc = usePrevious(location)
  const {t} = useTranslation()

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
  })

  useEffect(() => {
    document.title = `RichELF | ${t(`page.search`)}`
  }, [t])

  return <Fade in={true}>
    <Box>
      <SearchHeader/>
      <SearchContent/>
    </Box>
  </Fade>
}
