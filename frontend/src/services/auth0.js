
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

export default { dropStartOfSub, setHeaderToken }