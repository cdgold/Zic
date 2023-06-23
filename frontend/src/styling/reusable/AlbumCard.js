import React, { useEffect, useState } from "react"
import styled, { useTheme } from "styled-components"
import { Link } from "react-router-dom"

const HIGH_THRESHOLD = 8.5
const MEDIUM_HIGH_THRESHOLD = 6.5
const MEDIUM_LOW_THRESHOLD = 3.5
const LOW_THRESHOLD = 1.5


const AlbumCardStyled = styled.div`
  width: 100%;
  font-family: ${props => props.theme.bodyFonts};
  font-size: ${props => props.theme.fonts.sizes.bodyMedium};
`

const AlbumText = styled.div`
  text-align: center;
  overflow-wrap: break-word;
`

const AlbumImg = styled.img`
  width: 60%;
  min-width: 10rem;
`

// softMax determines if review_text can be expanded or not
const AlbumCard = ({ review, allAlbumInfo, maxChar, isSoftMax }) => {
  const theme = useTheme()

  const [album, setAlbum] = useState(null)
  const [shortenedString, setShortenedString] = useState(null)
  const [hideOnReveal, setHideOnReveal] = useState("")
  const [showOnReveal, setShowOnReveal] = useState("none")
  const [fontColor, setFontColor] = useState("#000000")

  const handleShow = () => {
    setHideOnReveal("none")
    setShowOnReveal("")
  } 

  const handleHide = () => {
    setHideOnReveal("")
    setShowOnReveal("none")
  } 

  useEffect(() => {
    if (typeof review.rating !== "undefined" && review.rating !== "" && !(isNaN(review.rating))){
      if (review.rating > HIGH_THRESHOLD){
        setFontColor(theme.colors.primaryTwo)
      }
      else if (review.rating > MEDIUM_HIGH_THRESHOLD){
        setFontColor(theme.colors.secondaryTwo)
      }
      else if (review.rating < LOW_THRESHOLD){
        setFontColor(theme.colors.primaryOne)
      }
      else if (review.rating < MEDIUM_LOW_THRESHOLD){
        setFontColor(theme.colors.secondaryOne)
      }
    }
  }, [])

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
        <AlbumText style={{ marginTop: ".5rem", fontSize: theme.fonts.sizes.bodyLarge }}> 
          <b>{album.name}</b> 
          <br></br> 
          {album.artists[0].name} 
        </AlbumText>
        <AlbumText style={{ color: fontColor, fontFamily: theme.titleFonts, fontSize: theme.fonts.sizes.titleTiny }}> {review.rating} </AlbumText> 
        <AlbumText style={{ textAlign: "center", display: hideOnReveal }}>  
          {shortenedString ? shortenedString : review.review_text} 
        </AlbumText>
        { isSoftMax && shortenedString !== null ? 
          <button style={{ display: hideOnReveal }} onClick={() => handleShow()} >expand</button> 
          : null 
        }
        <AlbumText style={{ textAlign: "justify", display: showOnReveal }}>  {review.review_text} </AlbumText>
        <button style={{ display: showOnReveal, alignText: "right" }} onClick={() => handleHide()} >collapse</button>
      </AlbumCardStyled>

  )
  } else {
    return(null)
  }
}

export default AlbumCard