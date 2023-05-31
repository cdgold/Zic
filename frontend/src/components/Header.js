import React, { useState } from "react"
import { TextField, Modal } from "@mui/material"
import LoginModal from "./LoginModal.js"
import { Link } from "react-router-dom"
import styled from "styled-components"

const Header = ({ musicSearchRequest, setMusicSearchText, user, setUser }) => {
  
  const [loginModalOpen, setLoginModalOpen] = useState(false) 

  return(
    <div style={ {fontFamily: "Archivo"} }>
      <TextField
        onKeyUp = {(event) => { if(event.key === "Enter"){
          musicSearchRequest()
        }}}
        onChange = {(event) => setMusicSearchText(event.target.value)}
        variant = "standard"
      />
      <LoginModal isOpen={loginModalOpen} setIsOpen={setLoginModalOpen} setUser={setUser} ></LoginModal>
        Header!
        { (user !== null && typeof user.username !== 'undefiend') ? user.username : <button onClick={() => setLoginModalOpen(true)}> LOGIN </button> }
    </div>
  )
}

export default Header