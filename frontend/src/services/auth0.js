import { useAuth0 } from "@auth0/auth0-react"

const dropStartOfSub = (string) => {
    if(string.includes("auth0|")){
      return string.split("|").pop()
    }
    return string
  }

const setHeaderToken = ({ token, config }) => {
    config.headers = { ...config["headers"], "Authorization": `Bearer ${token}` }
    return config
}

const attemptTokenSilently = async () => {
}

export default { dropStartOfSub, setHeaderToken, attemptTokenSilently }