import React from "react"
import { ThemeProvider } from "styled-components"

const theme = {
  headerMargin: "3em",
  fonts: {
    sizes: {
      titleSmall: "24px",
      bodyBig: "18px",
      bodyMedium: "14px",
      bodySmall: "10px"
    }
  },
  colors: {
    primaryOne: "#FF0000",
    primaryTwo: "#0047FF",
    primaryThree: "#FFFFFF",
  },
  titleFonts: "Archivo Black, Archivo, sans-serif",
  bodyFonts: "Archivo, sans-serif",
  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em"
  }
}

const Theme = ({ children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export default Theme