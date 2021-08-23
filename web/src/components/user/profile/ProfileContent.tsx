import React, {useEffect, useState} from "react";
import styles from "./ProfileContent.module.css";
import {useHistory} from "react-router-dom";
import classNames from "classnames";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useSelector} from "../../../redux/hooks";
import {
  profileSlice,
  getContribution,
  getTimeline,
  getPopularRepositories,
  getRepositories,
  getFollower,
  getFollowing,
  getUser,
} from "../../../redux/profile/slice";

import SwipeableViews from 'react-swipeable-views';

import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import GroupIcon from '@material-ui/icons/Group';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import LinkIcon from '@material-ui/icons/Link';
import CreateIcon from '@material-ui/icons/Create';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import {ContributionMap, Timeline, UserPreview} from "../../utils";
import {Preview} from "../preview";

import {SizeProps, Small} from "../../../utils/util";
import Api from "../../../utils/api";


export const ProfileContent: React.FC<SizeProps & { username: string }> = ({size, username}) => {
  const [tab, setTab] = useState(0)
  const [repositoriesSorted, setRepositoriesSorted] = useState('0')
  const [followerSorted, setFollowerSorted] = useState('0')
  const [followingSorted, setFollowingSorted] = useState('0')
  const history = useHistory()
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const popularRepositories = useSelector(s => s.profile.popularRepositories)
  const contribution = useSelector(s => s.profile.contribution)
  const repositories = useSelector(s => s.profile.repositories)
  const follower = useSelector(s => s.profile.follower)
  const following = useSelector(s => s.profile.following)
  const authUser = useSelector(s => s.auth.user)
  const user = useSelector(s => s.profile.user)

  useEffect(() => {
    dispatch(getPopularRepositories(username))
    dispatch(getContribution(username))
    dispatch(getTimeline({username: username, page: 1}))
    dispatch(getRepositories({username: username, page: 1}))
    dispatch(getFollower({username: username, page: 1}))
    dispatch(getFollowing({username: username, page: 1}))
    dispatch(getUser(username))
    setTab(0)
    return () => {
      dispatch(profileSlice.actions.clearContent())
    }
  }, [authUser, dispatch, username])

  return <Box className={classNames([styles.MainContainer], {[`${styles.MiniMainContainer}`]: size === Small})}>
    <Box className={classNames([styles.UserInfoContainer], {[`${styles.MiniUserInfoContainer}`]: size === Small})}>
      <Avatar
        className={styles.Avatar}
        src={`https://vangz.club/media/avatar/trR6oSmAKGpVuWyeP5uZ29/WpgAk6ckPKU8vRawTtg2WS.jpg`}/>
      <Box className={styles.Username}>{username}</Box>
      <Box className={styles.Desc}>But U can not make more time.</Box>
      {
        authUser ?
          user && authUser.username === user.data.username ?
            <Button
              className={styles.EditBtn} variant={"outlined"}
              onClick={() => history.push(`/user/Vang_z/settings`)}>
              {t(`profile.editProfile`)}
            </Button> :
            <Button
              className={styles.EditBtn} variant={"outlined"}>
              {user && user.data.followed ? t(`profile.unfollow`) : t(`profile.follow`)}
            </Button> :
          <Button
            className={styles.EditBtn} variant={"outlined"}>
            {t(`profile.follow`)}
          </Button>
      }
      <Box className={styles.BaseInfo}>
        <SupervisorAccountIcon className={styles.InfoIcon}/>
        <span className={styles.InfoSpan} onClick={() => setTab(2)}>700 {t(`profile.follower`)}</span>
        <span className={styles.Dot}>•</span>
        <GroupIcon className={styles.InfoIcon}/>
        <span className={styles.InfoSpan} onClick={() => setTab(3)}>261 {t(`profile.following`)}</span>
      </Box>
      <Box className={styles.BaseInfo}>
        <VisibilityIcon className={styles.InfoIcon}/>
        <span className={styles.InfoSpan}>700 {t(`profile.visit`)}</span>
        <span className={styles.Dot}>•</span>
        <FavoriteBorderIcon className={styles.InfoIcon}/>
        <span className={styles.InfoSpan}>261 {t(`profile.praise`)}</span>
      </Box>
      <Divider className={styles.LinkDivider}/>
      <Box className={styles.LinkInfo}>
        <LinkIcon className={styles.LinkIcon}/>
        <a
          className={styles.LinkSpan} href={`https://vangz.club`} target={'_blank'}
          rel="noreferrer">https://vangz.club</a>
      </Box>
    </Box>
    <Box className={classNames([styles.MainContent], {[`${styles.MiniMainContent}`]: size === Small})}>
      <Tabs
        value={tab}
        onChange={(e, value) => {
          setTab(value)
        }}
        variant={"scrollable"}
        className={styles.Tabs}
        classes={{
          indicator: styles.IndicatorColor
        }}>
        <Tab
          classes={{selected: styles.TabSelected}}
          label={t(`profile.overview`)}
          disableRipple={true}/>
        <Tab
          classes={{selected: styles.TabSelected}}
          label={t(`profile.repositories`)}
          disableRipple={true}/>
        <Tab
          classes={{selected: styles.TabSelected}}
          label={t(`profile.follower`)}
          disableRipple={true}/>
        <Tab
          classes={{selected: styles.TabSelected}}
          label={t(`profile.following`)}
          disableRipple={true}/>
      </Tabs>
      <SwipeableViews
        index={tab}
        onChangeIndex={(value) => {
          setTab(value)
        }}>
        <Box hidden={tab !== 0}>
          {
            tab === 0 &&
            <Box className={styles.Content}>
              <Box className={styles.ContributionBox}>
                <span className={styles.ContributionTitle}>{t(`profile.popularContribution`)}</span>
                <Box className={classNames([styles.Contributions], {[`${styles.MiniContributions}`]: size === Small})}>
                  {popularRepositories && popularRepositories.data.map((data: any) => {
                    return <Preview
                      key={data.id}
                      className={classNames([styles.Contribution], {[`${styles.MiniContribution}`]: size === Small})}
                      size={size}
                      id={data.id}
                      title={data.title}
                      desc={data.desc}
                      lang={data.lang}
                      comment={data.comment}
                      praise={data.praise}
                      view={data.view}/>
                  })}
                </Box>
                <Box className={styles.ContributionMapBox}>
                  {
                    contribution && <ContributionMap value={contribution.data} size={size}/>
                  }
                </Box>
                <Box className={styles.ActivityBorder}>
                  <span className={styles.ActivityTitle}>{t(`profile.activity`)}</span>
                  <Timeline username={username}/>
                </Box>
              </Box>
            </Box>
          }
        </Box>
        <Box hidden={tab !== 1}>
          {
            tab === 1 &&
            <Box className={styles.Content}>
              <Box className={styles.RepositoriesSearchBox}>
                <Box className={classNames([styles.MainSearchBox], {[`${styles.MiniMainSearchBox}`]: size === Small})}>
                  <TextField
                    className={styles.RepositoriesSearch}
                    variant={"outlined"} placeholder={t(`profile.search`)} size={"small"}/>
                  <Box className={classNames([styles.SortedBox], {[`${styles.MiniSortedBox}`]: size === Small})}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t(`profile.sorted`)}</FormLabel>
                      <RadioGroup row value={repositoriesSorted} onChange={(e, value) => setRepositoriesSorted(value)}>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value="0" control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.recentlyPublish`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value="1" control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostStar`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value="2" control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostView`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value="3" control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostComment`)}/>
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
                <Box hidden={size === Small}>
                  <ButtonGroup style={{height: '40px'}}>
                    <Button
                      variant={"outlined"} startIcon={<CloudUploadIcon/>}
                      onClick={() => {
                        Api.getUUID().then(res => {
                          history.push(`/user/Vang_z/dataset/${res.data.data}`)
                        })
                      }}>{t(`profile.newDataset`)}</Button>
                    <Button
                      variant={"outlined"} startIcon={<CreateIcon/>}
                      onClick={() => {
                        Api.getUUID().then(res => {
                          history.push(`/user/Vang_z/article/${res.data.data}`)
                        })
                      }}>{t(`profile.newArticle`)}</Button>
                  </ButtonGroup>
                </Box>
              </Box>
              {
                repositories && repositories.data.map((data: any) => {
                  return <Preview
                    className={styles.RepositoryPreview}
                    size={size}
                    key={data.id}
                    id={data.id}
                    status={data.status}
                    title={data.title}
                    desc={data.desc}
                    date={data.date}
                    lang={(data as any).lang}
                    download={(data as any).download}
                    comment={data.comment}
                    praise={data.praise}
                    view={data.view}/>
                })
              }
              <Box
                className={styles.LoadingMoreRepository}
                hidden={repositories && !repositories.nextPage}>
                <Button
                  disableRipple={true} fullWidth={true} variant={"outlined"}
                  onClick={() => {
                    dispatch(getRepositories({username: username, page: repositories.nextPage}))
                  }}>
                  {t(`profile.loadingMore`)}
                </Button>
              </Box>
            </Box>
          }
        </Box>
        <Box hidden={tab !== 2}>
          {
            tab === 2 &&
            <Box className={styles.Content}>
              <Box className={styles.RepositoriesSearchBox}>
                <Box
                  className={classNames([styles.MainSearchBox], {[`${styles.MiniMainSearchBox}`]: size === Small})}>
                  <TextField
                    className={styles.RepositoriesSearch}
                    variant={"outlined"} placeholder={t(`profile.search`)} size={"small"}/>
                  <Box className={classNames([styles.SortedBox], {[`${styles.MiniSortedBox}`]: size === Small})}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t(`profile.sorted`)}</FormLabel>
                      <RadioGroup row value={followerSorted} onChange={(e, value) => setFollowerSorted(value)}>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'0'} control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.recentlyFollow`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'1'} control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostFollowing`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'2'} control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostFollower`)}/>
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
              {
                follower && follower.data.map((user: any) => {
                  return <UserPreview
                    key={user.id}
                    username={user.username}
                    avatar={user.avatar}
                    desc={user.desc}
                    article={user.article}
                    dataset={user.dataset}
                    praise={user.praise}
                    follower={user.follower}
                    following={user.following}
                    followed={user.followed}
                  />
                })
              }
              <Box className={styles.LoadingMoreRepository}
                   hidden={follower && !follower.nextPage}>
                <Button
                  disableRipple={true} fullWidth={true} variant={"outlined"}
                  onClick={() => dispatch(getFollower({username: username, page: follower.nextPage}))}>
                  {t(`profile.loadingMore`)}
                </Button>
              </Box>
            </Box>
          }
        </Box>
        <Box hidden={tab !== 3}>
          {
            tab === 3 &&
            <Box className={styles.Content}>
              <Box className={styles.RepositoriesSearchBox}>
                <Box
                  className={classNames([styles.MainSearchBox], {[`${styles.MiniMainSearchBox}`]: size === Small})}>
                  <TextField
                    className={styles.RepositoriesSearch}
                    variant={"outlined"} placeholder={t(`profile.search`)} size={"small"}/>
                  <Box
                    className={classNames([styles.SortedBox], {[`${styles.MiniSortedBox}`]: size === Small})}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t(`profile.sorted`)}</FormLabel>
                      <RadioGroup row value={followingSorted} onChange={(e, value) => setFollowingSorted(value)}>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'0'}
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.recentlyFollow`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'1'}
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostFollowing`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'2'}
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostFollower`)}/>
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
              {
                following && following.data.map((user: any) => {
                  return <UserPreview
                    key={user.id}
                    username={user.username}
                    avatar={user.avatar}
                    desc={user.desc}
                    article={user.article}
                    dataset={user.dataset}
                    praise={user.praise}
                    follower={user.follower}
                    following={user.following}
                    followed={user.followed}
                  />
                })
              }
              <Box className={styles.LoadingMoreRepository}
                   hidden={following && !following.nextPage}>
                <Button
                  disableRipple={true} fullWidth={true} variant={"outlined"}
                  onClick={() => dispatch(getFollowing({username: username, page: following.nextPage}))}>
                  {t(`profile.loadingMore`)}
                </Button>
              </Box>
            </Box>
          }
        </Box>
      </SwipeableViews>
    </Box>
  </Box>
}
