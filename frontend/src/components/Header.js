import React, { useState } from "react"
import { useTheme } from "styled-components"
import { TextField, Button } from "@mui/material"
//import LoginModal from "./LoginModal.js"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import magnifyingGlass from "../assets/images/magnifying_glass_transparent_bg.png"
import { useAuth0 } from "@auth0/auth0-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faRectangleXmark } from "@fortawesome/free-solid-svg-icons"

const MOBILE_VIEW_THRESHOLD = 600
const SHOW_LOGO_THRESHOLD = 380

const openMenuStyles = {
  transform: "translate3d(20vw, 0, 0)",
  boxShadow: "0 0 0 max(100vh, 100vw) rgba(0, 0, 0, .3)"
}

const closedMenuStyles = {
  transform: "translate3d(100vw, 0, 0)",
  boxShadow: "none"
}

const HeaderDiv = styled.div`
  position: fixed;
  display: flex;
  justify-items: center;
  top: 0;
  left: 0;
  height: 3rem;
  width: 100vw;
  
  background-color: white;
  overflow-x: hidden;
  z-index: 10;
  border-style: solid;
  border-top: 1px;
  border-color: ${props => props.theme.colors.secondaryThree};
`

const TopRightBar = styled.div`
  position: absolute;
  height: 1.5rem;
  top: .75rem;
  right: 1.5rem;   
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
`

const LogoText = styled.div`
  position: absolute;
  top: 0;
  left: 5px;
  font-family: 'Archivo Black';
  font-style: normal;
  font-weight: 400;
  font-size: 2.25rem;
  line-height: 1em;
  margin-top: .25rem;
  margin-left: .5rem;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  user-select: none;
  justify-self: center;

  &:hover{
      filter: brightness(85%);
      cursor: pointer;
    }
`

const MovingMenu = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  transform: translate3d(100vw, 0, 0);
  width: 80vw;
  height: 100vh;
  background-color: ${props => props.theme.colors.primaryThree};

  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-items: center;
  text-align: center;
  gap: 1.5rem;
  transition: transform .8s cubic-bezier(.15,.5,.3,1), box-shadow .8s cubic-bezier(.15,.5,.3,1);

  font-family: ${props => props.theme.titleFonts};
`


const MenuLink = styled.div`
  text-decoration-color: ${props => props.theme.colors.primaryOne};
  color: black;
  font-size: ${props => props.theme.fonts.sizes.bodyLarge};

  &:hover{
    cursor: pointer;
  }
`

const LogoLetter1 = styled.span`
  color: ${props => props.theme.colors.primaryOne}
`

const LogoLetter2 = styled.span`
  color: ${props => props.theme.colors.primaryTwo}
`

const LogoLetter3 = styled.span`
  color: ${props => props.theme.colors.primaryThree}
`

const topRightButtonStyle = {
  marginRight:"8px",
  fontFamily: "Archivo Black",
  color: "black"
}

const NavButton = styled.div`
  color: ${props => props.theme.colors.primaryTwo};
  margin-left: 1.5rem;
  margin-right: 1.0rem;
  font-size: 20px;

  &:hover{
    cursor: pointer;
    color: ${props => props.theme.colors.secondaryTwo};
  }
`

const CloseButton = styled.div`
  text-align: right;
  padding-right: 1.5rem;
  color: ${props => props.theme.colors.primaryOne};
  
  &:hover{
    cursor: pointer;
  }
`

// for mobile view
const SlidingMenu = ({ user, isAuthenticated, handleLogin, handleLogout, menuStyling, setMenuStyling, navigate }) => {


  const handleNavigate = (link) => {
    setMenuStyling(closedMenuStyles)
    navigate(link)
  }

  return(
    <MovingMenu style={menuStyling}>
      <CloseButton onClick={() => setMenuStyling(closedMenuStyles)}>
        <FontAwesomeIcon icon={faRectangleXmark} />
      </CloseButton>
      <MenuLink onClick={() => handleNavigate("/")}>
      Home Page
      </MenuLink>
      { (isAuthenticated && user !== null && typeof user !== "undefined" && typeof user.nickname !== "undefined") ?
        <>
          <MenuLink onClick={() => handleNavigate("/profile/")}>
            {`${user.nickname}'s Profile`}
          </MenuLink>
          <MenuLink onClick={handleLogout}>
        Logout
          </MenuLink>
        </>
        : <MenuLink onClick={handleLogin}>
        Login
        </MenuLink>
      }
    </MovingMenu>
  )
}

const SearchBar = ({ theme, musicSearchRequest, setMusicSearchText }) => {

  return(
    <>
      <TextField
        onKeyUp = {(event) => { if(event.key === "Enter"){
          musicSearchRequest()
        }}}
        placeholder={`Search albums/users`}
        sx={{ color: theme.colors.primaryOne  }}
        onChange = {(event) => setMusicSearchText(event.target.value)}
        variant = "standard"
      >
      </TextField>
      <img style={{ height: "1em", width:"1em", marginRight:"5px" }} src={magnifyingGlass} />
    </>
  )
}

const Header = ({ musicSearchRequest, setMusicSearchText, viewWidth, user }) => {
  const theme = useTheme()

  const navigate = useNavigate()
  const [ menuStyling, setMenuStyling ] = useState(closedMenuStyles)
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0()

  //console.log("menu visibile is: ", menuVisible)
  //console.log("viewWidth is: ", viewWidth)

  const handleLogin = async () => {
    await loginWithRedirect()
  }

  const handleLogout = async () => {
    logout({
      logoutParams: {
        returnTo: (`${process.env.REACT_APP_REDIRECT}`)
      }
    })
  }

  return(
    <HeaderDiv style={ { fontFamily: "Archivo" } }>
      { (viewWidth > SHOW_LOGO_THRESHOLD) ?
        <Link to="/" style={{ display: "flex" }}>
          <LogoText>
            <LogoLetter1>Z</LogoLetter1>
            <LogoLetter2>I</LogoLetter2>
            <LogoLetter3>C</LogoLetter3>
          </LogoText>
        </Link>
        : null
      }
      { (viewWidth < MOBILE_VIEW_THRESHOLD) ?
        <TopRightBar>
          <NavButton onClick={ () => setMenuStyling(openMenuStyles) }>
            <FontAwesomeIcon icon={faBars} />
          </NavButton>
          <SearchBar
            musicSearchRequest={musicSearchRequest}
            setMusicSearchText={setMusicSearchText}
            theme={theme}
          />
          <SlidingMenu
            menuStyling={menuStyling}
            setMenuStyling={setMenuStyling}
            user={user}
            isAuthenticated={isAuthenticated}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            navigate={navigate}
          />
        </TopRightBar>
        :
        <TopRightBar>
          <SearchBar
            musicSearchRequest={musicSearchRequest}
            setMusicSearchText={setMusicSearchText}
            theme={theme}
          />
          { (user !== null && typeof user !== "undefined" && typeof user.nickname !== "undefined")
            ? <>
              <Button sx={topRightButtonStyle} variant="text" onClick={handleLogout}> LOGOUT </Button>
              <Button sx={topRightButtonStyle} variant="text" onClick={() => navigate("/profile")}> {user.nickname} </Button>
            </>
            : <Button sx={topRightButtonStyle} variant="text" onClick={handleLogin}> LOGIN </Button> }
        </TopRightBar>
      }
    </HeaderDiv>
  )
}

export default Header