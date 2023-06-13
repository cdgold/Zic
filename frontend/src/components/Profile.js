import React, { useState, useEffect, useMemo } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import albumRatingService from "../services/albumRating.js"
import spotifyService from "../services/spotify.js"
import followerService from "../services/follower.js"
//import userService from "../services/user.js"

const NUMBER_OF_ALBUMS_SHOWN = 4

const AlbumCard = ({ review, album }) => {
  return(
    <div>
      {review.rating}
      {album.title}
    </div>
  )
}

// p

const Profile = ({ otherUser, otherUserID }) => {
  // on first log in, make user set a UNIQUE(?) nickname

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [ token, setToken ] = useState(null)
  const [ albumReviews, setAlbumReviews ] = useState([])
  const [ mostRecentAlbums, setMostRecentAlbums ] = useState([])
  const [ albumInfo, setAlbumInfo ] = useState([])

  console.log(otherUser)

  useEffect(() => {
    if(isAuthenticated && otherUserID === null && typeof user.sub !== "undefined"){
      albumRatingService.getAllUserRatings({ "userID": user.sub })
        .then((reviews) => {
          setAlbumReviews(reviews)
        })
        .catch((error) => { setAlbumReviews([]) })
  } else if (otherUserID !== null){
      albumRatingService.getAllUserRatings({ "userID": otherUserID })
        .then((reviews) => {
          setAlbumReviews(reviews)
        })
      .catch((error) => { setAlbumReviews([]) })
    }
  }, [user])

  useEffect(() => {
    if(typeof albumReviews !== "undefined" && albumReviews.length !== 0){
      const albumsToGet = albumReviews.reduce((allAlbumInfo, currentReview) => {
        allAlbumInfo.push(currentReview.album_id)
      }, [])
      const gotAlbums = spotifyService.getMultipleSpotifyAlbums(albumsToGet)
      setAlbumInfo(gotAlbums)
    }
  }, [albumReviews])

  useEffect(() => {
    if(typeof albumReviews !== "undefined" && albumReviews.length !== 0){
      const sortedAlbums = albumReviews.sort((a, b) => a.post_time > b.post_time)
      const sortedAlbumsShortened = sortedAlbums.slice(0, NUMBER_OF_ALBUMS_SHOWN)
      setMostRecentAlbums(sortedAlbumsShortened)
    }
  }, [albumReviews])

  const handleFollow = async () => {
    if (isAuthenticated) {  
      /*
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`
        },
      })
      */
      await followerService.follow({ "userID": user.sub, "toFollowID": otherUserID, "token": token })
  }
  }

  if (otherUserID !== null && (typeof otherUser === "undefined" || otherUser === null)) {
    return(
      <div>
        Invalid profile ID.
      </div>
    )
  }
  if (!isAuthenticated && otherUserID == null) {
    return (
    <div>
      Need to login to see your profile.
    </div>
    )
  }
  return(
    <div>
        Profile of {otherUserID === null ? user.nickname : otherUser.nickname}!
        {(otherUserID !== null && isAuthenticated) ? 
          <button onClick={() => handleFollow()}> Follow </button> 
          : null}
        <div> {otherUserID === null ? "Your" : "Their" } most recent reviews </div>
        {(typeof mostRecentAlbums !== "undefined" && mostRecentAlbums.length > 0) ? 
          mostRecentAlbums.map((review) => {
            return(<AlbumCard review={review} album={albumInfo.find((album) => album.id === review.album_id)}/>)
          }, [albumReviews]) 
          : <div> No reviews. </div>}
    </div>
  )
}

export default Profile