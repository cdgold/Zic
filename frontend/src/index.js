import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import Theme from "./styling/theme.js"
import "./styling/fonts.css"
import App from "./App"
import { Auth0Provider } from "@auth0/auth0-react"
import { ThemeProvider } from "styled-components"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Auth0Provider 
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: `${process.env.REACT_APP_REDIRECT}/profile/`
    }
  }
  >
    <Router>
      <ThemeProvider theme={Theme}>
        <App />
      </ThemeProvider>
    </Router>
  </ Auth0Provider>
)
