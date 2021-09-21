import React, {useEffect, useState} from "react";
import styles from "./ProfileContent.module.css";
import {useHistory} from "react-router-dom";
import classNames from "classnames";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {useDebouncedCallback} from "use-debounce";
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
import jwt_decode from "jwt-decode";

import SwipeableViews from 'react-swipeable-views';

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import IconButton from "@mui/material/IconButton";

import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import GroupIcon from '@mui/icons-material/Group';
import LinkIcon from '@mui/icons-material/Link';
import NearMeIcon from '@mui/icons-material/NearMe';
import CloseIcon from "@mui/icons-material/Close";

import {ContributionMap, Timeline, UserPreview} from "../../utils";
import {Preview} from "../preview";
import {NotFound} from "../../404";

import {SizeProps, Small} from "../../../utils/util";
import Api from "../../../utils/api";


export const ProfileContent: React.FC<SizeProps & { username: string }> = ({size, username}) => {
  const [tab, setTab] = useState(0)
  const history = useHistory()
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const popularRepositories = useSelector(s => s.profile.popularRepositories)
  const contribution = useSelector(s => s.profile.contribution)
  const repositories = useSelector(s => s.profile.repositories)
  const repositoriesSort = useSelector(s => s.profile.repositoriesSort)
  const follower = useSelector(s => s.profile.follower)
  const followerSort = useSelector(s => s.profile.followerSort)
  const following = useSelector(s => s.profile.following)
  const followingSort = useSelector(s => s.profile.followingSort)
  const user = useSelector(s => s.profile.user)
  const userState = useSelector(s => s.profile.userState)
  const auth = useSelector(s => s.auth)

  useEffect(() => {
    dispatch(profileSlice.actions.clearContent())
    dispatch(getPopularRepositories(username))
    dispatch(getContribution(username))
    dispatch(getTimeline({username: username, page: 1}))
    dispatch(getRepositories({username: username, page: 1, auth}))
    dispatch(getFollower({username: username, page: 1, auth}))
    dispatch(getFollowing({username: username, page: 1, auth}))
    dispatch(getUser({username, auth}))
    setTab(0)
  }, [dispatch, auth, username])

  useEffect(() => {
    switch (tab) {
      case 0:
        dispatch(getTimeline({username: username, page: 1}))
        return
      case 1:
        dispatch(getRepositories({username: username, page: 1, auth}))
        return
      case 2:
        dispatch(getFollower({username: username, page: 1, auth}))
        return
      case 3:
        dispatch(getFollowing({username: username, page: 1, auth}))
        return
    }
  }, [dispatch, auth, username, tab])

  const repositoriesInputHandler = useDebouncedCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    dispatch(profileSlice.actions.dispatchRepositoriesKeywords(e.target.value))
    dispatch(getRepositories({username: username, page: 1, auth}))
  }, 1000)

  const followerInputHandler = useDebouncedCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    dispatch(profileSlice.actions.dispatchFollowerKeywords(e.target.value))
    dispatch(getFollower({username: username, page: 1, auth}))
  }, 1000)

  const followingInputHandler = useDebouncedCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    dispatch(profileSlice.actions.dispatchFollowingKeywords(e.target.value))
    dispatch(getFollowing({username: username, page: 1, auth}))
  }, 1000)

  if (userState) return <></>
  if (!user) return <NotFound/>

  return <Box className={classNames([styles.MainContainer], {[`${styles.MiniMainContainer}`]: size === Small})}>
    <Box className={classNames([styles.UserInfoContainer], {[`${styles.MiniUserInfoContainer}`]: size === Small})}>
      <Avatar
        className={styles.Avatar}
        src={user.avatar_url}/>
      <Box className={styles.Username}>{user.username}</Box>
      <Box className={styles.Desc}>{user.bio}</Box>
      {
        auth.accessToken ?
          user && jwt_decode(auth.accessToken).username === user.username ?
            <Button
              className={styles.EditBtn} variant={"outlined"}
              onClick={() => history.push(`/user/${user.username}/settings`)}>
              {t(`profile.editProfile`)}
            </Button> :
            <Button
              className={styles.EditBtn} variant={"outlined"}>
              {user.is_followed ? t(`profile.unfollow`) : t(`profile.follow`)}
            </Button> :
          <Button
            className={styles.EditBtn} variant={"outlined"}>
            {t(`profile.follow`)}
          </Button>
      }
      <Box className={styles.BaseInfo}>
        <SupervisorAccountIcon className={styles.InfoIcon}/>
        <span className={styles.InfoSpan} onClick={() => setTab(2)}>{user.followers} {t(`profile.follower`)}</span>
        <span className={styles.Dot}>•</span>
        <GroupIcon className={styles.InfoIcon}/>
        <span className={styles.InfoSpan} onClick={() => setTab(3)}>{user.followings} {t(`profile.following`)}</span>
      </Box>
      <Divider className={styles.LinkDivider}/>
      <Box className={styles.LinkInfo}>
        <LinkIcon className={styles.LinkIcon}/>
        <a
          className={styles.LinkSpan} href={user.link ? user.link : `https://richelf.tech/${user.username}`}
          target={'_blank'}
          rel="noreferrer">{user.link ? user.link : `https://richelf.tech/${user.username}`}</a>
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
                      className={classNames([styles.Contribution], {[`${styles.MiniContribution}`]: size === Small})}
                      size={size}
                      key={data.aid}
                      aid={data.aid}
                      title={data.title}
                      desc={data.desc}
                      date={data.publish_at}
                      lang={data.lang}
                      views={data.views}
                      commentCount={data.comment_count}
                      stars={data.stars}
                      downloadCount={data.download_count}/>
                  })}
                </Box>
                <Box className={styles.ContributionMapBox}>
                  {
                    contribution && <ContributionMap value={contribution.value} info={contribution.info} size={size}/>
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
                    className={styles.RepositoriesSearch} variant={"outlined"}
                    placeholder={t(`profile.search`)} size={"small"}
                    onChange={repositoriesInputHandler}
                  />
                  <Box className={classNames([styles.SortedBox], {[`${styles.MiniSortedBox}`]: size === Small})}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t(`profile.sorted`)}</FormLabel>
                      <RadioGroup
                        row value={repositoriesSort}
                        onChange={(e, value) => {
                          dispatch(profileSlice.actions.dispatchRepositoriesSort(value))
                          dispatch(getRepositories({username: username, page: 1, auth}))
                        }}>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value="publish_at"
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.recentlyPublish`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value="stars" control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostStar`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value="views" control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostView`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value="comments"
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostComment`)}/>
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
                <Box hidden={size === Small}>
                  <Button
                    style={{height: '44px'}}
                    variant={"outlined"} startIcon={<NearMeIcon/>}
                    onClick={() => {
                      if (auth.accessToken) {
                        const user = jwt_decode(auth.accessToken)
                        if (!user.create_at) {
                          enqueueSnackbar(t('enqueueSnackbar.makeArticleWaitingForActive'), {
                            variant: "warning",
                            action: key => <IconButton
                              disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                          })
                          return
                        }
                        Api.http.post(`/article`, {}, {
                          headers: {'Authorization': auth.accessToken ? `${auth.tokenType} ${auth.accessToken}` : 'Bearer'}
                        }).then(res => {
                          history.push(`/user/${user.username}/article/${res.data.data}`)
                        }).catch(() => {
                          enqueueSnackbar(t('enqueueSnackbar.makeArticleFailed'), {
                            variant: "error",
                            action: key => <IconButton
                              disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                          })
                        })
                      } else {
                        enqueueSnackbar(t('enqueueSnackbar.makeArticleWaitingForLogin'), {
                          variant: "warning",
                          action: key => <IconButton
                            disableRipple={true} onClick={() => closeSnackbar(key)}><CloseIcon/></IconButton>,
                        })
                      }
                    }}>{t(`profile.newArticle`)}</Button>
                </Box>
              </Box>
              {
                repositories && repositories.results.map((data: any) => {
                  if (user.username === username) {
                    return <Preview
                      className={styles.RepositoryPreview}
                      size={size}
                      key={data.aid}
                      aid={data.aid}
                      status={data.status}
                      title={data.title}
                      desc={data.desc}
                      username={username}
                      date={data.publish_at}
                      lang={data.lang}
                      views={data.views}
                      commentCount={data.comment_count}
                      stars={data.stars}
                      downloadCount={data.download_count}/>
                  }
                  return <Preview
                    className={styles.RepositoryPreview}
                    size={size}
                    key={data.aid}
                    aid={data.aid}
                    title={data.title}
                    desc={data.desc}
                    date={data.publish_at}
                    lang={data.lang}
                    views={data.views}
                    commentCount={data.comment_count}
                    stars={data.stars}
                    downloadCount={data.download_count}/>
                })
              }
              <Box
                className={styles.LoadingMoreRepository}
                hidden={repositories && !repositories.next}>
                <Button
                  disableRipple={true} fullWidth={true} variant={"outlined"}
                  onClick={() => {
                    dispatch(getRepositories({username: username, page: repositories.next, auth}))
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
                    className={styles.RepositoriesSearch} variant={"outlined"}
                    placeholder={t(`profile.search`)} size={"small"}
                    onChange={followerInputHandler}
                  />
                  <Box className={classNames([styles.SortedBox], {[`${styles.MiniSortedBox}`]: size === Small})}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t(`profile.sorted`)}</FormLabel>
                      <RadioGroup row value={followerSort} onChange={(e, value) => {
                        dispatch(profileSlice.actions.dispatchFollowerSort(value))
                        dispatch(getFollower({username: username, page: 1, auth}))
                      }}>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'create_at'}
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.recentlyFollow`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'followings'}
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostFollowing`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'followers'}
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostFollower`)}/>
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
              {
                follower && follower.results.map((user: any) => {
                  return <UserPreview
                    className={styles.UserPreview}
                    key={user.uid}
                    uid={user.uid}
                    username={user.username}
                    avatar={user.avatar_url}
                    bio={user.bio}
                    articles={user.articles}
                    followers={user.followers}
                    followings={user.followings}
                    is_followed={user.is_followed}
                  />
                })
              }
              <Box className={styles.LoadingMoreRepository}
                   hidden={follower && !follower.next}>
                <Button
                  disableRipple={true} fullWidth={true} variant={"outlined"}
                  onClick={() => dispatch(getFollower({username: username, page: follower.next, auth}))}>
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
                    className={styles.RepositoriesSearch} variant={"outlined"}
                    placeholder={t(`profile.search`)} size={"small"}
                    onChange={followingInputHandler}
                  />
                  <Box
                    className={classNames([styles.SortedBox], {[`${styles.MiniSortedBox}`]: size === Small})}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t(`profile.sorted`)}</FormLabel>
                      <RadioGroup row value={followingSort} onChange={(e, value) => {
                        dispatch(profileSlice.actions.dispatchFollowingSort(value))
                        dispatch(getFollowing({username: username, page: 1, auth}))
                      }}>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'create_at'}
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.recentlyFollow`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'followings'}
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostFollowing`)}/>
                        <FormControlLabel
                          className={styles.SortedBtnBox}
                          value={'followers'}
                          control={<Radio className={styles.SortedBtn} color={"default"} size={"small"}/>}
                          label={t(`profile.mostFollower`)}/>
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
              {
                following && following.results.map((user: any) => {
                  return <UserPreview
                    className={styles.UserPreview}
                    key={user.uid}
                    uid={user.uid}
                    username={user.username}
                    avatar={user.avatar_url}
                    bio={user.bio}
                    articles={user.articles}
                    followers={user.followers}
                    followings={user.followings}
                    is_followed={user.is_followed}
                  />
                })
              }
              <Box className={styles.LoadingMoreRepository}
                   hidden={following && !following.next}>
                <Button
                  disableRipple={true} fullWidth={true} variant={"outlined"}
                  onClick={() => dispatch(getFollowing({username: username, page: following.next, auth}))}>
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
