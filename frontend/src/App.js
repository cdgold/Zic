import "./App.css"
import React, { useState, useEffect } from "react"
import albumService from "./services/album.js"
import AlbumPage from "./components/AlbumPage.js"
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
  const { user } = useAuth0()
  console.log(user)
  const navigate = useNavigate()

  const [musicSearchText, setMusicSearchText] = useState("")
  const [searchResponse, setSearchResponse] = useState([])
  //const [user, setUser] = useState(null)
  //const [album, setAlbum] = useState(dummyAlbum)

  const musicSearchRequest = async () => {
    console.log(`Request with content ${musicSearchText} and type album`)
    const APIResponse = await albumService.searchSpotify({ query: musicSearchText, type: "album" })
    setSearchResponse(APIResponse)
    navigate(`/search/${musicSearchText}`)
  }

  const albumMatch = useMatch("/album/:id")
  const albumID = albumMatch ?
    albumMatch.params.id
    : null 
  return (
    <div>
      <Header
        setMusicSearchText={setMusicSearchText}
        musicSearchRequest={musicSearchRequest}
        musicSearchText={musicSearchText}
        user={user}
      >
      </Header>
      <RoutesDiv>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/" element={<Profile />} />
          <Route path="/search/:query" element={
            <SearchResults searchResponse={searchResponse} searchQuery={musicSearchText} />
          } />
          <Route path="/album/:id" element={<AlbumPage albumID={albumID} user={user} />} />
          <Route path="/error/" element={<div> Something went wrong! Navigate back to the home page. </div>} />
        </Routes>
      </RoutesDiv>
    </div>
  )
}

export default App
