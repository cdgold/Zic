import React, { useState, useEffect } from "react"
// import { StyleSheet } from "react-native"
import { FormControl, TextField, Button } from "@mui/material"
import styled, { useTheme, keyframes } from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faList } from "@fortawesome/free-solid-svg-icons"
import AcceptButton from "../styling/reusable/AcceptButton.js"
import DeclineButton from "../styling/reusable/DeclineButton.js"

const MAX_REVIEW_LENGTH = 1000

const squishAndBounce = keyframes`
  0% {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
`

const ReviewFormDiv = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: min-content, min-content, min-content, min-content;
  row-gap: .5rem;
  width: 100%;
  font-family: ${props => props.theme.bodyFonts};
  font-size: ${props => props.theme.fonts.sizes.bodyMedium};
`

const FormTitle = styled.div`
  font-family: ${props => props.theme.titleFonts};
  font-size: ${props => props.theme.fonts.sizes.titleSmall};
  text-align: center;
`

const FormText = styled.div`
  
`

const RatingText = styled.div`
  font-family: ${props => props.theme.titleFonts};
  font-size: ${props => props.theme.fonts.sizes.titleSmall};
  grid-column: 5 / span 2;
  grid-row: 1;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
`

const NumberRatingBox = styled.div` 
  grid-column: 5 / span 2;
  grid-row: 2;
  text-align: center;
`

const ErrorText = styled.div`
  color: ${props => props.theme.colors.error};
  grid-column: 1 / span 2;
  grid-row: 4;
  text-align: right;
`

const FormIcon = styled.span`
  font-size: 2rem;
  text-align: center;

  &:hover {
    cursor: pointer;
    animation: ${squishAndBounce} .9s;
  }

`

const ListenedBox = styled.div`
  grid-column: 1 / span 2;
  grid-row: 2;
  text-align: center;
`

const ListBox = styled.div`
  grid-column: 3 / span 2;
  grid-row: 2;
  text-align: center;
`

const ListIcon = styled(FormIcon)`
  color: ${props => props.color};
  grid-column: 3 / span 2;
  grid-row: 1;
`

const MusicIcon = styled(FormIcon)`
  color: ${props => props.color};
  grid-column: 1 / span 2;
  grid-row: 1;
`

const ReviewForm = ({ textReview, 
  setTextReview,
  numberRating,
  setNumberRating,
  listened,
  setListened,
  listenList,
  setListenList,
  userRating,
  handleFormSubmit,
  editMode,
  setEditMode,
  isPosting }) => {
  
  const theme = useTheme()

  const [visibleOnEdit, setVisibleOnEdit] = useState("")
  const [musicIconColor, setMusicIconColor] = useState("")
  const [listIconColor, setListIconColor] = useState("")

  useEffect(() => {
    console.log("entered")
    if (!listened) {
      setMusicIconColor(theme.colors.primaryOne)
    }
    else {
      setMusicIconColor(theme.colors.primaryTwo)
    }
    if (!listenList) {
      setListIconColor(theme.colors.primaryOne)
    }
    else {
      setListIconColor(theme.colors.primaryTwo)
    }
  }, [listened, listenList])

  const handleListenedChange = () => {
    setEditMode(true)
    /*
    if (listened){
      setMusicIconColor(theme.colors.primaryOne)
    } else {
      setMusicIconColor(theme.colors.primaryTwo)
    }
    */
    setListened(!listened)
  }

  const handleListenListChange = () => {
    setEditMode(true)
    /*
    if (listenList){
      setListIconColor(theme.colors.primaryOne)
    } else {
      setListIconColor(theme.colors.primaryTwo)
    }
    */
    setListenList(!listenList)
  }

  useEffect(() => {
    if (editMode){
      setVisibleOnEdit("")
    }
    else {
      setVisibleOnEdit("none")
    }
  }, [editMode])

  const handleNumberRatingChange = (event) => {
    const parsedFloat = parseFloat(event.target.value)
    let newNumberRating = {value: event.target.value}
    if((isNaN(parsedFloat) || parsedFloat > 10.0 || parsedFloat < 0.0) && numberRating.value !== ""){
      newNumberRating["error"] = "Rating must be between 0.0 and 10.0."
    }
    else{     // value is a float between 0-10
      newNumberRating["error"] = ""
    }
    if(event.target.value.length < 5){
      setNumberRating(newNumberRating)
    }
  }

  useEffect(() => {
    console.log("setting with", userRating)
    if(userRating !== null && typeof userRating !== "undefined"){
      if(typeof userRating.review_text !== "undefined") {
        setTextReview(userRating.review_text)
      }
      if(typeof userRating.rating !== "undefined") {
        console.log("in here with", userRating.rating)
        setNumberRating({"value": userRating.rating, "error": ""})
      }
      if(typeof userRating.listened !== "undefined") {
        setListened(userRating.listened)
      }
      if(typeof userRating.listenList !== "undefined") {
        setListenList(userRating.listenList)
      }
    }
  }, [userRating])

  return(
    <div style={{ width: "100%" }}>
        <FormControl sx={{ width: "100%" }}>
        <ReviewFormDiv>
          <MusicIcon color={musicIconColor} onClick={() => handleListenedChange()}>
            <FontAwesomeIcon  
              icon={faMusic} />
          </MusicIcon> <br></br>
          <ListenedBox>
            {listened ? "Listened" : "Listened?"}
          </ListenedBox>
          <ListIcon color={listIconColor} onClick={() => handleListenListChange()}>
            <FontAwesomeIcon icon={faList} />
          </ListIcon> <br></br>
          <ListBox>
            {listenList ? "On your listen list" : "Add to listen list?"}
          </ListBox>
          { editMode
          ? <><TextField
              error={numberRating.error !== ""}
              value={numberRating.value}
              sx={{ width: "6em", gridColumn: "5 / span 2", gridRow: "1", justifySelf: "center" }}
              onChange={event => handleNumberRatingChange(event)}
              InputLabelProps={{
              shrink: true,
              }}
            /> <br></br></>
          : <RatingText onClick={() => setEditMode(!editMode)}> 
            { numberRating.value !== "" ? `${numberRating.value}` : `-` } <br></br> 
          </RatingText>
          }
        <NumberRatingBox>
          {`Rating`} <br></br> {`(0.0 - 10.0)`}
        </NumberRatingBox>
        <FormText style={{ gridColumn: "1 / span 2", gridRow: "3" }} > Your thoughts: </FormText>
        <div style={{ gridColumn:"3 / span 4", gridRow:"3" }}>
          { editMode 
          ? <TextField
              sx={{ width: "95%" }}
              value={textReview}
              onChange={e => {
                if (e.target.value.length < MAX_REVIEW_LENGTH){
                  setTextReview(e.target.value)
                }
              }}
              placeholder = "Review the album here..."
              multiline
              rows={5}
          />
          : <div onClick={() => setEditMode(true)}> { textReview !== "" ? textReview : `None. (Click to edit!)` } </div>
          }
        </div>
        <ErrorText>
          {numberRating.error !== "" ? `${numberRating.error}` : null}
        </ErrorText>
        <span style={{ display: visibleOnEdit, gridRow:"4 / span 1", gridColumn:"3 / span 2", justifySelf: "end" }}>
        <DeclineButton 
          onclick={() => setEditMode(!editMode)}
          text={"Stop editing"}
        />
        </span>
        <span style={{ display: visibleOnEdit, gridRow:"4 / span 1", gridColumn:"5 / span 2", justifySelf: "end" }}>
        <AcceptButton 
          onclick={() => handleFormSubmit()}
          text={"Submit"}
          disabled={isPosting}
          /> 
        </span>
        </ReviewFormDiv>
        </FormControl>
    </div>
  )
}

export default ReviewForm