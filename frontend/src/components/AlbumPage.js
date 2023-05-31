import React, { useState } from "react"
import { TextField } from "@mui/material"
import styled from "styled-components"

const AlbumPage = ({ album }) => {


  return(
    <div>
        {album.name} by {album.artist.name}
        <img src={album.images[0]}> </img>
    </div>
  )
}

export default AlbumPage