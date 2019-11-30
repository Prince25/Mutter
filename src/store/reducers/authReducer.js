
const initState = {
  authError: null
}

const authReducer = (state = initState, action) => {
  
  switch(action.type){
    case 'LOGIN_ERROR':
      console.log('login error')
      return {
        ...state,
        authError: 'Login Failed!'
      }

    case 'LOGIN_SUCCESS':
      console.log('login success')
      return {
        ...state,
        authError: null
      }

    case 'SIGNOUT_SUCCESS':
      console.log('signout success')
      return state

    case 'SIGNUP_SUCCESS':
      console.log('signup success')
      return {
        ...state,
        authError: null
      }

    case 'SIGNUP_ERROR':
      console.log('signup error')
      return {
        ...state,
        authError: action.err.message
      }

    case 'USER_IMAGE': 
      console.log('Updated user image', action.uId, action.imageUrl)
      return state

    case 'USER_IMAGE_ERROR': 
      console.log('Update user image error', action.err)
      return state

    case 'FOLLOW_USER': 
      console.log('User ', action.uId, 'followed new user', action.followingId)
      return state

    case 'FOLLOW_USER_ERROR': 
      console.log('Follow new user error', action.err)
      return state

    case 'UNFOLLOW_USER': 
      console.log('User', action.uId, 'unfollowed new user', action.followingId)
      return state

    case 'UNFOLLOW_USER_ERROR': 
      console.log('Unfollow new user error', action.err)
      return state

    case 'ADD_FOLLOWER': 
      console.log('User', action.followingId, 'got new follower', action.uId)
      return state

    case 'ADD_FOLLOWER_ERROR': 
      console.log('Add new follower error', action.err)
      return state

    case 'REMOVE_FOLLOWER': 
      console.log('User', action.followingId, 'lost follower', action.uId)
      return state

    case 'REMOVE_FOLLOWER_ERROR': 
      console.log('Remove follower error', action.err)
      return state

    case 'SPOTIFY_TOKEN': 
      console.log('Updated user spotify token', action.uId, action.token)
      return state

    case 'SPOTIFY_TOKEN_ERROR': 
      console.log('Update user spotify token error', action.err)
      return state

    case 'JOIN_GROUP': 
      console.log('Group', action.groupId, 'added to user', action.uId, 'list of groups')
      return state

    case 'JOIN_GROUP_ERROR': 
      console.log('Join group error', action.err)
      return state

    case 'LEAVE_GROUP': 
      console.log('Group', action.groupId, 'removed from user', action.uId, 'list of groups')
      return state

    case 'LEAVE_GROUP_ERROR': 
      console.log('Leave group error', action.err)
      return state

    default:
      return state
  }
}


export default authReducer