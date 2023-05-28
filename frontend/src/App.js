import "./App.css"
import React, { useState, useEffect } from "react"
import spotifyService from "./services/spotify.js"
import Home from "./components/Home.js"
import Profile from "./components/Profile.js"
import Header from "./components/Header.js"
import {
  Routes, Route, useMatch
} from "react-router-dom"

// https://coolors.co/0015ff-000000-f02f2f-001667-840012

function App() {

  const [musicSearchText, setMusicSearchText] = useState("")

  useEffect(() => {
    spotifyService.getAndSetToken()
  }, [])

  const musicSearchRequest = async () => {
    console.log(`Request with content ${musicSearchText} and type track`)
  }
  return (
    <div>
      {`music search text is: ${musicSearchText}`}
      <Header
        setMusicSearchText={setMusicSearchText}
        musicSearchRequest={musicSearchRequest}
        musicSearchText={musicSearchText}></Header>
      <Routes>
        <Route path="/" element={<Home />}>
        </Route>
        <Route path="/profile/" element={<Profile
        />}>
        </Route>
      </Routes>
    </div>
  )
}

export default App
