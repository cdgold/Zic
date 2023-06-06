import React, { useState } from "react"
import { TextField } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import dummyResults from "../test/dummySearchResults.js"

const HrStyled = styled.hr`
  margin-left: 10px;
  width: max(30%, 200px);
  margin-bottom: 10px;
  font-weight: normal;
  size: 4px;
  color: black;
`

const ResultRow = styled.div`
  font: "Archivo";
  color: black;
  font-size: ${props => props.theme.fonts.sizes.titleSmall};
`

const Result = ({ track }) => {
  return(
    <ResultRow>
      <HrStyled />
      { track.images[0].url ? 
        <img style={{ height: "80px", width:"80px" }} src={track.images[0].url} /> 
        : null
      }
      {track.name} by {track.artists[0].name} ({track.release_date.slice(0, 4)}) <br></br>
    </ResultRow>
  )
}

const SearchResults = ({ searchResponse, searchQuery }) => {
  //searchQuery = "Tyler the creator"
  //searchResponse = dummyResults.albums.items
  console.log(searchResponse)

  if (searchResponse.length === 0){
    return(
    <div>
        No results.
    </div>
    )
  }
  return(
    <div>
        Results for: {searchQuery}
        {searchResponse.map(result => {
          const albumID = result.uri.split(":")[2]
          return(
          <Link 
            style={{ textDecoration: "none", textColor: "red" }} 
            key={result.uri} 
            to={`/album/${albumID}`}
          >
            <Result track={result} />
          </Link>
          )
        })}
    </div>
  )
}

export default SearchResults