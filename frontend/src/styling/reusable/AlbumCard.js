import React, { useEffect, useState } from "react"
import styled, { useTheme } from "styled-components"
import { Link } from "react-router-dom"

const AlbumCardStyled = styled.div`
  width: 100%;
`

const AlbumText = styled.div`
  font-family: ${props => props.theme.bodyFonts};
  font-size: ${props => props.theme.fonts.sizes.bodyMedium};
  text-align: center;
`

const AlbumImg = styled.img`
  width: 60%;
  min-width: 100px;
  max-width: 200px;
`

// softMax determines if review_text can be expanded or not
const AlbumCard = ({ review, allAlbumInfo, maxChar, isSoftMax }) => {
  const theme = useTheme()

  const [album, setAlbum] = useState(null)
  const [shortenedString, setShortenedString] = useState(null)
  const [hideOnReveal, setHideOnReveal] = useState("")
  const [showOnReveal, setShowOnReveal] = useState("none")

  const handleShow = () => {
    setHideOnReveal("none")
    setShowOnReveal("")
  } 

  const handleHide = () => {
    setHideOnReveal("")
    setShowOnReveal("none")
  } 

  useEffect(() => {
    const thisAlbum = allAlbumInfo.find((album) => review.album_id === album.id)
    console.log("Matching album ID is: ", thisAlbum, " for review: ", review)
    setAlbum(thisAlbum)
  }, [allAlbumInfo, review])

  useEffect(() => {
    if (maxChar && !isNaN(maxChar) && review.review_text.length > maxChar){
      let truncated = review.review_text. slice(0, maxChar)
      truncated = `${truncated}...`
      setShortenedString(truncated)
    } else {
      setShortenedString(null)
    }
  })

  if(album !== null){
  return(
      <AlbumCardStyled>
        <Link to={`/album/${album.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ display: "flex", justifyContent: "center" }} >
            <AlbumImg src={album.images[0].url} />
          </div>
        </Link>
        <AlbumText style={{ fontSize: theme.fonts.sizes.bodyLarge }}> {album.name} <br></br> {album.artists[0].name} </AlbumText>
        <AlbumText style={{ fontFamily: theme.titleFonts, fontSize: theme.fonts.sizes.titleTiny }}> {review.rating} </AlbumText> 
        <AlbumText style={{ alignText: "left", display: hideOnReveal }}>  
          <em> {shortenedString ? shortenedString : review.review_text} </em> 
        </AlbumText>
        { isSoftMax && shortenedString !== null ? 
          <button style={{ display: hideOnReveal }} onClick={() => handleShow()} >expand</button> 
          : null 
        }
        <AlbumText style={{ alignText: "left", display: showOnReveal }}>  {review.review_text} </AlbumText>
        <button style={{ display: showOnReveal, alignText: "right" }} onClick={() => handleHide()} >collapse</button>
      </AlbumCardStyled>

  )
  } else {
    return(null)
  }
}

export default AlbumCard