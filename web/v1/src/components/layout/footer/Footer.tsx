import React from "react";
import styles from "./Footer.module.css"

import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import {SizeProps} from "../../../utils/util";


export const Footer: React.FC<SizeProps> = ({size}) => {
  const fastApiIco = require("../../../assets/images/fastapi.svg")
  const materialIco = require("../../../assets/images/material-ui.svg")
  const govlIco = require("../../../assets/images/gov.png")

  return <>
    {
      size === 'medium' ?
        <Grid id={`footer`} className={styles.Footer} container={true}>
          <Grid container={true}>
            <Grid item={true} sm={4}/>
            <Grid item={true} sm={4} style={{textAlign: "center"}}>
              <span className={styles.FooterSpan}>COPYRIGHT &#169; 2021 Vang-z. ALL RIGHTS RESERVED. </span>
              <span className={styles.FooterSpan}> POWERED BY&nbsp;&nbsp;</span>
              <span className={styles.FooterSpan}>
                <Link className={styles.FooterLink} href="https://fastapi.tiangolo.com/" target={"_blank"}
                      rel="noopener">
                  <Avatar className={styles.Icon} variant="rounded" src={fastApiIco.default}/>
                </Link>
              </span>
              <span className={styles.FooterSpan}>
            <Link className={styles.FooterLink} href="https://material-ui.com/" target={"_blank"} rel="noopener">
              <Avatar className={styles.Icon} variant="rounded" src={materialIco.default}/>
            </Link>
          </span>
            </Grid>
            <Grid item={true} sm={4}/>
          </Grid>
          <Grid container={true}>
            <Grid item={true} sm={4}/>
            <Grid item={true} sm={4}style={{textAlign: "center"}}>
              <Link className={styles.FooterLink} href="https://beian.miit.gov.cn/" target={"_blank"}
                    rel="noopener">
                蜀ICP备20011394号-2
              </Link>
              <Link className={styles.FooterLink}
                    href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51112302000147"
                    target={"_blank"}
                    rel="noopener">
                <Avatar className={styles.GovIcon} variant="rounded" src={govlIco.default}/>
                川公网安备51112302000147号
              </Link>
            </Grid>
            <Grid item={true} sm={4}/>
          </Grid>
        </Grid> :
        <Box id={`footer`} className={styles.MiniFooter}>
          <Box>
            <span className={styles.FooterSpan}>COPYRIGHT &#169; 2021 Vang-z. ALL RIGHTS RESERVED. </span>
          </Box>
          <Box>
            <span className={styles.FooterSpan}> POWERED BY&nbsp;&nbsp;</span>
            <span className={styles.FooterSpan}>
              <Link className={styles.FooterLink} href="https://fastapi.tiangolo.com/" target={"_blank"} rel="noopener">
                <Avatar className={styles.Icon} variant="rounded" src={fastApiIco.default}/>
              </Link>
            </span>
            <span className={styles.FooterSpan}>
          <Link className={styles.FooterLink} href="https://material-ui.com/" target={"_blank"} rel="noopener">
            <Avatar className={styles.Icon} variant="rounded" src={materialIco.default}/>
          </Link>
        </span>
          </Box>
        </Box>
    }
  </>
}
