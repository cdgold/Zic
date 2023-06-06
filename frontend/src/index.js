import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import Theme from "./styling/theme.js"
import "./styling/fonts.css"
import App from "./App"
import { Auth0Provider } from "@auth0/auth0-react"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Auth0Provider 
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: "http://localhost:3000/profile/"
    }}
  >
    <Router>
      <Theme>
        <App />
      </Theme>
    </Router>
  </ Auth0Provider>
)
