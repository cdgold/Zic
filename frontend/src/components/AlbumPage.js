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
import Tracklist from "./Tracklist.js"
import { useAuth0 } from "@auth0/auth0-react"

const MOBILE_VIEW_THRESHOLD = 650;

const dummyReview = {
  "album": {
    "rating": 90,
    "review_text": "Favorite concept album. Takes you through a breakup while having each song be a distinct feeling of that breakup.",
    "listen_list": false,
    "album_id": "5zi7WsKlIiUXv09tbGLKsE",
    "auth0_id": "647a59e1fc60c55ea86431b0",
    "listened": true,
    "post_time": "2023-06-13T22:19:30.291Z"
  },
  "tracks": [
    {
      "song_id": "1hz7SRTGUNAtIQ46qiNv2p",
      "rating": 99
    },
    {
      "song_id": "5A0M6B0RBSXSNWv0wcppZ9",
      "rating": 70
    }
  ]
}

const ALBUM_PAGE_DIV_COLUMN_1_REM = 30
const ALBUM_PAGE_DIV_COLUMN_2_REM = 30

const PageDiv = styled.div`
  margin-top: 1.5rem;
  margin-left: .5rem;
  width: 95vw;
  display: flex;
  justify-content: center;
`

const AlbumPageDiv = styled.div`
  display: grid;
  grid-template-columns: 45% 45%;
  grid-template-rows: min-content min-content 1fr;
  justify-content: center;
  row-gap: 1rem;
  column-gap: 1.5rem;
  margin: 0 auto;
`

const MobilePageDiv = styled(AlbumPageDiv)`
  grid-template-columns: 100%;
`

const HeadlineDiv = styled.div`
  grid-column: 1 / span 2;
  grid-row: 1 / span 1;
  font-family: "Archivo";
  font-style: normal;
  font-weight: 700;
`

const AlbumTitleDiv = styled.div`
  font-size: ${props => props.theme.fonts.sizes.titleMedium};
  color: ${props => props.theme.colors.primaryOne};
  -webkit-text-stroke-width: .25px;
  -webkit-text-stroke-color: black;

`

const AlbumTitleSublineDiv = styled.div`
  font-size: ${props => props.theme.fonts.sizes.titleSmall};
  color: ${props => props.theme.colors.primaryOne};
`

const AlbumImg = styled.img`
  grid-column: 1fr;
  grid-row: auto auto auto auto;
  width: 60%; 
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.15));
  border-radius: 5%;
  justify-self: center;
`

const ErrorText = styled.span`
  color: ${props => props.theme.colors.error};
`


const AlbumPage = ({ albumID, viewWidth }) => {

  const { isAuthenticated, user, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0()
  const [editMode, setEditMode] = useState(false)
  const [albumYear, setAlbumYear] = useState(null)
  const [album, setAlbum] = useState(null)
  const [userRating, setUserRating] = useState(null)
  const [trackRatings, setTrackRatings] = useState({ error: "" })
  const [textReview, setTextReview] = useState("")
  const [numberRating, setNumberRating] = useState({value: "", error: ""})
  const [listened, setListened] = useState(false)
  const [listenList, setListenList] = useState(false)
  const [originalRating , setOriginalRating] = useState(null)

  console.log("trackRatings is: ", trackRatings)

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
    
    if(isAuthenticated && typeof user !== "undefined" && typeof user.sub !== "undefined"){
    albumRatingService.getRating({ "userID": user.sub, "albumID": albumID })
      .then(returnedRating => {
        console.log("Returned rating is: ", returnedRating)
        if (returnedRating !== null){
          setUserRating(returnedRating.album)
        } else {
          setUserRating({})
        }
        if (typeof returnedRating.tracks !== "undefined") {
          let initialTrackRatings = returnedRating.tracks.reduce((allTracks, current) => {
            allTracks[current.song_id] = current.rating 
            return allTracks
          }, {})
          initialTrackRatings["error"] = ""
          setTrackRatings(initialTrackRatings)
        } else {
          let initialTrackRatings= { "error": "" }
          setTrackRatings(initialTrackRatings)
        }
      })
      .catch(error => { 
        setUserRating({})
        /*setUserRating(dummyReview.album); 
        
        const initialTrackRatings = dummyReview.tracks.reduce((allTracks, current) => {
          allTracks[current.song_id] = current.rating 
          console.log("All tracks is now: ", allTracks)
          return allTracks
        }, {})
        initialTrackRatings["error"] = ""
        */
        setTrackRatings({ "error": "" })})
    }
  }, [user])

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
    console.log("Submitting")
    let error = ""
    Object.keys(trackRatings).forEach(function(trackID, number) {
      if(isNaN(trackRatings[trackID]) || trackRatings[trackID] > 10.0 || trackRatings[trackID] < 0.0){
          error = "Song ratings must be between 0.0 and 10.0."
      }})
    console.log("Error is: ", error)
    if (error === ""){
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
    else {
      const newTrackRatings = { ...trackRatings, "error": error }
      setTrackRatings(newTrackRatings)
    }
  }

  const handleTrackRatingChange = ({ value, trackID }) => {
    const newTrackRatings = { ...trackRatings, [trackID]: value }
    setTrackRatings(newTrackRatings)
  }

  useEffect(() => {
    if (editMode === true){
      const gottenRating = { ...userRating, "tracks": trackRatings }
      setOriginalRating(gottenRating)
    } else {
      if (originalRating !== null){
        if (typeof originalRating.rating !== "undefined"){
          const prevRating = {
            "value": originalRating.rating,
            "error": ""
          }
          setNumberRating(prevRating)
        }
        if (typeof originalRating.review_text !== "undefined"){
          const prevReviewText = `${originalRating.review_text}`
          setTextReview(prevReviewText)
        }
        if (typeof originalRating.listened !== "undefined"){
          const prevListened = Boolean(originalRating.listened)
          setListened(prevListened)
        }
        if (typeof originalRating.listen_list !== "undefined"){
          const prevListenList = Boolean(originalRating.listen_list)
          setListenList(prevListenList)
        }
        if (typeof originalRating.tracks !== "undefined"){
          const prevTrackRatings = { ...originalRating.tracks }
          setTrackRatings(prevTrackRatings)
        }
      }
    }
  }, [editMode])
  
  if(album === null){
    return(<div> Loading... </div>)
  }
  if(viewWidth > MOBILE_VIEW_THRESHOLD){
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
            editMode={editMode}
            setEditMode={setEditMode}
          />
            <Tracklist 
              editMode={editMode} 
              trackRatings={trackRatings} 
              handleTrackRatingChange={handleTrackRatingChange} 
              handleTrackRatingSubmit={handleTrackRatingSubmit}
              setEditMode={setEditMode}
              album={album}
            />
        </AlbumPageDiv>
      </PageDiv>
    )
  }
  return (
    <PageDiv>
      <MobilePageDiv>
      <HeadlineDiv>
          <AlbumTitleDiv> {album.name} </AlbumTitleDiv> 
          <AlbumTitleSublineDiv> by {album.artists[0].name} {`(${albumYear})`}</AlbumTitleSublineDiv>
          </HeadlineDiv>
          <AlbumImg src={album.images[0].url}  /> 
          <span style={{ gridColumn: 1, gridRow: 3 }}>
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
              editMode={editMode}
              setEditMode={setEditMode}
            />
          </span>
          <span style={{ gridColumn: 1, gridRow: 4 }}>
            <Tracklist 
              editMode={editMode} 
              trackRatings={trackRatings} 
              handleTrackRatingChange={handleTrackRatingChange} 
              handleTrackRatingSubmit={handleTrackRatingSubmit}
              setEditMode={setEditMode}
              album={album}
            />
          </span>
      </MobilePageDiv>
    </PageDiv>
  )
}

export default AlbumPage