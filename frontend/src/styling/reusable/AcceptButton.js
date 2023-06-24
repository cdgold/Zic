import React, { useEffect, useState } from "react"
import styled, { useTheme } from "styled-components"
import { Link } from "react-router-dom"


const Button = styled.button`
  all: unset;
  font-family: ${props => props.theme.bodyFonts};
  background-color: ${props => props.theme.colors.primaryOne};
  border-radius: 8px;
  color: ${props => props.theme.colors.primaryThree};
  border-color: ${props => props.theme.colors.secondaryOne};
  font-size: ${props => props.theme.fonts.sizes.bodyLarge};
  width: fit-content;
  padding: 5px 15px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.secondaryOne}; 
  }

  &:active {
    background-color: ${props=>props.theme.colors.tertiaryOne};
  }
`

// softMax determines if review_text can be expanded or not
const AcceptButton = ({ onclick, text }) => {
  return(
    <Button onClick={() => {onclick()}}>
        {text}
    </Button>
  )
}

export default AcceptButton