import React, { useEffect, useState } from "react"
import { useAuth0 } from '@auth0/auth0-react'
import AcceptButton from "../styling/reusable/AcceptButton.js"
import styled, { useTheme } from "styled-components"
import darkSideOfTheMoonCover from "../assets/images/darksideofthemoon.png"
import titanicRisingCover from "../assets/images/titanicrising.jpg"
import flowerBoyCover from "../assets/images/flowerboy.png"

const MOBILE_VIEW_THRESHOLD = 750

const SignupPage = styled.div`
    align-self: center;
    display: grid;
    width: 100%;
    height: 100%;
    margin-top: 1rem;
    justify-content: center;
    grid-template-columns: minmax(min-content, max-content) 130px 130px 165px;
    grid-template-rows: auto;
`

const MobileSignupPage = styled.div`
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: minmax(100px, 30%) minmax(100px, 30%) minmax(120px, 40%);
    grid-template-rows: 1fr 1fr;
`

const Title = styled.div`
  font-size: ${props => props.theme.fonts.sizes.titleLarge};
  color: ${props => props.theme.colors.primaryOne};
  font-family: ${props => props.theme.titleFonts};
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  text-align: center;
  grid-column: 1;
  grid-row: 1;
  align-self: end;
`

const Subtitle = styled.div`
  font-family: ${props => props.theme.bodyFonts};
  font-size: ${props => props.theme.titleMedium};
  color: ${props => props.theme.colors.primaryOne};
  grid-column: 1;
  grid-row: 2;
  text-align: center;
`

const SignupTextContainer = styled.div`
display: flex;
flex-direction: column;
align-self: center;
justify-self: center;
grid-template-columns: 1fr;
grid-template-rows: auto;
row-gap: .5rem;
margin-right: 2rem;
`

const AlbumImg = styled.img`
  width: 200px;
  border-radius: 10%;
  grid-row: 1;
  align-self: center;
`

const AlbumImg1 = styled(AlbumImg)`
  grid-column: 2;
`

const AlbumImg2 = styled(AlbumImg)`
  transform: rotate(15deg) translate(0, 30px);
  grid-column: 3;
`

const AlbumImg3 = styled(AlbumImg)`
  transform: rotate(45deg) translate(0, 100px);
  grid-column: 4;
`

const ButtonSpan = styled.span`
  grid-column: 1;
  grid-row: 3;
  align-self: end;
  margin-right: 1rem;
`

const Signup = ({ viewWidth }) => {
  
  const { loginWithRedirect } = useAuth0()

  if (viewWidth > MOBILE_VIEW_THRESHOLD){ 
    return(
        <SignupPage>
            <SignupTextContainer>
                <Title>
                    RATE YOUR MUSIC.
                </Title>
                <Subtitle>
                    Zic lets you track your favorite albums and share them with others.
                </Subtitle>
                <ButtonSpan>
                    <AcceptButton 
                    text={"Sign up"}
                    onclick={(() => loginWithRedirect({
                    authorizationParams:{
                        screen_hint: "signup"
                    }
                    }))}>
                    Sign up
                    </AcceptButton>
                </ButtonSpan>
            </SignupTextContainer>
            <AlbumImg1 src={flowerBoyCover} alt={"Flower Boy by Tyler, The Creator's album cover"}></AlbumImg1>
            <AlbumImg2 src={titanicRisingCover} alt={"Titanic Rising by Weyes Blood's album cover"}></AlbumImg2>
            <AlbumImg3 src={darkSideOfTheMoonCover} alt={"The Dark Side of the Moon by Pink Floyd's album cover"}></AlbumImg3>
        </SignupPage>
  )
  }
  return(
    <MobileSignupPage>
        <span style={{ gridRow: 1, gridColumn: "1 / span 3", alignSelf: "center", marginRight: "0" }}>
            <SignupTextContainer>
                <Title>
                    RATE YOUR MUSIC.
                </Title>
                <Subtitle>
                    Zic lets you track your favorite albums and share them with others.
                </Subtitle>
                <ButtonSpan>
                    <AcceptButton 
                    text={"Sign up"}
                    onclick={(() => loginWithRedirect({
                    authorizationParams:{
                        screen_hint: "signup"
                    }
                    }))}>
                    Sign up
                    </AcceptButton>
                </ButtonSpan>
            </SignupTextContainer>
        </span>
        {/*
        <span style={{ gridRow: 2, gridColumn: 1 }}>
            <AlbumImg1 
            src={flowerBoyCover} 
            alt={"Flower Boy by Tyler, The Creator's album cover"}>
            </AlbumImg1>
        </span>
        <span style={{ gridRow: 2, gridColumn: 2 }}>
            <AlbumImg2 src={titanicRisingCover} alt={"Titanic Rising by Weyes Blood's album cover"}></AlbumImg2>
        </span>
        <span style={{ gridRow: 2, gridColumn: 3 }}>
            <AlbumImg3 src={darkSideOfTheMoonCover} alt={"The Dark Side of the Moon by Pink Floyd's album cover"}></AlbumImg3>
        </span>
        */}
    </MobileSignupPage>
  )
} 

export default Signup