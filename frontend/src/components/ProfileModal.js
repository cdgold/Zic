import React, { useState, useEffect } from "react"
import { TextField, Modal, FormControl, Box } from "@mui/material"
import userService from "../services/user.js"
import { useAuth0 } from "@auth0/auth0-react"
import styled from "styled-components"

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

const LoginModal = ({ isOpen, setIsOpen, user }) => {
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
    }
  }

  return(
    <Modal
    open={isOpen}
    onClose={() => setIsOpen(false)}
    >
      <Box sx={modalStyle}>
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
          variant = "standard"
          onKeyUp = {(event) => { if(event.key === "Enter"){
                    submitProfileChanges()
              }
            }
          }>
        </TextField>
      </Box>
    </Modal>
  )
}

export default LoginModal