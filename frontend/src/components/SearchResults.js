import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled, { useTheme } from "styled-components"
import AcceptButton from "../styling/reusable/AcceptButton.js"

const Page = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  margin-left: 1.0rem;
`

const HrStyled = styled.hr`
  margin-left: 10px;
  width: max(30%, 200px);
  margin-bottom: 10px;
  font-weight: normal;
  size: 4px;
  color: black;
`

const ResultRow = styled.div`
  font-family: ${props => props.theme.bodyFonts};
  color: black;
  font-size: ${props => props.theme.fonts.sizes.bodyLarge};
  align-content: center;
  display: grid;
  grid-template-columns: min-content auto;
  grid-template-rows: 1fr;
  column-gap: 1rem;
`

const UserLink = styled.a`
  &:hover {
    cursor: pointer;
  }
`

const Header = styled.div`
font-family: ${props => props.theme.titleFonts};
color: black;
font-size: ${props => props.theme.fonts.sizes.titleSmall};
`

const TrackResult = ({ track, theme }) => {
  return(
    <>
      <HrStyled />
      <ResultRow>
        { track.images[0].url ?
          <img style={{ height: "80px", width:"80px", gridColumn: 1, gridRow: 1 }} src={track.images[0].url} />
          : null
        }
        <div style={{ gridColumn: 2, gridRow: 1 }}>
          <span style={{ color: theme.colors.primaryOne }}> {track.name} </span> by <br></br>
          <span style={{ color: theme.colors.secondaryOne }}> {track.artists[0].name} </span> ({track.release_date.slice(0, 4)})
        </div>
      </ResultRow>
    </>
  )
}

const UserResult = ({ user, theme }) => {
  return(
    <>
      <HrStyled />
      <ResultRow>
        { user.picture && (user.picture !== "") ?
          <img style={{ height: "80px", width:"80px", gridColumn: 1, gridRow: 1 }} src={user.picture} />
          : null
        }
        <br></br>
        <div style={{ gridColumn: 2, gridRow: 1 }}>
          <span style={{ color: theme.colors.primaryOne }}> {user.nickname} </span>
        </div>
      </ResultRow>
    </>
  )
}

const SearchResults = ({ searchResponse, searchQuery, setOtherUser }) => {
  const theme = useTheme()

  const navigate = useNavigate()

  const [albumShown, setAlbumShown] = useState("")
  const [userShown, setUserShown] = useState("none")

  const handleTabChange = (searchTab) => {
    if(searchTab === "album"){
      setAlbumShown("")
      setUserShown("none")
    } else if (searchTab === "user"){
      setAlbumShown("none")
      setUserShown("")
    }
  }

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
    <Page>
      <AcceptButton onclick={() => handleTabChange("album")} text={"Albums"} />
      <span style={{ marginLeft: ".5rem" }}>
        <AcceptButton onclick={() => handleTabChange("user")} text={"Users"} />
      </span>
      <div style={{ display: albumShown }}>
        <Header>
          {`Album search for: "${searchQuery}"`}
        </Header>
        {typeof searchResponse.albums !== "undefined" ?
          searchResponse.albums.map(result => {
            const albumID = result.uri.split(":")[2]
            return(
              <Link
                style={{ textDecoration: "none", textColor: "red" }}
                key={result.uri}
                to={`/album/${albumID}`}
              >
                <TrackResult track={result} theme={theme} />
              </Link>
            )})
          : <div> No albums to show. </div>}
      </div>
      <div style={{ display: userShown }}>
        <Header>
          {`User search for: "${searchQuery}"`}
        </Header>
        {typeof searchResponse.users !== "undefined" && searchResponse.users.length > 0 ?
          searchResponse.users.map(result => {
            console.log(result)
            const userID = result.userID
            return(
              <UserLink
                onClick={(event) => handleUserClick({ "event": event, "user": result  })}
                key={userID}
                to={`/profile/${userID}`}
              >
                <UserResult user={result} theme={theme} />
              </UserLink>
            )})
          : <div> No users found. </div> }
      </div>
    </Page>
  )
}

export default SearchResults