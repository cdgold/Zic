import React, { useState, useEffect } from "react"
import { TextField, Modal, FormControl, Box, Button } from "@mui/material"
import userService from "../services/user.js"
import { useAuth0 } from "@auth0/auth0-react"
import styled, { useTheme } from "styled-components"
import AcceptButton from "../styling/reusable/AcceptButton.js"
import magnifyingGlass from "../assets/images/magnifying_glass_transparent_bg.png"

// only works when nickname included??? local issue?

const RESIZE_MODAL_CUTOFF = "800px"
const IMAGES_PER_ROW_DESKTOP = 6
const IMAGES_PER_ROW_MOBILE = 4

/*
const examplePossibleAvatars = [
  "https://i.scdn.co/image/ab6761610000f1788278b782cbb5a3963db88ada",
  "https://i.scdn.co/image/ab6761610000f178e82e67955cf6a462c26ee576",
  "https://i.scdn.co/image/ab6761610000f178586b5ad31a4e938044c3dac3",
  "https://i.scdn.co/image/ab6761610000f178c4e9c6b46ca8e6cb1f546e6a",
  "https://i.scdn.co/image/ab6761610000f178264403d509777042fc618f26",
  "https://i.scdn.co/image/ab6761610000f1786b86dff9a5f6442c9fc19617",
  "https://i.scdn.co/image/ab6761610000f178c68409d8cba75b2b44050c22",
  "https://i.scdn.co/image/ab6761610000f178a455626b52ba8ec797c60068",
  "https://i.scdn.co/image/ab6761610000f1782d35f367a6abde15158b0834",
  "https://i.scdn.co/image/ab6761610000f1784fd54df35bfcfa0fc9fc2da7",
  "https://i.scdn.co/image/ab6761610000f1784fd54df35bfcfa0fc9fc2da7",
  "https://i.scdn.co/image/ab6761610000f1784fd54df35bfcfa0fc9fc2da7"
]
*/


const AvatarBoxContainer = styled.div`
  border: 2px solid black;
  padding: 8px;
`

const AvatarImgContainer = styled.div`
  display: grid;
  @media (min-width: ${RESIZE_MODAL_CUTOFF}) {
    grid-template-columns: repeat(${IMAGES_PER_ROW_DESKTOP}, 1fr);
  }
  @media (max-width: ${RESIZE_MODAL_CUTOFF}){
    grid-template-columns: repeat(${IMAGES_PER_ROW_MOBILE}, 1fr);
  }
  grid-template-rows: repeat(2, 1fr);
`

const AvatarImg = styled.img`
  width: 90%;
  height: 90%;
  border-radius: 50%;
  place-self: center;
  aspect-ratio: 1;
  filter: brightness(${props => (props.deselected ? "50%" : "1")});

  transition: filter .5s;
`

const AvatarImage = ({ image, pictureUrl, handleAvatarSelect }) => {
  return(
    <AvatarImg
      selected={pictureUrl === image}
      deselected={pictureUrl !== image && pictureUrl !== null}
      onClick={() => handleAvatarSelect(image)}
      src={image} />
  )
}


const AvatarBox = ({ setPictureUrl, pictureUrl }) => {
  const [pictureQuery, setPictureQuery] = useState("")
  const [possibleAvatars, setPossibleAvatars] = useState(null)
  const [textStyle, setTextStyle] = useState({ display: "" })
  const [text, setText] = useState("Use the search bar to find your favorite artist to set as your profile pic!")

  //console.log("possible avatars: ", possibleAvatars)

  const handleAvatarSearch = () => {
    userService.searchPossibleAvatars({ "query": pictureQuery })
      .then((avatarUrlArray) => {
        if (Array.isArray(avatarUrlArray) && avatarUrlArray.length > 0){
          setPossibleAvatars(avatarUrlArray)
        }
        else {
          setPossibleAvatars([])
        }
      })
      .catch(() => {
        setPossibleAvatars([])
      })
  }

  const handleAvatarSelect = (selectedUrl) => {
    setPictureUrl(selectedUrl)
  }

  useEffect(() => {
    if (possibleAvatars !== null && Array.isArray(possibleAvatars)){
      if (possibleAvatars.length === 0){
        setTextStyle({ display: "" })
        setText("No search results.")
      }
      else {
        setTextStyle({ display: "none" })
      }
    }
  }, [possibleAvatars])

  return(
    <AvatarBoxContainer>
      <TextField
        label="search artists"
        value = {pictureQuery}
        onChange = {(event) => setPictureQuery(event.target.value)}
        variant = "standard"
        onKeyUp = {(event) => { if(event.key === "Enter"){ handleAvatarSearch() }}}>
      </TextField>
      <AvatarImgContainer>
        { Array.isArray(possibleAvatars) ?
          <>
            {possibleAvatars.map((url, itr) => {
              console.log("url is: ", url)
              return(
                <AvatarImage
                  key={itr}
                  image={url}
                  pictureUrl={pictureUrl}
                  handleAvatarSelect={handleAvatarSelect}
                >
                </AvatarImage>
              )})}
          </>
          : null}
      </AvatarImgContainer>
      <div style={textStyle} > <br></br> {text} </div>
    </AvatarBoxContainer>
  )
}

const ModalBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (min-width: ${RESIZE_MODAL_CUTOFF}) {
    width: 50vw;
    height: min-content;
  }
  @media (max-width: ${RESIZE_MODAL_CUTOFF}) {
    width: 90vw;
  }
  background-color: ${props => props.theme.colors.primaryThree};
  border: 2px solid #000;
  box-shadow: 24;
  padding: 10px;
`

const TitleText = styled.div`
  font-family: ${props => props.theme.titleFonts};
  margin-bottom: .5rem;
`

const FormText = styled.div`
  display: flex;
  align-items: center; 
  flex-gap: .25rem;
  margin-bottom: .5rem;
`

const ProfileModal = ({ isOpen, setIsOpen, user }) => {
  const theme = useTheme()

  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0()

  const [nickname, setNickname] = useState(user.nickname)
  const [pictureUrl, setPictureUrl] = useState(null)

  console.log("pictureUrl is now: ", pictureUrl)

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
            audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`,
            ignoreCache: true,
            scope: "offline_access"
          },
        })}
      catch (error) {
        token = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`,
            ignoreCache: true,
            scope: "offline_access"
          },
        })
      }
      userService.patchUser({ "changes": changes, "token": token })
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
      <ModalBox>
        <TitleText > Edit profile info </TitleText>
        <FormText>
        username:
          <TextField
            value = {nickname}
            onChange = {(event) => setNickname(event.target.value)}
            variant = "standard">
          </TextField> <br></br>
        </FormText>
        <FormText>
        profile pic:
        </FormText>
        <AvatarBox
          setPictureUrl={setPictureUrl}
          pictureUrl={pictureUrl}
        />
        <span style={{ marginTop: ".5rem", float: "right" }}>
          <AcceptButton
            onclick={() => submitProfileChanges()}
            text={"Submit"}
          />
        </span>
      </ModalBox>
    </Modal>
  )
}

export default ProfileModal