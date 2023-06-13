import React, { useState, useContext } from "react"
import { useTheme } from 'styled-components'
import { TextField, Button } from "@mui/material"
//import LoginModal from "./LoginModal.js"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import magnifyingGlass from "../assets/images/magnifying_glass_transparent_bg.png"
import { useAuth0 } from "@auth0/auth0-react";

const HeaderDiv = styled.div`
  position: fixed;
  display: flex;
  justify-items: center;
  top: 0;
  left: 0;
  height: 3em;
  width: 100vw;
  min-width: 400px;
  background-color: white;
  overflow:auto;
  z-index: 10;
`

const TopRightBar = styled.div`
  position: absolute;
  height: 1.5em;
  top: .75em;
  right: 10px;   
  display: flex;
  align-items: center;
`

const LogoText = styled.div`
  position: absolute;
  top: 0;
  left: 5px;
  font-family: 'Archivo Black';
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 1em;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  user-select: none;

  &:hover{
      filter: brightness(85%);
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

const Header = ({ musicSearchRequest, setMusicSearchText }) => {
  const theme = useTheme()

  const navigate = useNavigate()
  const [loginModalOpen, setLoginModalOpen] = useState(false) 
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

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
    <HeaderDiv style={ {fontFamily: "Archivo"} }>
      <Link to="/">
      <LogoText>
        <LogoLetter1>Z</LogoLetter1>
        <LogoLetter2>I</LogoLetter2>
        <LogoLetter3>C</LogoLetter3>
      </LogoText>
      </Link>
      <TopRightBar>
      { (isAuthenticated && typeof user.nickname !== "undefined")
          ? <Button sx={topRightButtonStyle} variant="text" onClick={() => navigate("/profile")}> {user.nickname} </Button> 
          : <Button sx={topRightButtonStyle} variant="text" onClick={handleLogin}> LOGIN </Button> }
      {<Button sx={topRightButtonStyle} variant="text" onClick={handleLogout}> LOGOUT </Button>}
        <img style={{height: "1em", width:"1em", marginRight:"5px"}} src={magnifyingGlass} />
        <TextField
          onKeyUp = {(event) => { if(event.key === "Enter"){
            musicSearchRequest()
          }}}
          sx={{ color: theme.colors.primaryOne  }}
          onChange = {(event) => setMusicSearchText(event.target.value)}
          variant = "standard"
        />
      </TopRightBar>
    </HeaderDiv>
  )
}

export default Header