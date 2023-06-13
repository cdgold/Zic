
import axios from "axios"

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/api/users`

let token = null

const search = async ({ query }) => {
    const config = []
    const getUrl = `${baseUrl}/search/${query}`
    const userResponse = await axios.get(getUrl, config)
    console.log(`Returning: ${userResponse.data}`)
    return userResponse.data
}

const getUserProfile = async ({ id }) => {
    const getUrl = `${baseUrl}/${id}`
    const userResponse = await axios.get(getUrl)
    console.log(`Returning: ${userResponse.data}`)
    return userResponse.data
}

export default {
  search
}