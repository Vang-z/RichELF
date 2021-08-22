import React from "react";
import {useSelector} from "../../redux/hooks";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import {Header, Footer, LoginBox} from "../../components";

import {SizeProps} from "../../utils/util";


export const MainLayout: React.FC<SizeProps> = ({size, children}) => {
  const loginBoxStatus = useSelector(s => s.loginBox)
  return <>
    <Header size={size}/>
    <Fade in={true} timeout={500}>
      {
        loginBoxStatus.open ?
          <LoginBox/> :
          <Box style={{minHeight: "calc(100vh - 58px)"}}>
            {children}
          </Box>
      }
    </Fade>
    <Footer size={size}/>
  </>
}