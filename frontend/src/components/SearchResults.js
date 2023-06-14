import React, { useState } from "react"
import auth0Service from "../services/auth0.js"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import dummyResults from "../test/dummySearchResults.js"

const HrStyled = styled.hr`
  margin-left: 10px;
  width: max(30%, 200px);
  margin-bottom: 10px;
  font-weight: normal;
  size: 4px;
  color: black;
`

const ResultRow = styled.div`
  font: "Archivo";
  color: black;
  font-size: ${props => props.theme.fonts.sizes.titleSmall};
`

const UserLink = styled.a`
  &:hover {
    cursor: pointer;
  }
`

const TrackResult = ({ track }) => {
  return(
    <ResultRow>
      <HrStyled />
      { track.images[0].url ? 
        <img style={{ height: "80px", width:"80px" }} src={track.images[0].url} /> 
        : null
      }
      {track.name} by {track.artists[0].name} ({track.release_date.slice(0, 4)}) <br></br>
    </ResultRow>
  )
}

const UserResult = ({ user }) => {
  return(
    <ResultRow>
      <HrStyled />
      { user.picture && (user.picture !== "") ? 
        <img style={{ height: "80px", width:"80px" }} src={user.picture} /> 
        : null
      }
      <br></br>
      {user.nickname} 
    </ResultRow>
  )
}

const SearchResults = ({ searchResponse, searchQuery, setOtherUser }) => {
  //searchQuery = "Tyler the creator"
  //searchResponse = dummyResults.albums.items

  const navigate = useNavigate()

  const handleUserClick = ({ event, user }) => {
    event.preventDefault()
    setOtherUser(user)
    navigate(`/profile/${user.userID}`)
  }

  if (searchResponse.length === 0){
    return(
    <div>
        No results.
    </div>
    )
  }
  return(
    <div>
        Album search for: {searchQuery}
        {typeof searchResponse.albums !== "undefined" ? 
          searchResponse.albums.map(result => {
          const albumID = result.uri.split(":")[2]
          return(
          <Link 
            style={{ textDecoration: "none", textColor: "red" }} 
            key={result.uri} 
            to={`/album/${albumID}`}
          >
            <TrackResult track={result} />
          </Link>
          )})
        : <div> No albums to show. </div>}
        User search for: {searchQuery}
        {typeof searchResponse.users !== "undefined" && searchResponse.users !== [] ?
        searchResponse.users.map(result => {
          console.log(result)
          const userID = result.userID
          return(
          <UserLink
            onClick={(event) => handleUserClick({ "event": event, "user": result  })}
            key={userID} 
            to={`/profile/${userID}`}
          >
            <UserResult user={result} />
          </UserLink>
          )})
        : <div> No users found. </div> }
    </div>
  )
}

export default SearchResults