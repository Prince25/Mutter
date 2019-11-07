import firebase from '../../config/fbConfig'


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


export const signUp = (newUser) => {
  return (dispatch, getState, {getFirestore}) => {

    const firestore = getFirestore()

    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    ).then((resp) => {
      firestore.collection('users').doc(resp.user.uid).set({
        name: newUser.name,
        initials: newUser.name[0]
      })
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' })
    }).catch(err => {
      dispatch({ type: 'SIGNUP_ERROR', err})
    })
  }
}


export const signOut = () => {
  return (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
      dispatch({type: 'SIGNOUT_SUCCESS'})
    })
  }
}