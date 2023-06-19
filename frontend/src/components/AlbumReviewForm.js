import React, { useState, useEffect } from "react"
import { FormControl, TextField, Button } from "@mui/material"
import styled, { useTheme } from "styled-components"

const ReviewFormDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-template-rows: 1fr, 3fr, 1fr;
  width: 400px;
`

const FormTitle = styled.div`
  font-family: ${props => props.theme.titleFonts};
  font-size: ${props => props.theme.fonts.sizes.titleSmall};
  text-align: center;
`

const FormText = styled.div`
  font-family: ${props => props.theme.bodyFonts};
  font-size: ${props => props.theme.fonts.sizes.bodyMedium};
`

const RatingText = styled.div`
font-family: ${props => props.theme.titleFonts};
font-size: ${props => props.theme.fonts.sizes.titleSmall};
`

const NumberRatingBox = styled.div` 
  grid-column: 5 / span 2;
  grid-row: 1;
  justify-self: center;
  align-self: center;
  font-family: ${props => props.theme.bodyFonts};
  font-size: ${props => props.theme.fonts.sizes.bodySmall};
  text-align: center;
`

const ErrorText = styled.div`
  color: ${props => props.theme.colors.error};
  grid-column: 1 / span 3;
  grid-row: 3;
  text-align: right;
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
  setEditMode }) => {
  
  const theme = useTheme()

  const [visibleOnEdit, setVisibleOnEdit] = useState("")

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
    if(isNaN(parsedFloat) || parsedFloat > 10.0 || parsedFloat < 0.0){
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
    if(userRating !== null && typeof userRating !== "undefined"){
      if(typeof userRating.review_text !== "undefined") {
        setTextReview(userRating.review_text)
      }
      if(typeof userRating.rating !== "undefined") {
        setNumberRating({"value": userRating.rating, "error": ""})
      }
      if(typeof userRating.listened !== "undefined") {
        setListened(userRating.listened)
      }
      if(typeof userRating.listenList !== "undefined") {
        setListened(userRating.listenList)
      }
    }
  }, [userRating])

  return(
    <div>
        <FormControl >
        <ReviewFormDiv>
        <button style={{ gridColumn: "1 / span 2", gridRow: 1 }} onClick={() => setListened(!listened)} > 
        {listened ? "Listened" : "Listened?"}
        </button>
        <button style={{ gridColumn: "3 / span 2", gridRow: 1 }} onClick={() => setListenList(!listenList)}> 
        {listenList ? "On your listen list" : "Add to listen list?"} 
        </button>
        <NumberRatingBox>
          { editMode
          ? <><TextField
              error={numberRating.error !== ""}
              value={numberRating.value}
              sx={{ width: "6em" }}
              onChange={event => handleNumberRatingChange(event)}
              InputLabelProps={{
              shrink: true,
              }}
            /> <br></br></>
          : <RatingText> { numberRating.value !== "" ? `${numberRating.value}` : `None` } <br></br> </RatingText>
          }
          {`Rating`} <br></br> {`(0.0 - 10.0)`}
        </NumberRatingBox>
        <FormText> Your thoughts: </FormText>
        <div style={{ gridColumn:"2 / span 5", gridRow:"2" }}>
          { editMode 
          ? <TextField
              sx={{ width: "95%" }}
              value={textReview}
              onChange={e => setTextReview(e.target.value)}
              placeholder = "Review the album here..."
              multiline
              rows={4}
          />
          : <div onClick={() => setEditMode(true)}> { textReview !== "" ? textReview : `None` } </div>
          }
        </div>
        <ErrorText>
          {numberRating.error !== "" ? `${numberRating.error}` : null}
        </ErrorText>
        <Button 
          sx={{ display: visibleOnEdit, color: "black", gridRow:"3 / span 1", gridColumn:"5 / span 2", fontFamily: `"Archivo Black", "Archivo", sans-serif` }} 
          onClick={() => handleFormSubmit()}> 
            Submit 
        </Button>
        </ReviewFormDiv>
        </FormControl>
    </div>
  )
}

export default ReviewForm