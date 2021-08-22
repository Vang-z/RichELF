import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";

import Fade from "@material-ui/core/Fade";
import Box from "@material-ui/core/Box";

import {SearchHeader, SearchContent} from "../../components";

import {scroll2Top, usePrevious} from "../../utils/util";


export const SearchPage: React.FC = () => {
  const location = useLocation()
  const preLoc = usePrevious(location)

  useEffect(() => {
    if (preLoc !== location) {
      scroll2Top()
    }
  })

  useEffect(() => {
    document.title = 'Search Page'
  }, [])

  return <Fade in={true}>
    <Box>
      <SearchHeader/>
      <SearchContent/>
    </Box>
  </Fade>
}
