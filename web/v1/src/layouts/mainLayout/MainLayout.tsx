import React from "react";
import {useSelector} from "../../redux/hooks";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import {Header, Footer, LoginBox} from "../../components";

import {SizeProps} from "../../utils/util";


export const MainLayout: React.FC<SizeProps> = ({size, children}) => {
  const loginBoxStatus = useSelector(s => s.loginBox)
  return <>
    <Header size={size}/>
    <Fade in={true} timeout={500}>
      {
        loginBoxStatus.open ?
          <Box><LoginBox/></Box> :
          <Box style={{minHeight: "calc(100vh - 58px)"}}>
            {children}
          </Box>
      }
    </Fade>
    <Footer size={size}/>
  </>
}