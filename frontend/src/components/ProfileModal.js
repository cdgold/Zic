import React, { useState, useEffect } from "react"
import { TextField, Modal, FormControl, Box, Button } from "@mui/material"
import userService from "../services/user.js"
import { useAuth0 } from "@auth0/auth0-react"
import styled, { useTheme } from "styled-components"
import AcceptButton from "../styling/reusable/AcceptButton.js"

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "10rem",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  }

const LoginModal = ({ isOpen, setIsOpen, user }) => {
  const theme = useTheme()

  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0()

  const [nickname, setNickname] = useState("")
  const [pictureUrl, setPictureUrl] = useState("")

  const submitProfileChanges = async () => {
    let changes = {}
    if (nickname !== user.nickname){
      changes["nickname"] = nickname
    }
    if (pictureUrl !== user.picture){
      changes["picture"] = pictureUrl
    }
    if (Object.keys(changes).length > 0) {
      let token
      try { 
        token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`
        },
      })}
      catch (error) {
        token = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`
          },
        })
      }
      userService.patchUser({ "changes": changes, "token": token})
        .then(
          window.location.reload()
        )
    }
  }

  return(
    <Modal
    open={isOpen}
    onClose={() => setIsOpen(false)}
    sx = {{ fontFamily: theme.bodyFonts }}
    >
      <Box sx={modalStyle}>
        <div style={{  }} > Edit profile info </div>
        <TextField      
          label="nickname"   
          value = {nickname}
          onChange = {(event) => setNickname(event.target.value)}
          variant = "standard">
        </TextField>
        <TextField
          label="picture url"
          value = {pictureUrl}
          onChange = {(event) => setPictureUrl(event.target.value)}
          variant = "standard">
        </TextField>
        <span style={{ marginTop: ".5rem", float: "right" }}>
        <AcceptButton
          onclick={() => submitProfileChanges()}
          text={"Submit"}
        /> 
        </span>
      </Box>
    </Modal>
  )
}

export default LoginModal