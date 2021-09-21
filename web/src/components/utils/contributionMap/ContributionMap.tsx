import React, {useState, useEffect, useCallback} from "react";
import styles from "./ContributionMap.module.css";
import useScreenSize from "use-screen-size";
import {useTranslation} from "react-i18next";
import {v4 as uuid4} from "uuid";
import {useSelector} from "../../../redux/hooks";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

import HeatMap from "@uiw/react-heat-map";

import {MiniWidth, SizeProps, Small} from "../../../utils/util";
import classNames from "classnames";

interface ContributionMapProps {
  className?: string,
  value: {
    date: string,
    count: number
  }[] | [],
  info: {
    total: string | number,
    continuance: string | number
  }
}


export const ContributionMap: React.FC<ContributionMapProps & SizeProps> = ({className, value, info, size}) => {
  const [startDate, setStartDate] = useState<Date>()
  const lang = useSelector(s => s.language)
  const {t} = useTranslation()
  const screenSize = useScreenSize().width
  const panelColor = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
  const monthLabels = [
    t(`contributionMap.month.Jan`),
    t(`contributionMap.month.Feb`),
    t(`contributionMap.month.Mar`),
    t(`contributionMap.month.Apr`),
    t(`contributionMap.month.May`),
    t(`contributionMap.month.Jun`),
    t(`contributionMap.month.Jul`),
    t(`contributionMap.month.Aug`),
    t(`contributionMap.month.Sep`),
    t(`contributionMap.month.Oct`),
    t(`contributionMap.month.Nov`),
    t(`contributionMap.month.Dec`),
  ]

  const generateStartDate = useCallback(() => {
    const map = document.getElementById('contributionMap')
    if (map) {
      const rate = screenSize >= MiniWidth ? 17.6 : 19
      const mapWidth = map.offsetWidth
      const col = Math.floor(mapWidth / rate) - 1
      const days = col * 7
      const today = new Date()
      today.setDate(today.getDate() - days)
      setStartDate(today)
    }
  }, [screenSize])

  const generateTooltipTitle = (date: string, count?: number) => {
    const day = new Date(date)
    if (lang.lang === 'en') {
      const fullDay = monthLabels[day.getMonth()] + ' ' + day.getDate() + ', ' + day.getFullYear()
      if (!count) {
        return 'No contributions on ' + fullDay
      }
      return count + ' contributions on ' + fullDay
    } else {
      const fullDay = day.getFullYear() + '-' + (day.getMonth() + 1 < 10 ? '0' + (day.getMonth() + 1) : day.getMonth() + 1) + '-' + (day.getDate() < 10 ? '0' + day.getDate() : day.getDate())
      if (!count) {
        return '0 个贡献：' + fullDay
      }
      return count + ' 个贡献：' + fullDay
    }
  }

  useEffect(() => {
    generateStartDate()
  }, [generateStartDate, screenSize])

  return <Box id={`contributionMap`} className={className}>
    <HeatMap
      value={JSON.parse(JSON.stringify(value))}
      startDate={startDate}
      endDate={new Date()}
      width={'100%'}
      space={6}
      style={{color: '#ccc'}}
      rectProps={{rx: 2.5}}
      panelColors={{
        0: panelColor[0],
        1: panelColor[0],
        2: panelColor[1],
        3: panelColor[1],
        4: panelColor[2],
        5: panelColor[2],
        6: panelColor[3],
        7: panelColor[3],
        8: panelColor[3],
        9: panelColor[4]
      }}
      legendCellSize={0}
      weekLables={[
        "",
        t(`contributionMap.week.Mon`),
        "",
        t(`contributionMap.week.Wed`),
        "",
        t(`contributionMap.week.Fri`),
        ""
      ]}
      monthLables={monthLabels}
      rectRender={(props, data) => {
        return (
          <Tooltip key={uuid4()} placement="top" title={generateTooltipTitle(data.date, data.count)} arrow={true}
                   TransitionComponent={Zoom} classes={{tooltip: styles.Tooltip, arrow: styles.TooltipArrow}}>
            <rect {...props}/>
          </Tooltip>
        )
      }}
    />
    <Box className={styles.ContributionInfo}>
      <Box
        className={classNames([styles.ContributionBaseInfo], {[`${styles.MiniContributionBaseInfo}`]: size === Small})}>
        <Box className={styles.TotalContributions}>
          <SportsEsportsIcon/><span>{t(`contributionMap.totalContributions`)}：{info.total}</span>
        </Box>
        <Box className={styles.ContinueContributions}>
          <VideogameAssetIcon/>
          <span>{t(`contributionMap.longestContinuousContribution`)}：{info.continuance} {t(`contributionMap.day`)}</span>
        </Box>
      </Box>
      <Box className={classNames([styles.ContributionsLabel], {[`${styles.MiniContributionsLabel}`]: size === Small})}>
        <span>{t(`contributionMap.less`)}</span>
        <svg width={72} height={24}>
          <rect fill={panelColor[1]} width="11" height="11" rx={2.5} x={5} y={6}/>
          <rect fill={panelColor[2]} width="11" height="11" rx={2.5} x={22} y={6}/>
          <rect fill={panelColor[3]} width="11" height="11" rx={2.5} x={39} y={6}/>
          <rect fill={panelColor[4]} width="11" height="11" rx={2.5} x={56} y={6}/>
        </svg>
        <span>{t(`contributionMap.more`)}</span>
      </Box>
    </Box>
  </Box>
}