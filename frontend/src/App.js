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
import {
  Routes, Route, useMatch, useNavigate
} from "react-router-dom"
import styled from "styled-components"
import { useAuth0 } from "@auth0/auth0-react"


// https://coolors.co/0015ff-000000-f02f2f-001667-840012

const RoutesDiv = styled.div`
  position: absolute;
  top: ${props => props.theme.headerMargin};
`

function App() {
  const navigate = useNavigate()

  const [musicSearchText, setMusicSearchText] = useState("")
  const [searchResponse, setSearchResponse] = useState([])
  const [otherUser, setOtherUser] = useState(null)  // used for viewing profiles found from search
  const [personalAlbumReviews, setPersonalAlbumReviews] = useState([])
  const [following, setFollowing] = useState([])
  //const [album, setAlbum] = useState(dummyAlbum)

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
    profileMatch.params.id
    : null 
  return (
    <div>
      <Header
        setMusicSearchText={setMusicSearchText}
        musicSearchRequest={musicSearchRequest}
        musicSearchText={musicSearchText}
      >
      </Header>
      <RoutesDiv>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/" element={
            <Profile otherUser={null} 
              otherUserID={null} 
              personalAlbumReviews={personalAlbumReviews}
              setPersonalAlbumReviews={setPersonalAlbumReviews}
              following = {following}
              setFollowing={setFollowing}
            />} 
          />
          <Route path="/profile/:userID" element={<Profile following={following} otherUser={otherUser} otherUserID={profileID}/>} />
          <Route path="/search/:query" element={
            <SearchResults searchResponse={searchResponse} searchQuery={musicSearchText} setOtherUser={setOtherUser} />
          }/>
          <Route path="/album/:id" element={<AlbumPage albumID={albumID} />} />
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
