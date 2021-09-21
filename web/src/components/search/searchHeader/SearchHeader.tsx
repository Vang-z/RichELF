import React, {useEffect, useRef} from "react";
import styles from "./SearchHeader.module.css"
import {useHistory, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDebouncedCallback} from "use-debounce";
import {useDispatch} from "react-redux";
import {searchSlice} from "../../../redux/search/slice";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";

import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SearchIcon from '@mui/icons-material/Search';


export const SearchHeader: React.FC = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const searchEl = useRef() as React.MutableRefObject<HTMLElement>
  const {t} = useTranslation()

  const {keywords} = useParams<{ keywords: string }>()

  useEffect(() => {
    if (keywords !== undefined) {
      dispatch(searchSlice.actions.dispatchKeywords(keywords))
      const input = searchEl.current.firstElementChild as HTMLInputElement
      input.value = keywords
    } else {
      searchEl.current.click()
    }
  }, [dispatch, keywords])

  const searchInputHandler = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      dispatch(searchSlice.actions.dispatchKeywords(e.target.value))
    }, 1000)

  const searchClickHandler = () => {
    const input = searchEl.current.firstElementChild as HTMLInputElement
    return history.push(`/search/${input.value.replace(/\//g, '\\')}`);
  }

  return <>
    <Box className={styles.Header}>
      <Box className={styles.BackContainer}>
        <IconButton onClick={() => {
          dispatch(searchSlice.actions.dispatchKeywords(""))
          const input = searchEl.current.firstElementChild as HTMLInputElement
          input.value = ''
          return history.goBack()
        }}><CloseIcon/></IconButton>
      </Box>
      <Box className={styles.InputContainer}>
        <Input
          className={styles.Search}
          ref={searchEl}
          placeholder={`${t('header.search')}`}
          defaultValue={keywords}
          onChange={e => searchInputHandler(e)}
          onKeyUp={(e) => {
            switch (e.key) {
              case 'Enter':
                return searchClickHandler();
              case 'Escape':
                dispatch(searchSlice.actions.dispatchKeywords(""))
                return history.goBack()
            }
          }}
        />
      </Box>
      <Box className={styles.SearchContainer}>
        <IconButton
          onClick={() => {
            dispatch(searchSlice.actions.dispatchKeywords(""))
            const input = searchEl.current.firstElementChild as HTMLInputElement
            input.value = ''
          }}><KeyboardBackspaceIcon/></IconButton>
        <IconButton onClick={() => searchClickHandler()}><SearchIcon/></IconButton>
      </Box>
    </Box>
  </>
}
