import React from "react";
import {DatePicker as AntdDatePicker} from "antd"
import {useSelector} from "../../../redux/hooks";

import Box from "@mui/material/Box";

import moment from 'moment';
import 'moment/locale/zh-cn';
import locale_zh from 'antd/es/date-picker/locale/zh_CN';
import locale_en from 'antd/es/date-picker/locale/en_US';


const {RangePicker} = AntdDatePicker;

interface DatePickerProps {
  className?: string
  placeholder?: string
  value: any
  changeHandler: (e: any) => void
}

export const RangeDataPiker: React.FC<DatePickerProps> = ({className, value, changeHandler}) => {
  const language = useSelector(s => s.language)

  return <Box className={className}>
    <RangePicker
      locale={language.lang === 'zh' ? locale_zh : locale_en}
      inputReadOnly
      onChange={(e: any) => {
        changeHandler(e)
      }}
      value={[value.start ? moment(value.start) : null, value.end ? moment(value.end) : null]}
      allowClear={false}
    />
  </Box>
}

export const DataPiker: React.FC<DatePickerProps> = ({className, placeholder, value, changeHandler}) => {
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
      value={value ? moment(value) : null}
      allowClear={false}
    />
  </Box>
}