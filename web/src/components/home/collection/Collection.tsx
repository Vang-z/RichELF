import React from "react";
import styles from "./Collection.module.css"
import {useTranslation} from "react-i18next";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";

import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineDot from '@material-ui/lab/TimelineDot';

import CameraIcon from '@material-ui/icons/Camera';

import {MLSvg, DLSvg, OcrSvg, NlpSvg, PythonSvg, GolangSvg, JsSvg, TsSvg} from "./index";
import {SizeProps} from "../../../utils/util";


export const Collection: React.FC<SizeProps> = ({size}) => {
  const {t} = useTranslation()

  return <Box id={`collectionContainer`} className={styles.CollectionContainer}>
    <Box>
      <h5 className={styles.Motto}>
        <CameraIcon/>&nbsp;{t('collection.motto')}
      </h5>
    </Box>
    {
      size === 'medium' ?
        <>
          <Grid container={true}>
            <Grid item={true} xs={1}/>
            <Grid item={true} xs={1}>
              <Timeline>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot/>
                  </TimelineSeparator>
                </TimelineItem>
              </Timeline>
            </Grid>
            <Grid item={true} xs={9}>
              <Box>
                <Grid container={true}>
                  <Grid item={true} xs={3}>
                    <Card className={styles.Collection} variant={"outlined"}>
                      <CardHeader
                        avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={MLSvg.default}/>}
                        title={`${t('collection.machineLearning')}`}
                      />
                      <CardContent>
                        <p>{t('collection.MLDesc')}</p>
                      </CardContent>
                      <Box p={1}>
                        <AvatarGroup
                          max={4}
                          classes={{
                            root: styles.CollectionUserBar,
                            avatar: styles.CollectionUser
                          }}
                        >
                          <Avatar aria-label="recipe" src={``}/>
                        </AvatarGroup>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item={true} xs={3}>
                    <Card className={styles.Collection} variant={"outlined"}>
                      <CardHeader
                        avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={DLSvg.default}/>}
                        title={`${t('collection.deepLearning')}`}
                      />
                      <CardContent>
                        <p>{t('collection.DLDesc')}</p>
                      </CardContent>
                      <Box p={1}>
                        <AvatarGroup
                          max={4}
                          classes={{
                            root: styles.CollectionUserBar,
                            avatar: styles.CollectionUser
                          }}
                        >
                          <Avatar aria-label="recipe" src={``}/>
                        </AvatarGroup>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item={true} xs={3}>
                    <Card className={styles.Collection} variant={"outlined"}>
                      <CardHeader
                        avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={OcrSvg.default}/>}
                        title={`${t('collection.OCR')}`}
                      />
                      <CardContent>
                        <p>{t('collection.OCRDesc')}</p>
                      </CardContent>
                      <Box p={1}>
                        <AvatarGroup
                          max={4}
                          classes={{
                            root: styles.CollectionUserBar,
                            avatar: styles.CollectionUser
                          }}
                        >
                          <Avatar aria-label="recipe" src={``}/>
                        </AvatarGroup>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item={true} xs={3}>
                    <Card className={styles.Collection} variant={"outlined"}>
                      <CardHeader
                        avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={NlpSvg.default}/>}
                        title={`${t('collection.NLP')}`}
                      />
                      <CardContent>
                        <p>{t('collection.NLPDesc')}</p>
                      </CardContent>
                      <Box p={1}>
                        <AvatarGroup
                          max={4}
                          classes={{
                            root: styles.CollectionUserBar,
                            avatar: styles.CollectionUser
                          }}
                        >
                          <Avatar aria-label="recipe" src={``}/>
                        </AvatarGroup>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item={true} xs={1}/>
          </Grid>
          <Grid container={true}>
            <Grid item={true} xs={1}/>
            <Grid item={true} xs={1}>
              <Timeline>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot/>
                  </TimelineSeparator>
                </TimelineItem>
              </Timeline>
            </Grid>
            <Grid item={true} xs={9}>
              <Box>
                <Grid container={true}>
                  <Grid item={true} xs={3}>
                    <Card className={styles.Collection} variant={"outlined"}>
                      <CardHeader
                        avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={PythonSvg.default}/>}
                        title={`${t('collection.python')}`}
                      />
                      <CardContent>
                        <p>{t('collection.pythonDesc')}</p>
                      </CardContent>
                      <CardContent>
                        <AvatarGroup
                          max={4}
                          classes={{
                            root: styles.CollectionUserBar,
                            avatar: styles.CollectionUser
                          }}
                        >
                          <Avatar aria-label="recipe" src={``}/>
                        </AvatarGroup>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item={true} xs={3}>
                    <Card className={styles.Collection} variant={"outlined"}>
                      <CardHeader
                        avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={GolangSvg.default}/>}
                        title={`${t('collection.golang')}`}
                      />
                      <CardContent>
                        <p>{t('collection.golangDesc')}</p>
                      </CardContent>
                      <CardContent>
                        <AvatarGroup
                          max={4}
                          classes={{
                            root: styles.CollectionUserBar,
                            avatar: styles.CollectionUser
                          }}
                        >
                          <Avatar aria-label="recipe" src={``}/>
                        </AvatarGroup>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item={true} xs={3}>
                    <Card className={styles.Collection} variant={"outlined"}>
                      <CardHeader
                        avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={JsSvg.default}/>}
                        title={`${t('collection.js')}`}
                      />
                      <CardContent>
                        <p>{t('collection.jsDesc')}</p>
                      </CardContent>
                      <CardContent>
                        <AvatarGroup
                          max={4}
                          classes={{
                            root: styles.CollectionUserBar,
                            avatar: styles.CollectionUser
                          }}
                        >
                          <Avatar aria-label="recipe" src={``}/>
                        </AvatarGroup>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item={true} xs={3}>
                    <Card className={styles.Collection} variant={"outlined"}>
                      <CardHeader
                        avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={TsSvg.default}/>}
                        title={`${t('collection.ts')}`}
                      />
                      <CardContent>
                        <p>{t('collection.tsDesc')}</p>
                      </CardContent>
                      <CardContent>
                        <AvatarGroup
                          max={4}
                          classes={{
                            root: styles.CollectionUserBar,
                            avatar: styles.CollectionUser
                          }}
                        >
                          <Avatar aria-label="recipe" src={``}/>
                        </AvatarGroup>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item={true} xs={1}/>
          </Grid>
        </> :
        <>
          <Grid container={true}>
            <Grid item={true} xs={6}>
              <Card className={styles.Collection} variant={"outlined"}>
                <CardHeader
                  avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={MLSvg.default}/>}
                  title={`${t('collection.machineLearning')}`}
                />
                <CardContent>
                  <p>{t('collection.MLDesc')}</p>
                </CardContent>
                <Box p={1}>
                  <AvatarGroup
                    max={4}
                    classes={{
                      root: styles.CollectionUserBar,
                      avatar: styles.CollectionUserMini
                    }}
                  >
                    <Avatar aria-label="recipe" src={``}/>
                  </AvatarGroup>
                </Box>
              </Card>
            </Grid>
            <Grid item={true} xs={6}>
              <Card className={styles.Collection} variant={"outlined"}>
                <CardHeader
                  avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={DLSvg.default}/>}
                  title={`${t('collection.deepLearning')}`}
                />
                <CardContent>
                  <p>{t('collection.DLDesc')}</p>
                </CardContent>
                <Box p={1}>
                  <AvatarGroup
                    max={4}
                    classes={{
                      root: styles.CollectionUserBar,
                      avatar: styles.CollectionUserMini
                    }}
                  >
                    <Avatar aria-label="recipe" src={``}/>
                  </AvatarGroup>
                </Box>
              </Card>
            </Grid>
            <Grid item={true} xs={6}>
              <Card className={styles.Collection} variant={"outlined"}>
                <CardHeader
                  avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={OcrSvg.default}/>}
                  title={`${t('collection.OCR')}`}
                />
                <CardContent>
                  <p>{t('collection.OCRDesc')}</p>
                </CardContent>
                <Box p={1}>
                  <AvatarGroup
                    max={4}
                    classes={{
                      root: styles.CollectionUserBar,
                      avatar: styles.CollectionUserMini
                    }}
                  >
                    <Avatar aria-label="recipe" src={``}/>
                  </AvatarGroup>
                </Box>
              </Card>
            </Grid>
            <Grid item={true} xs={6}>
              <Card className={styles.Collection} variant={"outlined"}>
                <CardHeader
                  avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={NlpSvg.default}/>}
                  title={`${t('collection.NLP')}`}
                />
                <CardContent>
                  <p>{t('collection.NLPDesc')}</p>
                </CardContent>
                <Box p={1}>
                  <AvatarGroup
                    max={4}
                    classes={{
                      root: styles.CollectionUserBar,
                      avatar: styles.CollectionUserMini
                    }}
                  >
                    <Avatar aria-label="recipe" src={``}/>
                  </AvatarGroup>
                </Box>
              </Card>
            </Grid>
          </Grid>
          <Divider/>
          <Grid style={{paddingTop: "20px"}} container={true}>
            <Grid item={true} xs={6}>
              <Card className={styles.Collection} variant={"outlined"}>
                <CardHeader
                  avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={PythonSvg.default}/>}
                  title={`${t('collection.python')}`}
                />
                <CardContent>
                  <p>{t('collection.pythonDesc')}</p>
                </CardContent>
                <Box p={1}>
                  <AvatarGroup
                    max={4}
                    classes={{
                      root: styles.CollectionUserBar,
                      avatar: styles.CollectionUserMini
                    }}
                  >
                    <Avatar aria-label="recipe" src={``}/>
                  </AvatarGroup>
                </Box>
              </Card>
            </Grid>
            <Grid item={true} xs={6}>
              <Card className={styles.Collection} variant={"outlined"}>
                <CardHeader
                  avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={GolangSvg.default}/>}
                  title={`${t('collection.golang')}`}
                />
                <CardContent>
                  <p>{t('collection.golangDesc')}</p>
                </CardContent>
                <Box p={1}>
                  <AvatarGroup
                    max={4}
                    classes={{
                      root: styles.CollectionUserBar,
                      avatar: styles.CollectionUserMini
                    }}
                  >
                    <Avatar aria-label="recipe" src={``}/>
                  </AvatarGroup>
                </Box>
              </Card>
            </Grid>
            <Grid item={true} xs={6}>
              <Card className={styles.Collection} variant={"outlined"}>
                <CardHeader
                  avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={JsSvg.default}/>}
                  title={`${t('collection.js')}`}
                />
                <CardContent>
                  <p>{t('collection.jsDesc')}</p>
                </CardContent>
                <Box p={1}>
                  <AvatarGroup
                    max={4}
                    classes={{
                      root: styles.CollectionUserBar,
                      avatar: styles.CollectionUserMini
                    }}
                  >
                    <Avatar aria-label="recipe" src={``}/>
                  </AvatarGroup>
                </Box>
              </Card>
            </Grid>
            <Grid item={true} xs={6}>
              <Card className={styles.Collection} variant={"outlined"}>
                <CardHeader
                  avatar={<Avatar className={styles.CollectionIco} aria-label="recipe" src={TsSvg.default}/>}
                  title={`${t('collection.ts')}`}
                />
                <CardContent>
                  <p>{t('collection.tsDesc')}</p>
                </CardContent>
                <Box p={1}>
                  <AvatarGroup
                    max={4}
                    classes={{
                      root: styles.CollectionUserBar,
                      avatar: styles.CollectionUserMini
                    }}
                  >
                    <Avatar aria-label="recipe" src={``}/>
                  </AvatarGroup>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
    }
  </Box>
}
