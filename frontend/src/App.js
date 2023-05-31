import "./App.css"
import React, { useState, useEffect } from "react"
import spotifyService from "./services/spotify.js"
import AlbumPage from "./components/AlbumPage.js"
import Home from "./components/Home.js"
import Profile from "./components/Profile.js"
import Header from "./components/Header.js"
import SearchResults from "./components/SearchResults.js"
import {
  Routes, Route, useMatch, useNavigate
} from "react-router-dom"

// https://coolors.co/0015ff-000000-f02f2f-001667-840012

function App() {
  const navigate = useNavigate()

  const [musicSearchText, setMusicSearchText] = useState("")
  const [searchResponse, setSearchResponse] = useState([])
  const [user, setUser] = useState(null)
  const [album, setAlbum] = useState(null)

  useEffect(() => {
    // spotifyService.getAndSetToken()
  }, [])

  const musicSearchRequest = async () => {
    console.log(`Request with content ${musicSearchText} and type album`)
    const APIResponse = await spotifyService.search({ query: musicSearchText, type: "album" })
    console.log("API response is: ", APIResponse)
    setSearchResponse(APIResponse)
    navigate(`/search/${musicSearchText}`)
  }

  return (
    <div>
      {`music search text is: ${musicSearchText}`}
      <Header
        setMusicSearchText={setMusicSearchText}
        musicSearchRequest={musicSearchRequest}
        musicSearchText={musicSearchText}
        user={user}
        setUser={setUser}
      >
      </Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/" element={<Profile />} />
        <Route path="/search/:query" element={<SearchResults searchResponse={searchResponse} searchQuery={musicSearchText} />} />
        <Route path="/album/:id" element={<AlbumPage album={album}/>} />
      </Routes>
    </div>
  )
}

export default App
