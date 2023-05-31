import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import Theme from "./styling/theme.js"
import "./styling/fonts.css"
import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Router>
    <Theme>
      <App />
    </Theme>
  </Router>
)
