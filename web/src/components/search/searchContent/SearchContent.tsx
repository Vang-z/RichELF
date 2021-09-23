import React from "react";
import styles from "./SearchContent.module.css"
import {useParams} from "react-router-dom";
import {useSelector} from "../../../redux/hooks";

import Box from "@mui/material/Box";

import {SearchTending} from "../searchTending";
import {PreSearch} from "../preSearch";
import {SearchResult} from "../searchResult";


export const SearchContent: React.FC = () => {
  const search = useSelector(s => s.search.keywords)
  const {keywords} = useParams<{ keywords: string }>()

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
