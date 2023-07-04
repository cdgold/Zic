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

const TracklistDiv = styled.div`
  grid-column: 2;
  grid-row: 2 / span 2;
  font-family: "Archivo", sans-serif;
  border-spacing: 0 .5rem;
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
  text-align: left;
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

const StaticTrackRatingSpan = styled.span`

  &:hover {
    cursor: pointer;
  }

`

const ErrorText = styled.span`
  color: ${props => props.theme.colors.error};
`


const TrackEntry = ({ track,
  trackRatings,
  handleTrackRatingChange,
  editMode,
  setEditMode
}) => {

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
        <span style={{ color: "#d4d4d4" }}> {track.track_number} </span> {track.name}
      </td>
      <td>
        {showTrackLength}
      </td>
      {/*
      <td style={{ textAlign: "center" }}>
      { editMode
        ? <TextField
            sx={{ width: "4em", textAlign: "center" }}
            value={trackRatings[track.id] || ""}
            size="small"
            onChange={event => handleTrackRatingChange({ trackID: track.id, value: event.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        : <StaticTrackRatingSpan onClick={() => setEditMode(!editMode)}>
            { trackRatings[track.id] ? `${trackRatings[track.id]}` : "-"}
          </StaticTrackRatingSpan>
      }
      </td>
    */}
    </tr>
  )
}

const Tracklist = ({ editMode,
  trackRatings,
  handleTrackRatingChange,
  setEditMode,
  album,
  handleTrackRatingSubmit }) => {
  return(
    <TracklistDiv>
      <TracklistTitleDiv> TRACKLIST </TracklistTitleDiv>
      <TracklistTable>
        <thead>
          <tr>
            <TracklistSubtitleTh style={{ width: "55%" }}> Track title </TracklistSubtitleTh>
            <TracklistSubtitleTh style={{ width: "15%" }}> Len. </TracklistSubtitleTh>
            {/*<TracklistSubtitleTh style={{ width: "30%" }}> Your Rating </TracklistSubtitleTh>*/}
          </tr>
        </thead>
        <tbody>
          {album.tracks.total > 0 ?
            album.tracks.items.map(item =>
              <TrackEntry
                key={item.uri}
                editMode={editMode}
                trackRatings={trackRatings}
                handleTrackRatingChange={handleTrackRatingChange}
                track={item}
                setEditMode={setEditMode}
              />)
            : <tr> No tracks to show... </tr>
          }
          { /*editMode ?
          <tr>
              <td>
              {(trackRatings.error !== "") ? <ErrorText> {trackRatings.error} </ErrorText> : null}
              </td>
              <td colSpan="2">
              <Button
              sx={{ color: "black", fontFamily: `"Archivo Black", "Archivo", sans-serif` }}
              onClick={() => handleTrackRatingSubmit()} >
              Submit song ratings </Button>
              </td>
          </tr>
        : null*/}
        </tbody>
      </TracklistTable>
    </TracklistDiv>
  )}

export default Tracklist