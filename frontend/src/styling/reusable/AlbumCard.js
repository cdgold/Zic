import React, { useEffect, useState } from "react"
import styled from "styled-components"

const AlbumCardStyled = styled.div`
  
`

const AlbumText = styled.div`
  font-family: ${props => props.theme.bodyFonts};
  font-family: ${props => props.theme.fonts.sizes.bodyMedium};
  text-align: center;
`

const AlbumImg = styled.img`
  width: 60%;
  min-width: 100px;
  max-width: 200px;
`

const AlbumCard = ({ review, allAlbumInfo }) => {
  const [album, setAlbum] = useState(null)

  useEffect(() => {
    const thisAlbum = allAlbumInfo.find((album) => review.album_id === album.id)
    console.log("Matching album ID is: ", thisAlbum, " for review: ", review)
    setAlbum(thisAlbum)
  }, [allAlbumInfo, review])

  if(album !== null){
  return(
    <AlbumCardStyled>
      <div style={{ display: "flex", justifyContent: "center" }} >
        <AlbumImg src={album.images[0].url} />
      </div>
      <AlbumText>{album.name} <br></br> {album.artists[0].name} </AlbumText>
      <AlbumText> {review.rating} </AlbumText> 
      <AlbumText style={{ alignText: "left" }}>  <em> {review.review_text} </em> </AlbumText>
    </AlbumCardStyled>
  )
  } else {
    return(null)
  }
}

export default AlbumCard