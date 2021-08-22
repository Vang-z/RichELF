import React, {useEffect} from "react";
import styles from "./SearchContent.module.css"
import {useParams} from "react-router-dom";
import {useSelector} from "../../../redux/hooks";
import {searchSlice} from "../../../redux/search/slice";

import Box from "@material-ui/core/Box";
import {SearchTending} from "../searchTending";
import {PreSearch} from "../preSearch";
import {SearchResult} from "../searchResult";


export const SearchContent: React.FC = () => {
  const search = useSelector(s => s.search.keywords)
  const {keywords} = useParams<{ keywords: string }>()

  useEffect(() => {
    if (keywords !== undefined) {
      searchSlice.actions.dispatchKeywords(keywords)
    }
  }, [keywords])

  return <>
    <Box className={styles.Container}>
      {search === "" && keywords === undefined ?
        <SearchTending/>
        :
        keywords === undefined ?
          <PreSearch/>
          :
          <SearchResult/>
      }
    </Box>
  </>
}
