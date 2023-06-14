import React, { useState, useEffect, useMemo } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import albumRatingService from "../services/albumRating.js"
import spotifyService from "../services/spotify.js"
import albumService from "../services/album.js"
import followerService from "../services/follower.js"
import { Link, useLocation } from "react-router-dom"
//import userService from "../services/user.js"

const NUMBER_OF_ALBUMS_SHOWN = 4

const AlbumCard = ({ review, album }) => {
  return(
    <div>
      {review.rating}
      {album.name} by {album.artists[0].name}
    </div>
  )
}

// p

const Profile = ({ setUser, otherUser, otherUserID, personalAlbumReviews, setPersonalAlbumReviews, following, setFollowing }) => {
  // on first log in, make user set a UNIQUE(?) nickname
  // need to get following information
  // follow button should be unfollow if already following

  const { user, isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0()
  const [ albumReviews, setAlbumReviews ] = useState([])
  const [ mostRecentAlbums, setMostRecentAlbums ] = useState([])
  const [ albumInfo, setAlbumInfo ] = useState([])

  useEffect(() => {
    if(following.length === 0 && user !== undefined && user.sub !== undefined){
      followerService.getFollowing({ "userID": user.sub })
        .then((followingResponse) => {
          setFollowing(followingResponse)
        })
        .catch((error) => {
          setFollowing([])
        })
      
    }
  }, [user])

  useEffect(() => {     // fetches album ratings
    if(typeof personalAlbumReviews !== "undefined" && personalAlbumReviews.length === 0){
        if(isAuthenticated && otherUserID === null && typeof user.sub !== "undefined"){
          albumRatingService.getAllUserRatings({ "userID": user.sub })
            .then((reviews) => {
              setAlbumReviews(reviews)
              setPersonalAlbumReviews(reviews)
            })
            .catch((error) => { setAlbumReviews([]) })
      } else if (otherUserID !== null){
          albumRatingService.getAllUserRatings({ "userID": otherUserID })
            .then((reviews) => {
              setAlbumReviews(reviews)
            })
          .catch((error) => { setAlbumReviews([]) })
        }
      } else { // personal album ratings have already been fetched
        console.log("Didn't refetch")
        setAlbumReviews(personalAlbumReviews)
      }
  }, [user])
  
/*
  useEffect(() => {setAlbumReviews([
    {
        "rating": 9,
        "review_text": "First Tyler album where he said \"man what if i didn't scream with my friends about my daddy issues for an hour\"",
        "listen_list": false,
        "album_id": "2nkto6YNI4rUYTLqEwWJ3o",
        "auth0_id": "647a59e1fc60c55ea86431b0",
        "listened": true,
        "post_time": "2023-06-13T20:10:58.467Z"
    },
    {
        "rating": 90,
        "review_text": "Favorite concept album. Takes you through a breakup while having each song be a distinct feeling of that breakup.",
        "listen_list": false,
        "album_id": "5zi7WsKlIiUXv09tbGLKsE",
        "auth0_id": "647a59e1fc60c55ea86431b0",
        "listened": true,
        "post_time": "2023-06-13T22:19:30.291Z"
    }
])}, [])
*/

  useEffect(() => { // sorts album ratings by time posted, truncates
    if(typeof albumReviews !== "undefined" && albumReviews.length !== 0){
      let sortedAlbums = albumReviews.sort((a, b) => {
        const aDate = Date.parse(a.post_time)
        const bDate = Date.parse(b.post_time)
        return bDate - aDate
      })
      let sortedAlbumsShortened = sortedAlbums.slice(0, NUMBER_OF_ALBUMS_SHOWN)
      setMostRecentAlbums(sortedAlbumsShortened)
    }
  }, [albumReviews])

  useEffect(() => { // gets spotify info of album ratings
    if(typeof mostRecentAlbums !== "undefined" && mostRecentAlbums.length !== 0){
      const albumsToGet = mostRecentAlbums.reduce((allAlbumInfo, currentReview) => {
        allAlbumInfo.push(currentReview.album_id)
        return allAlbumInfo
      }, [])
      albumService.getMultipleSpotifyAlbums(albumsToGet)
        .then((response) => {
          setAlbumInfo(response.albums)
        })
        .catch((error) => {setAlbumInfo(null)})
    }
  }, [mostRecentAlbums])

  const handleFollow = async () => {
    if (isAuthenticated) {  
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
      try{
        await followerService.follow({ "userID": user.sub, "toFollowID": otherUser["userID"], "token": token })
        const newFollowing = [ ...following, otherUser["userID"] ]
        setFollowing(newFollowing)
      } catch(error){

      }
     }
  }

  const handleUnfollow = async () => {
    if (isAuthenticated) {  
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
      try {
        await followerService.unfollow({ "userID": user.sub, "toUnfollowID": otherUser["userID"], "token": token })
        let newFollowing = [ ...following ]
        delete newFollowing[newFollowing.indexOf(otherUser["userID"])]
        newFollowing.length = newFollowing.length - 1
        setFollowing(newFollowing)
      }
      catch (error) {

      }
     }
  }

  if (otherUserID !== null && (typeof otherUser === "undefined" || otherUser === null)) {
    return(
      <div>
        Invalid profile ID.
      </div>
    )
  }
  if (!isAuthenticated && (otherUserID === null || typeof otherUserID === "undefined")) {
    return (
    <div>
      Need to login to see your profile.
    </div>
    )
  }
  return(
    <div>
        Profile of {otherUserID === null ? user.nickname : otherUser.nickname}!
        { (otherUserID !== null && isAuthenticated) ? 
          <> {typeof (following.find(user => user.id === otherUserID)) === "undefined" ? 
               <button onClick={() => handleFollow()}> Follow </button> 
               : <button onClick={() => handleUnfollow()}> Unfollow </button>} 
          </>
          : null}
        <div> {otherUserID === null ? "Your" : "Their" } most recent reviews </div>
        {((typeof mostRecentAlbums !== "undefined" && mostRecentAlbums.length > 0) && (typeof albumInfo !== "undefined" && albumInfo.length > 0)) ? 
          <div> 
          {mostRecentAlbums.map((review) => {
            return(<AlbumCard review={review} album={albumInfo.find((album) => album.id === review.album_id)}/>)
          })}
          <Link to="/albumRatings/"> more reviews </Link>
          </div>
          : <div> No reviews. </div>}
    </div>
  )
}

export default Profile