import React from "react";
import styles from "./Globe.module.css"
import useScreenSize from "use-screen-size";

import Box from "@material-ui/core/Box";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import {SizeProps, scrollToAnchor} from "../../../utils/util";

const GlobeVideoFile = require('../../../assets/videos/3dGlobe.mp4')
const GlobeImgFile = require('../../../assets/images/3dGlobe.png')


export const Globe: React.FC<SizeProps> = ({size}) => {
  const screenSize = useScreenSize()

  return <>
    <Box className={styles.GlobeContainer}>
      <Box className={styles.GlobeShade}/>
      {
        size === 'medium' ?
          <>
            <video
              className={styles.Globe}
              preload={"preload"}
              muted={true}
              loop={true}
              playsInline={true}
              autoPlay={true}
              controls={false}
              webkit-playsinline={"true"}
              x5-playsinline={"true"}
              poster={GlobeImgFile.default}
              src={GlobeVideoFile.default}/>
            <ArrowDropDownIcon className={styles.DropDown} onClick={scrollToAnchor("activity")}/>
          </> :
          <>
            <Box className={styles.MiniGlobeContainer}>
              <img
                className={styles.MiniGlobe}
                style={screenSize.height > screenSize.width ? {width: '100%'} : {height: '100%'}}
                src={GlobeImgFile.default} alt={`...`}/>
              <ArrowDropDownIcon className={styles.DropDown} onClick={scrollToAnchor("activity")}/>
            </Box>
          </>
      }
    </Box>
  </>
}
