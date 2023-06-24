import React, { useEffect, useState } from "react"
import styled, { useTheme } from "styled-components"

const Notification = styled.div`
  position: fixed;
  width: 95vw;
  z-index: 10;
  font-family: ${props => props.theme.bodyFonts};
  font-size: ${props => props.theme.bodyLarge};
  border: 2px solid;
  padding: 5px;
  border-radius: 5px;
  top: 3.5rem;
`

const SuccessNotificationStyled = styled(Notification)`
  color: black;
  background-color: ${props => props.theme.colors.success};
  border-color: ${props => props.theme.colors.successTwo};
`

const ErrorNotificationStyled = styled(Notification)`
color: black;
background-color: ${props => props.theme.colors.errorTwo};
border-color: ${props => props.theme.colors.error};
`

const SuccessNotification = ({ notification }) => {
  if (notification !== ""){
  return(
    <SuccessNotificationStyled>
        {notification}
    </SuccessNotificationStyled>
  )
  }
  return null
}

const ErrorNotification = ({ notification }) => {
  if (notification !== ""){
    return(
        <ErrorNotificationStyled>
            {notification}
        </ErrorNotificationStyled>
    )
  }
  return null
}

export { SuccessNotification, ErrorNotification }