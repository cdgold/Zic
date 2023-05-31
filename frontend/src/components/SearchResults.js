import React, { useState } from "react"
import { TextField } from "@mui/material"
import { Link } from "react-router-dom"
import styled from "styled-components"

const Header = ({ searchResponse, searchQuery }) => {
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
            return(
            <Link key={result.uri} to={`/albums/${result.uri}`}>
                {result.name} by {result.artists[0].name} <br></br>
            </Link>
            )
        })}
    </div>
  )
}

export default Header