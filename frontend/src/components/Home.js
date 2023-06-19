import React, { useEffect, useState } from "react"
import { useAuth0 } from '@auth0/auth0-react'
import followerService from "../services/follower.js"
import albumService from "../services/album.js"
import dummyResults from "../test/dummySpotifyAlbums.js"

const dummyPosts = [{
  "id_being_followed": "647a59e1fc60c55ea86431b0",
  "review_text": "Favorite concept album. Takes you through a breakup while having each song be a distinct feeling of that breakup.",
  "rating": 90,
  "album_id": "5zi7WsKlIiUXv09tbGLKsE",
  "post_time": "2023-06-13T22:19:30.291Z"
},
{
  "id_being_followed": "647a59e1fc60c55ea86431b0",
  "review_text": "First Tyler album where he said \"man what if i didn't scream with my friends about my daddy issues for an hour\"",
  "rating": 9,
  "album_id": "2nkto6YNI4rUYTLqEwWJ3o",
  "post_time": "2023-06-13T20:10:58.467Z"
},
{
  "id_being_followed": "647a59e1fc60c55ea86431b0",
  "review_text": "Favorite concept album. Takes you through a breakup while having each song be a distinct feeling of that breakup.",
  "rating": 90,
  "album_id": "5zi7WsKlIiUXv09tbGLKsE",
  "post_time": "2023-06-13T22:19:30.291Z"
}
]

const dummyUsers = [{
    "nickname": "wagabaga",
    "name": "cdgold10@gmail.com",
    "picture": "https://s.gravatar.com/avatar/740afe23b2ac6c029cde1ebfba6dc9e3?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fcd.png",
    "updated_at": "2023-06-18T18:43:25.673Z",
    "email": "cdgold10@gmail.com",
    "email_verified": false,
    "sub": "auth0|6480e17568a768f0729a1d0a"
}]


const FollowingPostRow = ({ post, allAlbumInfo, allUserInfo }) => {
  const [thisAlbum, setThisAlbum] = useState(null)
  const [thisUser, setThisUser] = useState(null)

  useEffect(() => {
    if (Array.isArray(allAlbumInfo) && allAlbumInfo.length > 0){
      const foundAlbum = allAlbumInfo.find((album) => album.id === post.album_id)
      if (typeof foundAlbum !== "undefined"){
        setThisAlbum(foundAlbum)
      }
    }
  }, [post, allAlbumInfo])

  useEffect(() => {
    if (Array.isArray(allUserInfo) && allUserInfo.length > 0){
      const foundUser = allUserInfo.find((user) => user.id === post.auth0_id)
      if (typeof foundUser !== "undefined"){
        setThisUser(foundUser)
      }
    }
  }, [post, allAlbumInfo])

  console.log("Post: ", post, " album: ", thisAlbum, "user: ", thisUser)

  if(thisAlbum !== null && thisUser !== null){
  return(
    <div>
      {thisAlbum.images[0].url} {post.review_text} posted by {thisUser.nickname} on {post.post_time}
    </div>
  )
  }
  return(null)
}

const Home = ({ following, setFollowing }) => {
  const {
    isLoading,
    user
  } = useAuth0();


  const [followingPosts, setFollowingPosts] = useState(null)
  const [albumInfo, setAlbumInfo] = useState(null)

  console.log("albumInfo: ", dummyResults)
  console.log("dummy users is: ", dummyUsers)

  useEffect(() => {
    setAlbumInfo(dummyResults.albums)
    setFollowingPosts(dummyPosts)
    setFollowing(dummyUsers)
  }, [])


  /*
  useEffect(() => {
    if(following === null && typeof user !== "undefined" && typeof user.sub !== "undefined"){
      console.log("First part ")
      followerService.getFollowingPosts({ "userID": user.sub })
        .then((response) => {
          if (response !== null){
            setFollowingPosts(response.posts)
            setFollowing(response.users)
          }
          else {
            setFollowingPosts([])
            setFollowing([])
          }
        })
        .catch((error) => { 
          setFollowingPosts([])
          setFollowing([])
          setAlbumInfo([])
        })
    } else if (Array.isArray(following) && following.length > 0){
      followerService.getFollowingPosts({ "userID": user.sub, "userInfo": false })
        .then((response) => {
          if (response !== null){
            setFollowingPosts(response.posts)
          }
          else {
            setFollowingPosts([])
          }
        })
        .catch((error) => { 
          setFollowingPosts([])
          setAlbumInfo([])
        })
    } else {
      setFollowingPosts([])
    }
  }, [user, following])

  useEffect(() => {
    if (Array.isArray(followingPosts) && followingPosts.length > 0){
      //console.log("Fetching")
      const albumsToGet = followingPosts.reduce((allAlbumInfo, currentReview) => {
        if(!(allAlbumInfo.includes(currentReview.album_id))){
          allAlbumInfo.push(currentReview.album_id)
        }
        return allAlbumInfo
      }, [])
      //console.log("Albums to get is: ", albumsToGet)
      if (albumsToGet.length > 0){
        albumService.getMultipleSpotifyAlbums(albumsToGet)
          .then((response) => {
            setAlbumInfo(response.albums)  
          })
          .catch((response) => {
            setAlbumInfo([])
          })
      }
    } else {
      console.log("setting to default")
      setAlbumInfo([])
    }
  }, [followingPosts])
  */

  if (typeof user === "undefined" && !(isLoading)){
    return(
      <div>
        Sign in or sign up.
      </div>
    )
  }
  if (isLoading || followingPosts === null || albumInfo === null) {
    return(
      <div>
        Loading...
      </div>
    )
  }
  return(
    <div>
      Welcome back, {`${user.nickname}`}!
      {(Array.isArray(followingPosts) && followingPosts.length > 0) 
      ? <>{`From those you follow:`}
        {followingPosts.map((post) => <FollowingPostRow post={post} allUserInfo={following} allAlbumInfo={albumInfo} />)}
      </>
      : <> {`No posts from those you follow.`} </>
      }
    </div>
  )
}

export default Home