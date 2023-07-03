import React from "react"
import styled, { useTheme } from "styled-components"
//import LoginModal from "./LoginModal.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"



const FooterDiv = styled.div`
  position: absolute;
  bottom: 0;
  margin-top: 1rem;
  height: calc(${props => props.theme.footerHeight} - 1rem);
  overflow-x: hidden;
  width: 100%;
  background-color: ${props => props.theme.colors.secondaryThree};
  overflow:auto;
  z-index: 1;

  border-style: solid;
  border-width: 2px 0 0 0;
  border-color: ${props => props.theme.colors.tertiaryThree};

  font-family: ${props => props.theme.bodyFonts};
  font-size: ${props => props.theme.fonts.sizes.bodyMedium};
  color: ${props => props.theme.colors.textThree};
  display: flex;
  align-items: center;
`

const FooterContent = styled.div`
  margin-left: 1.0rem;
`

const FooterLink = styled.a`
color: ${props => props.theme.colors.textThree};

&:hover {
  color: ${props => props.theme.colors.tertiaryThree};
  pointer: click;
}

&:active {
  color: black;
}
`

const GithubIcon = styled(FooterLink)`
font-size: 20px;
margin-left: .75rem;
`

const Footer = () => {
  return(
    <FooterDiv>
      <FooterContent>
        {`Utilizes `}
        <FooterLink href="https://developer.spotify.com/documentation/web-api" >{`Spotify API`}</FooterLink>
        {`  | Made by Chris Gold`}
        <GithubIcon href="https://github.com/cdgold" >
          <FontAwesomeIcon icon={faGithub} />
        </GithubIcon>
      </FooterContent>
    </FooterDiv>
  )
}

export default Footer