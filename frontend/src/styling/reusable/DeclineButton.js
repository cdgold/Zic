import React, { useEffect, useState } from "react"
import styled, { useTheme } from "styled-components"
import { Link } from "react-router-dom"


const Button = styled.button`
  all: unset;
  font-family: ${props => props.theme.bodyFonts};
  background-color: rgb(0, 0, 0, 0);
  color: ${props => props.theme.colors.secondaryOne};
  border: 2px solid ${props => props.theme.colors.secondaryOne};
  border-radius: 8px;
  font-size: ${props => props.theme.fonts.sizes.bodyMedium};
  width: fit-content;
  padding: 5px 5px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.secondaryOne};
    color: white; 
  }

  &:active {
    background-color: ${props=>props.theme.colors.tertiaryOne};
  }
`

// softMax determines if review_text can be expanded or not
const DeclineButton = ({ onclick, text }) => {
  return(
    <Button onClick={() => {onclick()}}>
        {text}
    </Button>
  )
}

export default DeclineButton