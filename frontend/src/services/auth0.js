const dropSubPrefix = (string) => {
    if(string.includes("auth0|")){
      return string.split("|").pop()
    }
    return string
  }

export default { dropSubPrefix }