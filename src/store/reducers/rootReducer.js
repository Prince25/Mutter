import authReducer from './authReducer'
import projectReducer from './projectReducer'
import postReducer from './postReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'


const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  post: postReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer
