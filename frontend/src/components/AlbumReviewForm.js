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
  font-size: ${props => props.theme.fonts.bodyMedium};
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
    handleFormSubmit }) => {
  
   const theme = useTheme()

  const handleNumberRatingChange = (event) => {
    const parsedFloat = parseFloat(event.target.value)
    let newNumberRating = {value: event.target.value}
    if(isNaN(parsedFloat) || parsedFloat > 10.0 || parsedFloat < 0.0){
      newNumberRating["error"] = "Please enter a number between 0.0 and 10.0"
    }
    else{     // value is a float between 0-10
      newNumberRating["error"] = ""
    }
    setNumberRating(newNumberRating)
  }

  useEffect(() => {
    if(userRating !== null && typeof userRating !== "undefined"){
      if(typeof userRating.review_text !== "undefined") {
        setTextReview(userRating.review_text)
      }
      if(typeof userRating.rating !== "undefined") {
        setNumberRating({"value": userRating.rating, "error": ""})
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
        <TextField
            sx={{ width: "5em", gridColumn: "5 / span 2", justifySelf: "center" }}
            error={numberRating.error !== ""}
            value={numberRating.value}
            type="number"
            onChange={event => handleNumberRatingChange(event)}
            InputLabelProps={{
            shrink: true,
            }}
        />
        <FormText> Your thoughts: </FormText>
        <TextField
            sx={{ gridColumn:"2 / span 5", gridRow:"2", width: "95%" }}
            value={textReview}
            onChange={e => setTextReview(e.target.value)}
            placeholder = "Review the album here..."
            multiline
            rows={4}
        />
        <Button sx={{ color: "black", gridRow:"3 / span 1", gridColumn:"5 / span 2", fontFamily: `"Archivo Black", "Archivo", sans-serif` }} onClick={() => handleFormSubmit()}> Submit changes </Button>
        </ReviewFormDiv>
        </FormControl>
    </div>
  )
}

export default ReviewForm