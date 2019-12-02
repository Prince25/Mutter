import firebase from '../../config/fbConfig'

/** 
 * @method signIn
 * @description Represents our function for signing in through email with Firebase.
 * @param {object} credentials - crendentials for the users who is logging in.
 * @param {string} credentials.email - email of the user logging in.
 * @param {string} credentials.password - password of the user logging in.
 * @returns {null} 
 */


export const signIn = (credentials) => {
  return (dispatch, getState) => {

    // Make async call to database
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then(() => {
        dispatch({type: 'LOGIN_SUCCESS'})
    }).catch((err) => {
        dispatch({type: 'LOGIN_ERROR', err})
    })
  }
}

/** 
 * @method signUp
 * @description Represents our function for signing up through email with Firebase.
 * @param {object} newUser - crendentials for the users who is logging in.
 * @param {string} newUser.name - name of the user who just signed up.
 * @param {string} newUser.email - email of the user who just signed up.
 * @param {string} newUser.password - password of the user who just signed up.
 * @returns {null}
 */

export const signUp = (newUser) => {
  return (dispatch, getState, {getFirestore}) => {

    const firestore = getFirestore()

    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    ).then((resp) => {
      firestore.collection('users').doc(resp.user.uid).set({
        name: newUser.name,
        following: [],
        followers: [],
        groups: [],
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mutter-ucla.appspot.com/o/users%2Fdefault_stick.png?alt=media&token=817a47dd-6485-45e4-91d1-18718b06947f'
      })
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' })
    }).catch(err => {
      dispatch({ type: 'SIGNUP_ERROR', err})
    })
  }
}

/** 
 * @method signOut
 * @description Represents our function for logging out users.
 * @param {function} dispatch - a function through which Redux dispatches an action.
 * @param {function} getState - a function that returns the current state of the Redux store.
 * @returns {Object}
 */

export const signOut = () => {
  return (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
      dispatch({type: 'SIGNOUT_SUCCESS'})
    })
  }
}


export const updateImage = (uId, imageUrl) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()

    firestore.collection('users').doc(uId).update({
      imageUrl: imageUrl
    }).then(() => {
      dispatch({ type: 'USER_IMAGE', uId })
    }).catch((err) => {
      dispatch({ type: 'USER_IMAGE_ERROR', err })
    })
  }
}


export const followUser = (uId, followingId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()

    //get users collection
    let userCollectionRef = firestore.collection('users');

    //add to list of users user is following
    userCollectionRef.doc(uId).update({
      following: firestore.FieldValue.arrayUnion(followingId)
    }).then(() => {
      dispatch({ type: 'FOLLOW_USER', uId, followingId })
    }).catch((err) => {
      dispatch({ type: 'FOLLOW_USER_ERROR', err })
    });

    //add user to other user's followers list
    userCollectionRef.doc(followingId).update({
      followers: firestore.FieldValue.arrayUnion(uId)
    }).then(() => {
      dispatch({ type: 'ADD_FOLLOWER', uId, followingId })
    }).catch((err) => {
      dispatch({ type: 'ADD_FOLLOWER_ERROR', err })
    });

  }
}


export const unfollowUser = (uId, followingId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()

    //get users collection
    let userCollectionRef = firestore.collection('users');

    //remove from list of users user is following
    userCollectionRef.doc(uId).update({
      following: firestore.FieldValue.arrayRemove(followingId)
    }).then(() => {
      dispatch({ type: 'UNFOLLOW_USER', uId, followingId })
    }).catch((err) => {
      dispatch({ type: 'UNFOLLOW_USER_ERROR', err })
    });

    //remove user from other user's followers list
    userCollectionRef.doc(followingId).update({
      followers: firestore.FieldValue.arrayRemove(uId)
    }).then(() => {
      dispatch({ type: 'REMOVE_FOLLOWER', uId, followingId })
    }).catch((err) => {
      dispatch({ type: 'REMOVE_FOLLOWER_ERROR', err })
    });

  }
}

export const updateToken = (uId, token) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()

    firestore.collection('users').doc(uId).update({
      spotify_token: token
    }).then(() => {
      dispatch({ type: 'SPOTIFY_TOKEN', uId })
    }).catch((err) => {
      dispatch({ type: 'SPOTIFY_TOKEN_ERROR', err })
    })
  }
}
