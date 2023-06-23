import React, { useState, useContext } from "react"
import { useTheme } from 'styled-components'
import { TextField, Button } from "@mui/material"
//import LoginModal from "./LoginModal.js"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import magnifyingGlass from "../assets/images/magnifying_glass_transparent_bg.png"
import { useAuth0 } from "@auth0/auth0-react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"


const HeaderDiv = styled.div`
  position: fixed;
  display: flex;
  justify-items: center;
  top: 0;
  left: 0;
  height: 3rem;
  width: 100vw;
  
  background-color: white;
  overflow:auto;
  z-index: 10;
  border-style: solid;
  border-top: 1px;
  border-color: ${props => props.theme.colors.secondaryThree};
`

const TopRightBar = styled.div`
  position: absolute;
  height: 1.5rem;
  top: .75rem;
  right: 1rem;   
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
  background-color: ${props => props.theme.colors.secondaryThree};

  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-items: center;
  text-align: center;
  gap: 1.5rem;

  font-family: ${props => props.theme.titleFonts};
`


const MenuLink = styled.div`
  text-decoration-color: ${props => props.theme.colors.primaryOne};
  color: black;
  font-size: ${props => props.theme.fonts.sizes.bodyLarge};
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
  color: ${props => props.theme.colors.secondaryTwo};
  margin-left: 1.5rem;
  font-size: 20px;
`

const CloseButton = styled.div`
  text-align: right;
  padding-right: 1.5rem;
  color: black;
`

// for mobile view
const SlidingMenu = ({ user, isAuthenticated, handleLogin, handleLogout, menuVisible, setMenuVisible }) => {
  return(
  <MovingMenu style={{ display: "none" }}>
    <CloseButton onClick={() => setMenuVisible("translate3d(100vw, 0, 0)")}> 
      X
    </CloseButton>
    <Link to="/" style={{ textDecoration: "none" }}>
      <MenuLink>
        Home Page
      </MenuLink>
    </Link>
    { (isAuthenticated && typeof user.nickname !== "undefined") ?
    <>
      <Link to="/profile" style={{ textDecoration: "none" }}>
        <MenuLink>
          {user.nickname}'s Profile
        </MenuLink>
      </Link>
      <MenuLink>
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

const SearchBar = ({ theme, musicSearchRequest,setMusicSearchText }) => {

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
      <img style={{height: "1em", width:"1em", marginRight:"5px"}} src={magnifyingGlass} />
    </>
  )
}

const Header = ({ musicSearchRequest, setMusicSearchText }) => {
  const theme = useTheme()

  const navigate = useNavigate()
  const [loginModalOpen, setLoginModalOpen] = useState(false) 
  const [ menuVisible, setMenuVisible ] = useState("translate3d(100vw, 0, 0)")
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  console.log("menu visibile is: ", menuVisible)

  const handleLogin = async () => {
    await loginWithRedirect()
  }

  let mql = window.matchMedia("(max-width: 600px)")
  let mobileView = mql.matches;

  const handleLogout = async () => {
    logout({ 
      logoutParams: {
        returnTo: (`${process.env.REACT_APP_REDIRECT}`)
      }
    })
  }

  return(
    <HeaderDiv style={ {fontFamily: "Archivo"} }>
      <Link to="/" style={{ display: "flex" }}>
        <LogoText>
          <LogoLetter1>Z</LogoLetter1>
          <LogoLetter2>I</LogoLetter2>
          <LogoLetter3>C</LogoLetter3>
        </LogoText>
      </Link>
      { (mobileView) ?
        <TopRightBar>
        <NavButton onClick={ () => setMenuVisible("translate3d(-80vw, 0, 0)") }>
          <FontAwesomeIcon icon={faBars} />
        </NavButton>
        <SearchBar 
          musicSearchRequest={musicSearchRequest}
          setMusicSearchText={setMusicSearchText}
          theme={theme}
        />
        <SlidingMenu 
          menuVisible={menuVisible} 
          setMenuVisible={setMenuVisible}
          user={user}
          isAuthenticated={isAuthenticated}
          handleLogin={handleLogin}
          handleLogout={handleLogout}/>
        </TopRightBar>
      :
      <TopRightBar>
      <SearchBar
        musicSearchRequest={musicSearchRequest}
        setMusicSearchText={setMusicSearchText}
        theme={theme}
        />
      { (isAuthenticated && typeof user.nickname !== "undefined")
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