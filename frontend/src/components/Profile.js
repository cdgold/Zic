import React from "react"
import { useAuth0 } from "@auth0/auth0-react"

const Profile = () => {
  const { user, isAuthenticated } = useAuth0()
  console.log(isAuthenticated)
  console.log(JSON.stringify(user, null, 2))
  console.log(user)
  return(
    <div>
        Profile!
    </div>
  )
}

export default Profile