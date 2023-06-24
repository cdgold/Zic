import React, { useEffect, useState } from "react"
import styled, { useTheme } from "styled-components"
import { Link } from "react-router-dom"


const Button = styled.button`
  all: unset;
  pointer-events:${(props)=>props.disabled?'none':null};
  font-family: ${props => props.theme.bodyFonts};
  background-color: ${props => props.theme.colors.primaryTwo};
  border-radius: 8px;
  color: ${props => props.theme.colors.primaryThree};
  border-color: ${props => props.theme.colors.secondaryTwo};
  font-size: ${props => props.theme.fonts.sizes.bodyLarge};
  width: fit-content;
  padding: 5px 15px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.secondaryTwo}; 
  }

  &:active {
    background-color: ${props=>props.theme.colors.tertiaryTwo};
  }

  &:disabled {
    background-color: ${props=>props.theme.colors.disabled};
    color: ${props=>props.theme.colors.disabledText};
  }
`

// softMax determines if review_text can be expanded or not
const AcceptButton = ({ onclick, text, disabled = false }) => {
  return(
    <Button disabled={disabled} onClick={() => {onclick()}}>
        {text}
    </Button>
  )
}

export default AcceptButton