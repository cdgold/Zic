import React, { useState, useEffect, useMemo } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import styled, { useTheme } from "styled-components"

import albumRatingService from "../services/albumRating.js"
import spotifyService from "../services/spotify.js"
import albumService from "../services/album.js"
import followerService from "../services/follower.js"
import userService from "../services/user.js"
import { Link, useLocation } from "react-router-dom"
import AlbumCard from "../styling/reusable/AlbumCard.js"
import ProfileModal from "./ProfileModal.js"

import { Button } from "@mui/material"

import dummySpotifyAlbums from "../test/dummySpotifyAlbums.js"

const NUMBER_OF_ALBUMS_SHOWN = 4
const MAX_REVIEW_TEXT_CHARACTERS  = 50
const SHRINK_TEXT_THRESHOLD = 650

const PageDiv = styled.div`
  margin-top: 1.5rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
`

const AlbumRow = styled.div`
  width: 100vw;
  min-width: 12rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const AlbumRowItem = styled.div`
  min-width: 10rem;
  width: 20vw;
`

const Header = styled.div`
  font-family: ${props => props.theme.titleFonts};
  font-size: ${props => props.fontSize};
`

const NameHeader = styled(Header)`
display: grid;
grid-template-columns: minmax(35px, 150px) auto;
grid-template-rows: min-content min-content;
word-break: break-word;
column-gap: 1rem;
`

const ButtonStyling = {
  
}


const MoreReviewsButton = () => {
  const theme = useTheme()

  return(
    <Link style={{ alignSelf: "center" }} to="/albumRatings/">
      <Button sx={{ color: "black", fontFamily: theme.titleFonts }}>
        more reviews 
      </Button>
    </Link>
  )
}

const Profile = ({ otherUser, 
  setOtherUser, 
  otherUserID, 
  user,
  setUser,
  personalAlbumReviews, 
  setPersonalAlbumReviews, 
  following, 
  setFollowing,
  viewWidth
 }) => {
  // on first log in, make user set a UNIQUE(?) nickname


  const theme = useTheme()

  const { isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0()
  const [ albumReviews, setAlbumReviews ] = useState([])
  const [ mostRecentAlbums, setMostRecentAlbums ] = useState([])
  const [ favoriteAlbums, setFavoriteAlbums ] = useState([])
  const [ albumInfo, setAlbumInfo ] = useState([])
  const [ modalIsOpen, setModalIsOpen ] = useState(false)
  const [ headerSize, setHeaderSize ] = useState(`${theme.fonts.sizes.titleLarge}`)

  //console.log("personalAlbumReviews is: ", personalAlbumReviews)
  //console.log("otherUserID is: ", otherUserID)

  const fetchAlbumInfo = async ({ albumsToFetch }) => {
    const albumsToGet = albumsToFetch.reduce((allAlbumInfo, currentReview) => {
      allAlbumInfo.push(currentReview.album_id)
      return allAlbumInfo
    }, [])
    const infoToReturn = await albumService.getMultipleSpotifyAlbums(albumsToGet)
    return infoToReturn
  }

useEffect(() => {
  if(viewWidth < SHRINK_TEXT_THRESHOLD){
    setHeaderSize(`2.2rem`)
  }
  if(viewWidth > SHRINK_TEXT_THRESHOLD){
    setHeaderSize(`${theme.fonts.sizes.titleLarge}`)
  }
}, [viewWidth])

//console.log("header size is: ", headerSize)
//console.log("view width is: ", viewWidth)
console.log("Favorite albums is: ", favoriteAlbums)
console.log("albuminfo is: ", albumInfo)

useEffect(() => {     // fetches album ratings
  if (otherUserID !== null){
    console.log("fetching allUserRatings for: ", otherUserID)
    albumRatingService.getAllUserRatings({ "userID": otherUserID })
      .then((reviews) => {
        setAlbumReviews(reviews)
      })
    .catch((error) => { setAlbumReviews([]) })
  }
  else if(otherUserID === null && user !== null && typeof user !== undefined && typeof user.sub !== undefined){
      if(typeof personalAlbumReviews !== "undefined" && personalAlbumReviews.length > 0){
        console.log("Didn't refetch")
        const newPersonalAlbumReviews = [ ...personalAlbumReviews ]
        setAlbumReviews(newPersonalAlbumReviews)
       }
      else { // personal album ratings have not been fetched and stored yet
        albumRatingService.getAllUserRatings({ "userID": user.userID })
        .then((reviews) => {
          setAlbumReviews(reviews)
          setPersonalAlbumReviews(reviews)
        })
        .catch((error) => { setAlbumReviews([]) })
    }
  }}, [user, otherUserID])
  
  useEffect(() => {
    if(following === null && user !== null && user.sub !== undefined){
      followerService.getFollowing({ "userID": user.sub })
        .then((followingResponse) => {
          setFollowing(followingResponse)
        })
        .catch((error) => {
          setFollowing([])
        })
    }
  }, [user])

  useEffect(() => {     // fetches otherUser if not already there
    if (otherUserID !== null) { 
      if ((otherUser === null) || (typeof otherUser !== "undefined" && typeof otherUser.id !== "undefined" && otherUserID !== otherUser.id)){
        otherUser = userService.getUserProfile({ "userID": otherUserID })
          .then((response) => {
            setOtherUser(response)
          })
      }
    }
  }, [otherUserID])
 
  useEffect(() => { // gets spotify info of most recent/ favorite ratings
    if((Array.isArray(mostRecentAlbums) && mostRecentAlbums.length !== 0) ||
    (Array.isArray(favoriteAlbums) && favoriteAlbums.length !== 0)){
      let albumsToGet = mostRecentAlbums.reduce((allAlbumInfo, currentReview) => {
        allAlbumInfo.push(currentReview.album_id)
        return allAlbumInfo
      }, [])
      albumsToGet = favoriteAlbums.reduce((allAlbumInfo, currentReview) => {
        if (!(allAlbumInfo.includes(currentReview.album_id))){
          allAlbumInfo.push(currentReview.album_id)
        }
        return allAlbumInfo
      }, albumsToGet)
      albumService.getMultipleSpotifyAlbums(albumsToGet)
        .then((response) => {
          const newAlbumInfo = response.albums
          setAlbumInfo(newAlbumInfo)
        })
        .catch((error) => {})
    }
  }, [mostRecentAlbums, favoriteAlbums])

useEffect(() => { // sorts album ratings by time posted, truncates
  if(typeof albumReviews !== "undefined" && albumReviews.length !== 0){
    let sortedAlbums = albumReviews.sort((a, b) => {
      const aDate = Date.parse(a.post_time)
      const bDate = Date.parse(b.post_time)
      return bDate - aDate
    })
    let sortedAlbumsShortened = sortedAlbums.slice(0, NUMBER_OF_ALBUMS_SHOWN)
    setMostRecentAlbums(sortedAlbumsShortened)
    let bestAlbums = albumReviews.sort((a, b) => {
      return b.rating - a.rating
    })
    let bestAlbumsShortened = bestAlbums.slice(0, NUMBER_OF_ALBUMS_SHOWN)
    setFavoriteAlbums(bestAlbumsShortened)
  }
}, [albumReviews])

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
        const newFollowing = [ ...following, {
          "userID": otherUser["userID"],
          "nickname": otherUser["nickname"],
          "picture": otherUser["picture"]
        } ]
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
  if (user === null) {
    return (
    <div>
      Loading...
    </div>
    )
  }
  return(
    <PageDiv>
      <div style={{ display: "flex", columnGap: "1rem" }}>
        <NameHeader fontSize={headerSize}> 
          <img 
            src={otherUserID === null ? user.picture : otherUser.picture}
            style={{ borderRadius: "50%", gridColumn: 1, gridRow: "1 / span 2", width: "100%" }}
            alt={"Profile picture"}
          />
          <div style={{ gridRow: 1, gridColumn: 2 }}>
            {otherUserID === null ? user.nickname : otherUser.nickname} 
          </div>
          <div style={{ gridRow: 2, gridColumn: 2 }}>
          {otherUserID === null ? 
          <Button 
            sx = {{
              color: "black",
              fontFamily: theme.titleFonts,
              alignSelf: "center",
              borderColor: "black"
            }}
            variant= "outlined"
            onClick={(() => {setModalIsOpen(true)})} > edit profile 
          </Button> 
          : null}
          </div>
        </NameHeader >
      </div>
      <ProfileModal user={user} isOpen={modalIsOpen} setIsOpen={(setModalIsOpen)} ></ProfileModal>
      { (otherUserID !== null && isAuthenticated) ? 
        <> {(Array.isArray(following) && typeof (following.find(user => user.userID === otherUserID)) === "undefined") ? 
              <button onClick={() => handleFollow()}> Follow </button> 
              : <button onClick={() => handleUnfollow()}> Unfollow </button>} 
        </>
        : null}
      <Header fontSize={`${theme.fonts.sizes.titleTiny}`} > {otherUserID === null ? "Your" : "Their" } favorite albums </Header>
        {((typeof favoriteAlbums !== "undefined" && favoriteAlbums.length > 0) && (typeof albumInfo !== "undefined" && albumInfo.length > 0)) ? 
          <AlbumRow> 
          {favoriteAlbums.map((review) => {
          return(
            <AlbumRowItem key={review.album_id}> 
              <AlbumCard review={review} allAlbumInfo={albumInfo} maxChar={MAX_REVIEW_TEXT_CHARACTERS} />
            </AlbumRowItem>)})}
            <MoreReviewsButton />
          </AlbumRow>
        : <div> {`No reviews. ${otherUserID === null ? "You " : "They "} should add more using the search bar above!`} </div>}
      <Header fontSize={`${theme.fonts.sizes.titleTiny}`} > {otherUserID === null ? "Your" : "Their" } most recent reviews </Header>
      {((typeof mostRecentAlbums !== "undefined" && mostRecentAlbums.length > 0) && (typeof albumInfo !== "undefined" && albumInfo.length > 0)) ? 
        <AlbumRow> 
        {mostRecentAlbums.map((review) => {
          return(
            <AlbumRowItem key={review.album_id}> 
              <AlbumCard  review={review} allAlbumInfo={albumInfo} maxChar={MAX_REVIEW_TEXT_CHARACTERS} />
            </AlbumRowItem>)
        })}
          <MoreReviewsButton />
        </AlbumRow>
        : <div> {`No reviews. ${otherUserID === null ? "You " : "They "} should add more using the search bar above!`} </div>}
    </PageDiv>
  )
}

export default Profile