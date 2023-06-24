import "./App.css"
import React, { useState, useEffect } from "react"
import albumService from "./services/album.js"
import userService from "./services/user.js"
import AlbumPage from "./components/AlbumPage.js"
import AlbumRatings from "./components/AlbumRatings.js"
import Home from "./components/Home.js"
import Profile from "./components/Profile.js"
import Header from "./components/Header.js"
import SearchResults from "./components/SearchResults.js"
import {SuccessNotification, ErrorNotification} from "./styling/reusable/Notification.js"
import {
  Routes, Route, useMatch, useNavigate
} from "react-router-dom"
import styled from "styled-components"
import { useAuth0 } from "@auth0/auth0-react"


// https://coolors.co/0015ff-000000-f02f2f-001667-840012

const RoutesDiv = styled.div`
  position: absolute;
  top: ${props => props.theme.headerMargin};
  width: 100vw;
`

function App() {
  const navigate = useNavigate()

  const [musicSearchText, setMusicSearchText] = useState("")
  const [searchResponse, setSearchResponse] = useState([])
  const [otherUser, setOtherUser] = useState(null)  // used for viewing profiles found from search
  const [personalAlbumReviews, setPersonalAlbumReviews] = useState([])
  const [following, setFollowing] = useState(null)  // array of users being followed
  const [viewWidth, setViewWidth] = useState(window.innerWidth)
  const [successNotification, setSuccessNotification] = useState("")
  const [errorNotification, setErrorNotification] = useState("")
  //const [album, setAlbum] = useState(dummyAlbum)

  const handleSuccessChange = ({ notification, timeInSec = 5 }) => {
    setSuccessNotification(`${notification}`)
    setTimeout(() => setSuccessNotification(""), timeInSec * 1000)
  }

  const handleErrorChange = ({ notification, timeInSec = 5 }) => {
    console.log("handling error with notification: ", notification, "and time in sec:", timeInSec)
    setErrorNotification(`${notification}`)
    setTimeout(() => setErrorNotification(""), timeInSec * 1000)
  }

  useEffect(() => {
    window.addEventListener("resize", () => setViewWidth(window.innerWidth))
  }, [])

  const musicSearchRequest = async () => {
    let albumResponse, userResponse
    try {
      [albumResponse, userResponse] = await Promise.all([
      albumService.searchSpotify({ query: musicSearchText, type: "album" }),
      userService.search({ query: musicSearchText })
    ])
    } catch (error) {
      navigate(`/error`)
    }

    
    setSearchResponse({"albums": albumResponse, "users": userResponse})
    navigate(`/search/${musicSearchText}`)
  }

  const albumMatch = useMatch("/album/:id")
  const albumID = albumMatch ?
    albumMatch.params.id
    : null 
  
  const profileMatch = useMatch("/profile/:userID")
  const profileID = profileMatch ?
    profileMatch.params.userID
    : null 

  console.log("profileID: ", profileID)  
  
  return (
    <div>
      <Header
        setMusicSearchText={setMusicSearchText}
        musicSearchRequest={musicSearchRequest}
        musicSearchText={musicSearchText}
        viewWidth={viewWidth}
      >
      </Header>
      <SuccessNotification notification={successNotification} />
      <ErrorNotification notification={errorNotification} />
      <RoutesDiv>
        <Routes>
          <Route path="/" element={
          <Home 
            following={following} 
            setFollowing={setFollowing} 
            viewWidth={viewWidth}
          />} />
          <Route path="/profile/:userID" element={
            <Profile 
              otherUser={otherUser} 
              setOtherUser={setOtherUser}
              otherUserID={profileID}
              following={following}
              setFollowing={setFollowing}
              personalAlbumReviews={personalAlbumReviews}
              setPersonalAlbumReviews={setPersonalAlbumReviews}
              viewWidth={viewWidth}
              />} />
          <Route path="/profile/" element={
            <Profile 
              otherUser={null} 
              otherUserID={null}
              following = {following}
              setFollowing = {setFollowing}
              personalAlbumReviews={personalAlbumReviews}
              setPersonalAlbumReviews={setPersonalAlbumReviews}
              viewWidth={viewWidth}
              />} />
          <Route path="/search/:query" element={
            <SearchResults searchResponse={searchResponse} searchQuery={musicSearchText} setOtherUser={setOtherUser} />
          }/>
          <Route path="/album/:id" element={<AlbumPage 
            albumID={albumID} 
            viewWidth={viewWidth}
            handleSuccessChange={handleSuccessChange}
            handleErrorChange={handleErrorChange}
          />} />
          <Route path="/albumRatings/" element={
            <AlbumRatings 
              otherUser={null} 
              otherUserID={null}             
              personalAlbumReviews={personalAlbumReviews}
              setPersonalAlbumReviews={setPersonalAlbumReviews}
            />}
          />
          <Route path="/error/" element={<div> Something went wrong! Navigate back to the home page. </div>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </RoutesDiv>
    </div>
  )
}

export default App
