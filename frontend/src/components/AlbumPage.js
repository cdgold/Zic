import React, { useState, useEffect } from "react"
import { FormControl, TextField, Button } from "@mui/material"
import styled from "styled-components"
import albumService from "../services/album.js"
import albumRatingService from "../services/albumRating.js"
import songRatingService from "../services/songRating.js"
import auth0Service from "../services/auth0.js"
import { useNavigate } from "react-router-dom"
import dummyAlbum from "../test/dummyData.js"
import ReviewForm from "./AlbumReviewForm.js"
import { useAuth0 } from "@auth0/auth0-react"


const ALBUM_PAGE_DIV_COLUMN_1_PX = 420
const ALBUM_PAGE_DIV_COLUMN_2_PX = 350

const PageDiv = styled.div`
  width: 100vw;
  min-width: ${ALBUM_PAGE_DIV_COLUMN_1_PX + ALBUM_PAGE_DIV_COLUMN_2_PX}px;
  display: flex;
  justify-content: center;
`

const AlbumPageDiv = styled.div`
  display: grid;
  grid-template-columns: ${ALBUM_PAGE_DIV_COLUMN_1_PX}px ${ALBUM_PAGE_DIV_COLUMN_2_PX}px;
  grid-auto-rows: min-content 400px min-content;
  row-gap: 15px;
  margin: 0 auto;
`

const HeadlineDiv = styled.div`
  grid-column: 1 / span 2;
  grid-row: 1 / span 1;
  font-family: "Archivo";
  font-style: normal;
  font-weight: 700;
`

const AlbumTitleDiv = styled.div`
  font-size: 50px;
  color: ${props => props.theme.colors.primaryOne};
  -webkit-text-stroke-width: .25px;
  -webkit-text-stroke-color: black;

`

const AlbumTitleSublineDiv = styled.div`
  font-size: 35px;
  color: ${props => props.theme.colors.primaryOne};
  -webkit-text-stroke-width: .1px;
  -webkit-text-stroke-color: black;
`

const AlbumImg = styled.img`
  grid-column: 1;
  grid-row: 2;
  height: 400px; 
  width: 400px; 
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.15));
  border-radius: 5%;
`

const TracklistDiv = styled.div`
  grid-column: 2;
  grid-row: 2 / span 2;
  font-family: "Archivo", sans-serif;
`


const TracklistTitleDiv = styled.div`
font-weight: 700;
font-size: 35px;
color: ${props => props.theme.colors.primaryTwo};
-webkit-text-stroke-width: 0px;
-webkit-text-stroke-color: black;
`


const TracklistSubtitleTh = styled.th`
  font-weight: 700;
  text-align: left;
  font-size: 20px;
  color: black;
  -webkit-text-stroke-width: 0px;
  -webkit-text-stroke-color: black;
`

const TracklistTable = styled.table`
  grid-column: 2;
  grid-row: 2 / span 2;
  width: 100%;
  font-style: normal;
  border-spacing: 5px;
`

const TrackEntry = ({ track, trackRatings, handleTrackRatingChange }) => {

  // if user is null and they attempt to enter edit mode, redirect to login

  const [showTrackLength, setShowTrackLength] = useState("")

  useEffect(() => {
    const trackLengthInSeconds = parseInt(track.duration_ms) / 1000
    const trackMinutes = Math.floor(trackLengthInSeconds / 60)
    let leftoverSeconds = Math.floor(trackLengthInSeconds - (trackMinutes * 60))
    if(leftoverSeconds < 10){
      leftoverSeconds = `0${leftoverSeconds}`
    }
    setShowTrackLength(`${trackMinutes}:${leftoverSeconds}`)
  }, [track])
  
  return(
  <tr>
    <td>
      <span style={{color: "#d4d4d4"}}> {track.track_number} </span> {track.name}
    </td>
    <td>
      {showTrackLength}
    </td>
    <td>
    <TextField
          sx={{ width: "5em", textAlign: "center" }}
          value={trackRatings[track.id] || ""}
          type="number"
          onChange={event => handleTrackRatingChange({ trackID: track.id, value: event.target.value })}
          InputLabelProps={{
            shrink: true,
          }}
        />
    </td>
  </tr>
  )
}

const AlbumPage = ({ albumID, user }) => {

// move spotify shit to backend

  const { isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0()
  const [editMode, setEditMode] = useState(true)
  const [albumYear, setAlbumYear] = useState(null)
  const [album, setAlbum] = useState(null)
  const [userRating, setUserRating] = useState(null)
  const [trackRatings, setTrackRatings] = useState({})
  const [textReview, setTextReview] = useState("")
  const [numberRating, setNumberRating] = useState({value: "", error: ""})
  const [listened, setListened] = useState(false)
  const [listenList, setListenList] = useState(false)

  useEffect(() => {
    albumService.getSpotifyAlbum({ "id": albumID }) 
      .then(returnedAlbum => {
        setAlbum(returnedAlbum)
        console.log(returnedAlbum)
        if (typeof returnedAlbum.release_date !== "undefined"){
          setAlbumYear(returnedAlbum.release_date.slice(0, 4))
        }
      })
      .catch(error => 
        //navigate("/error/")
        setAlbum(dummyAlbum)
      )
  }, [])

  useEffect(() => {
    
    if(isAuthenticated && typeof user.sub !== "undefined"){
    albumRatingService.getRating({ "userID": user.sub, "albumID": albumID })
      .then(returnedRating => {
        console.log("Returned rating is: ", returnedRating)
        if (returnedRating !== null){
          setUserRating(returnedRating.album)
        }
        if (typeof returnedRating.tracks !== "undefined") {
          setTrackRatings(returnedRating.tracks)
        }
      })
      .catch(error => setUserRating(null))
    }
  }, [])

  const handleFormSubmit = async () => {
    const newRating = {
      "userID": user.sub, 
      "albumID": albumID,
      "review": {
        "rating": numberRating.value,
        "reviewText": textReview,
        "listenList": listenList,
        "listened": listened
      }
    }
    let token
    try { 
        token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`
        },
      })}
      catch (error) {
        token = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`
          },
        })
      }
      console.log("Token is: ", token)
    await albumRatingService.postRating({ "rating": newRating, "token": token, "albumID": albumID })
    setUserRating(newRating)
  }

  const handleTrackRatingSubmit = async () => {
    let token
    try { 
        token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`
        },
      })}
      catch (error) {
        token = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`
          },
        })
      }
    songRatingService.postMultiple({ "ratings": trackRatings, "token": token, "albumID": albumID })
  }

  const handleTrackRatingChange = ({ value, trackID }) => {
    const newTrackRatings = { ...trackRatings, [trackID]: value }
    setTrackRatings(newTrackRatings)
  }
  
  if(album === null){
    return(<div> Loading... </div>)
  }
  return(
    <PageDiv>
    <AlbumPageDiv>
      <HeadlineDiv>
          <AlbumTitleDiv> {album.name} </AlbumTitleDiv> 
          <AlbumTitleSublineDiv> by {album.artists[0].name} {`(${albumYear})`}</AlbumTitleSublineDiv>
      </HeadlineDiv>
      <AlbumImg src={album.images[0].url}  /> 
      <ReviewForm 
        textReview={textReview}
        setTextReview={setTextReview}
        numberRating={numberRating}
        setNumberRating={setNumberRating}
        listened={listened}
        setListened={setListened}
        listenList={listenList}
        setListenList={setListenList}
        userRating={userRating}
        handleFormSubmit={handleFormSubmit}
      />
      <TracklistDiv>
        <TracklistTitleDiv> TRACKLIST </TracklistTitleDiv>
        <TracklistTable>
        <thead>
        <tr>
        <TracklistSubtitleTh style={{ width: "55%" }}> Track title </TracklistSubtitleTh>
        <TracklistSubtitleTh style={{ width: "15%" }}> Len. </TracklistSubtitleTh>
        <TracklistSubtitleTh style={{ width: "30%" }}> Your Rating </TracklistSubtitleTh>
        </tr>
        </thead>
        <tbody>
        {album.tracks.total > 0 ? 
          album.tracks.items.map(item => 
          <TrackEntry key={item.uri} trackRatings={trackRatings} handleTrackRatingChange={handleTrackRatingChange} track={item} />)
          : <tr> No tracks to show... </tr>
        }
        { editMode ? 
          <tr>
            <td></td>
            <td colSpan="2">
              <Button 
              sx={{ color: "black", fontFamily: `"Archivo Black", "Archivo", sans-serif` }}
              onClick={() => handleTrackRatingSubmit()} > 
              Submit song ratings </Button>
            </td>
          </tr> 
          : null}
        </tbody>
        </TracklistTable>
        
      </TracklistDiv>
    </AlbumPageDiv>
    </PageDiv>
  )
}

export default AlbumPage