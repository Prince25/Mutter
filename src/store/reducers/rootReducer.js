import authReducer from './authReducer'
import projectReducer from './projectReducer'
import groupReducer from './groupReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'


const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  group: groupReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});


export default rootReducer
