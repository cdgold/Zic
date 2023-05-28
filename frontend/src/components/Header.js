import React, { useState } from "react"
import { TextField } from "@mui/material"
import styled from "styled-components"

const Header = ({ musicSearchRequest, setMusicSearchText }) => {
  return(
    <div>
      <TextField
        onKeyUp = {(event) => { if(event.key === "Enter"){
          musicSearchRequest()
        }}}
        onChange = {(event) => setMusicSearchText(event.target.value)}
        variant="outlined"
      />
        Header!
    </div>
  )
}

export default Header