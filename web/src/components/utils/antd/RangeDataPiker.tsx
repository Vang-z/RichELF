import React from "react";
import {useSelector} from "../../../redux/hooks";
import {DatePicker as AntdDatePicker} from "antd"
import Box from "@material-ui/core/Box";

import 'moment/locale/zh-cn';
import locale_zh from 'antd/es/date-picker/locale/zh_CN';
import locale_en from 'antd/es/date-picker/locale/en_US';


const {RangePicker} = AntdDatePicker;

interface DatePickerProps {
  changeHandler: (e: any) => void
  className?: string
  placeholder?: string
}

export const RangeDataPiker: React.FC<DatePickerProps> = ({changeHandler, className}) => {
  const language = useSelector(s => s.language)
  return <Box className={className}>
    <RangePicker
      locale={language.lang === 'zh' ? locale_zh : locale_en}
      inputReadOnly
      // size={'small'}
      onChange={(e) => {
        changeHandler(e)
      }}
    />
  </Box>
}

export const DataPiker: React.FC<DatePickerProps> = ({changeHandler, className,placeholder}) => {
  const language = useSelector(s => s.language)
  return <Box className={className}>
    <AntdDatePicker
      locale={language.lang === 'zh' ? locale_zh : locale_en}
      inputReadOnly
      size={'small'}
      placeholder={placeholder}
      onChange={(e) => {
        changeHandler(e)
      }}
    />
  </Box>
}