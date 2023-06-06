import React, { useState } from "react"
import { TextField, Modal, FormControl, Box } from "@mui/material"
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

const LoginModal = ({ setUser, isOpen, setIsOpen }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const submitLoginForm= () => {
    console.log(`Logging in with: ${username} and ${password}`)
    const user = {username: username, id: password}
    setUser(user)
  }

  return(
    <Modal
    open={isOpen}
    onClose={() => setIsOpen(false)}
    >
      <Box sx={modalStyle}>
        <TextField      
          label="username"   
          onChange = {(event) => setUsername(event.target.value)}
          variant = "standard">
        </TextField>
        <TextField
          label="password"
          onChange = {(event) => setPassword(event.target.value)}
          variant = "standard"
          onKeyUp = {(event) => { if(event.key === "Enter"){
                    submitLoginForm()
              }
            }
          }>
        </TextField>
      </Box>
    </Modal>
  )
}

export default LoginModal