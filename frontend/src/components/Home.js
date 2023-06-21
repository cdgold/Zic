import React, { useEffect, useState } from "react"
import { useAuth0 } from '@auth0/auth0-react'
import followerService from "../services/follower.js"
import albumService from "../services/album.js"
import dummyResults from "../test/dummySpotifyAlbums.js"
import styled, { useTheme } from "styled-components"
import { Link } from "react-router-dom"

/*
const dummyPosts = [{
  "id_being_followed": "647a59e1fc60c55ea86431b0",
  "review_text": "Favorite concept album. Takes you through a breakup while having each song be a distinct feeling of that breakup.",
  "rating": "9.0",
  "album_id": "5zi7WsKlIiUXv09tbGLKsE",
  "post_time": "2023-06-13T22:19:30.291Z"
},
{
  "id_being_followed": "647a59e1fc60c55ea86431b0",
  "review_text": `First Tyler album where he said \"man what if i didn't scream with my friends about my daddy issues for an hour\"
  First Tyler album where he said \"man what if i didn't scream with my friends about my daddy issues for an hour\"
  First Tyler album where he said \"man what if i didn't scream with my friends about my daddy issues for an hour\"
  First Tyler album where he said \"man what if i didn't scream with my friends about my daddy issues for an hour\"`,
  "rating": "0.9",
  "album_id": "2nkto6YNI4rUYTLqEwWJ3o",
  "post_time": "2023-06-13T20:10:58.467Z"
},
{
  "id_being_followed": "647a59e1fc60c55ea86431b0",
  "review_text": "Favorite concept album. Takes you through a breakup while having each song be a distinct feeling of that breakup.",
  "rating": "9.0",
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
    "userID": "6480e17568a768f0729a1d0a"
}]
*/

const PostColumn = styled.div`
  font-family: ${props => props.theme.bodyFonts};
  min-width: 20rem;
  width: 80vw;
  display: flex;
  flex-direction: column;
  row-gap: 3em;
`

const PostRow = styled.div`
  display: grid;
  grid-template-columns: minmax(4rem, 10%) minmax(4rem, 20%) minmax(10rem, 60%);
  grid-template-rows: fit-content(18ch) 1fr;
  row-gap: 1rem;
  column-gap: .5rem;
`

const FollowingUserAvatar = styled.img`
  width: 80%;
  grid-column: 1;
  grid-row: 1 / span 2;
  border-radius: 50%;
  text-align: center;
`

const AlbumImageColumn = styled.div`
  grid-column: 2;
  grid-row: 2 / span 1; 
  width: 100%;
  text-align: center;
  font-size: ${props => props.theme.fonts.sizes.bodyMedium};
  font-family: ${props => props.theme.titleFonts};
`

const Title = styled.div`
  font-size: ${props => props.theme.fonts.sizes.titleSmall};
  color: black;
  font-family: ${props => props.theme.titleFonts};
`


const FollowingPostRow = ({ post, allAlbumInfo, allUserInfo }) => {
  const [thisAlbum, setThisAlbum] = useState(null)
  const [thisUser, setThisUser] = useState(null)
  const [displayDate, setDisplayDate] = useState(null)

  const theme = useTheme()

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
  }, [post, allUserInfo])

  useEffect(() => {
    if (post.post_time !== undefined) {
      const postDate = new Date(post.post_time)
      const postString = ((postDate.getMonth() > 8) ? (postDate.getMonth() + 1) : ('0' + (postDate.getMonth() + 1))) + '/' + 
      ((postDate.getDate() > 9) ? postDate.getDate() : ('0' + postDate.getDate())) + '/' + postDate.getFullYear()
      setDisplayDate(postString)
    }
  }, [post])

  console.log("Post: ", post, " album: ", thisAlbum, "user: ", thisUser)

  if(thisAlbum !== null && thisUser !== null){
  return(
    <PostRow>
      <div style={{ gridColumn: "1", gridRow: "1 / span 2", textAlign: "center" }}> 
        <Link style={{ color: "inherit", textDecoration: "none" }} to={`/profile/${thisUser.userID}`}>
          <FollowingUserAvatar src={thisUser.picture} alt={`User avatar of ${thisUser.nickname}`} />
          {thisUser.nickname} <br></br> 
        </Link>
      </div>
      <div style={{ gridColumn: "2 / span 2", gridRow: "1" }}> 
        {`Reviewed`} <b>{`${thisAlbum.name}`}</b> by <b>{`${thisAlbum.artists[0].name}`}</b> {displayDate ? ` on ${displayDate}` : null}  
      </div>
        <Link style={{ color: "inherit", textDecoration: "none" }} to={`/album/${thisAlbum.id}`}>
          <AlbumImageColumn>
            <img style={{ width: "100%" }} src={thisAlbum.images[0].url} alt={`Album cover of ${thisAlbum.name}`} />
            RATING <br></br> <span style={{ fontSize: `${theme.fonts.sizes.titleSmall}` }} > {post.rating} </span>
          </AlbumImageColumn>
        </Link>
      <div style={{ gridColumn: "3", gridRow: "2" }}>
        {post.review_text}
      </div>
    </PostRow>
  )
  }
  return(null)
}

const Home = ({ following, setFollowing }) => {
  const {
    isLoading,
    user
  } = useAuth0();

  const theme = useTheme() 

  const [followingPosts, setFollowingPosts] = useState(null)
  const [albumInfo, setAlbumInfo] = useState(null)

  
  console.log("followingPosts: ", followingPosts)
  console.log("albumInfo is: ", albumInfo)
  console.log("Following: ", following)

  /*
  useEffect(() => {
    setAlbumInfo(dummyResults.albums)
    setFollowingPosts(dummyPosts)
    setFollowing(dummyUsers)
  }, [])
*/

  
  useEffect(() => {
    if(following === null && typeof user !== "undefined" && typeof user.sub !== "undefined"){
      console.log("First part ")
      followerService.getFollowingPosts({ "userID": user.sub, "numPosts": 15 })
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
    <div style={{ display: "flex", flexDirection: "column", width: "95vw", alignItems: "center", minWidth: "20rem" }}>
      <div style={{ justifySelf: "center" }}>
      <Title>
        Recent posts
      </Title>
      {(Array.isArray(followingPosts) && followingPosts.length > 0) 
      ? <PostColumn>
        {followingPosts.map((post) => <FollowingPostRow post={post} allUserInfo={following} allAlbumInfo={albumInfo} />)}
        </PostColumn>
      : <> {`No posts from those you follow.`} </>
      }
      </div>
    </div>
  )
}

export default Home