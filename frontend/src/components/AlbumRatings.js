import React, { useState, useEffect } from "react"
import { Select, MenuItem } from "@mui/material"
import { useAuth0 } from "@auth0/auth0-react"
import albumRatingService from "../services/albumRating.js"
import albumService from "../services/album.js"
import spotifyService from "../services/spotify.js"
import AlbumCard from "../styling/reusable/AlbumCard.js"
import { useLocation } from "react-router-dom"
import styled from "styled-components"

//import dummySpotifyAlbums from "../test/dummySpotifyAlbums.js"

const NUMBER_OF_ALBUMS_PER_PAGE = 20
const MAX_TEXT_LENGTH = 120

// can sort by ratingDescending, mostRecent

const PageDiv = styled.div`
  width: 95vw;
  margin-left: max(1rem, 2.5vw);
  margin-right: max(1rem, 2.5vw);
  font-family: ${props => props.theme.bodyFonts}
`

const AlbumRows = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-evenly;
  margin-top: 2rem;
`

const AlbumRowItem = styled.div`
  width: 22%;
  min-width: 8rem;
`

const Title = styled.div`
  font-size: ${props => props.theme.fonts.sizes.titleSmall};
  color: black;
  font-family: ${props => props.theme.titleFonts};
`

const AlbumRatings = ({ personalAlbumReviews, setPersonalAlbumReviews, otherUserID, user }) => {

  const { isAuthenticated } = useAuth0()
  const [ albumReviews, setAlbumReviews ] = useState([])
  const [ sortedAlbums, setSortedAlbums ] = useState([])
  const [ albumInfo, setAlbumInfo ] = useState([])
  const [ sortBy, setSortBy ] = useState("ratingDescending")
  const [ spotifyCode, setSpotifyCode ] = useState(null)
  //const [ spotifyTokenReady, setSpotifyTokenReady ] = useState(false)

  let location = useLocation()
  console.log("sorted albums is IS: ", sortedAlbums)
  console.log("sortBy is: ", sortBy)

  useEffect(() => {
    if (typeof location.search !== "undefined"){
      const urlSearchParams = new URLSearchParams(location.search)
      let code = urlSearchParams.get("code")
      if (code !== null){
        setSpotifyCode(code)
      }
    }
  }, [location])

  useEffect(() => {
    if (spotifyCode !== null){
      spotifyService.getAndSetTokenWithCode({ "code": spotifyCode })
        .then(token => {
          console.log("got token, it's: ", token)
          setSpotifyCode(null)
          //setSpotifyTokenReady(true)
        })
    }
  }, [spotifyCode])


  useEffect(() => {
    if(typeof personalAlbumReviews !== "undefined" && personalAlbumReviews.length === 0){
      if(user !== null && otherUserID === null && typeof user !== "undefined" && typeof user.userID !== "undefined"){
        albumRatingService.getAllUserRatings({ "userID": user.userID })
          .then((reviews) => {
            setAlbumReviews(reviews)
            setPersonalAlbumReviews(reviews)
          })
          .catch(() => { setAlbumReviews([]) })
      } /*else if (otherUserID !== null){
            albumRatingService.getAllUserRatings({ "userID": otherUserID })
              .then((reviews) => {
                setAlbumReviews(reviews)
              })
            .catch((error) => { setAlbumReviews([]) })
          }
          */
    } else { // personal album ratings have already been fetched by other page
      console.log("Didn't refetch")
      const newPersonalAlbumReviews = [...personalAlbumReviews]
      setAlbumReviews(newPersonalAlbumReviews)
    }
  }, [user])

  useEffect(() => {
    if(typeof sortedAlbums !== "undefined" && sortedAlbums.length !== 0){
      const albumsToGet = sortedAlbums.reduce((allAlbumInfo, currentReview) => {
        if(typeof (albumInfo.find(info => info.id === currentReview.album_id)) === "undefined"){
          allAlbumInfo.push(currentReview.album_id)
        }
        return allAlbumInfo
      }, [])
      console.log("Getting album info for: ", albumsToGet)
      if (albumsToGet.length !== 0){
        albumService.getMultipleSpotifyAlbums(albumsToGet)
          .then(response => {setAlbumInfo(response.albums)})
          .catch(() => setAlbumInfo([]))
      }
    }
  }, [sortedAlbums])

  useEffect(() => {
    console.log("entered")
    console.log("albumReviews.length is: ", albumReviews.length)
    console.log("albumReviews is: ", albumReviews)
    if(Array.isArray(albumReviews) && albumReviews.length !== 0){
      console.log("entered2")
      let sortedAlbums
      if (sortBy === "mostRecent") {
        console.log("sorting by most recent")
        sortedAlbums = albumReviews.sort((a, b) => {
          const aDate = Date.parse(a.post_time)
          const bDate = Date.parse(b.post_time)
          return bDate - aDate
        })
      } else if (sortBy === "ratingDescending") {
        sortedAlbums = albumReviews.sort((a, b) => {
          return b.rating - a.rating
        })
      } else {
        console.log("not sorted")
        sortedAlbums = albumReviews
      }
      let sortedAlbumsShortened = sortedAlbums.slice(0, NUMBER_OF_ALBUMS_PER_PAGE)
      console.log("Sorted albums are now: ", sortedAlbumsShortened)
      setSortedAlbums(sortedAlbumsShortened)
    }
  }, [albumReviews, sortBy])

  if (otherUserID !== null /*&& (typeof otherUser === "undefined" || otherUser === null)*/) {
    return(
      <div>
          Invalid profile ID.
      </div>
    )
  }
  if (!isAuthenticated && (otherUserID === null || typeof otherUserID === "undefined")) {
    return (
      <div>em
        Need to login to see your album reviews.
      </div>
    )
  }
  return(
    <PageDiv>
      {/* spotifyTokenReady ?
            <button onClick={() => spotifyService.getMostPlayed()}> Get your most listened artists! </button>
            : <button onClick={() => spotifyService.getUserAuthorization()}> Authorize spotify! </button>
          */}
      <Title>
        {otherUserID === null ? user.nickname : "other user nickname here"}{`'s album ratings`}
      </Title>
      {(sortedAlbums.length > 0) && (albumInfo.length > 0) ?
        <div>
            sort by:
          <Select
            value={sortBy}
            onChange={event => setSortBy(event.target.value)}
            inputProps={{ "aria-label": "Sort by" }}
            sx={{ color: "black" }}
            size="small"
          >
            <MenuItem value={"ratingDescending"}> {`Rating (high to low)`}</MenuItem>
            <MenuItem value={"mostRecent"}> {`Post time (most recent first)`}</MenuItem>
          </Select>
          <AlbumRows>
            {sortedAlbums.map((review) => {
              return(
                <AlbumRowItem key={review.album_id}>
                  <AlbumCard review={review} allAlbumInfo={albumInfo} maxChar={MAX_TEXT_LENGTH} isSoftMax={true} />
                </AlbumRowItem>
              )
            })}
          </AlbumRows>
        </div>
        : <div> No reviews. </div>}
    </PageDiv>
  )
}

export default AlbumRatings